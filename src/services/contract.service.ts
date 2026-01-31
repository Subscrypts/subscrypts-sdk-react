/**
 * Contract service for Subscrypts smart contract interactions
 */

import { Contract, TransactionReceipt, Interface } from 'ethers';
import {
  ContractSubscription,
  SubscriptionCreateParams,
  PayWithUsdcParams,
  SubscriptionCreateResult,
  PayWithUsdcResult
} from '../types';
import { SUBSCRYPTS_ABI, cleanSub } from '../contract';
import { ContractError } from '../utils/errors';
import { logger, formatLogValue } from '../utils/logger';

/**
 * Service class for interacting with Subscrypts smart contract
 */
export class ContractService {
  private contract: Contract;
  private contractInterface: Interface;

  constructor(contract: Contract) {
    this.contract = contract;
    this.contractInterface = new Interface(SUBSCRYPTS_ABI);
  }

  /**
   * Get subscription for a specific plan and subscriber
   */
  async getPlanSubscription(
    planId: string | bigint,
    subscriber: string
  ): Promise<ContractSubscription | null> {
    try {
      const planIdBigInt = typeof planId === 'string' ? BigInt(planId) : planId;

      const subscription = await this.contract.getPlanSubscription(
        planIdBigInt,
        subscriber
      );

      // Check if subscription exists (id === 0 means no subscription)
      if (subscription.id === 0n) {
        return null;
      }

      return cleanSub(subscription);
    } catch (error) {
      throw new ContractError(
        `Failed to fetch subscription for plan ${planId}`,
        { planId: planId.toString(), subscriber, error }
      );
    }
  }

  /**
   * Get full subscription data by subscription ID
   * Returns authoritative subscription state including nextPaymentDate
   */
  async getSubscription(
    subscriptionId: string | bigint
  ): Promise<ContractSubscription | null> {
    try {
      const subIdBigInt = typeof subscriptionId === 'string' ? BigInt(subscriptionId) : subscriptionId;

      const subscription = await this.contract.getSubscription(subIdBigInt);

      // Check if subscription exists
      if (!subscription || subscription.id === 0n) {
        return null;
      }

      return cleanSub(subscription);
    } catch (error) {
      throw new ContractError(
        `Failed to fetch subscription ${subscriptionId}`,
        { subscriptionId: subscriptionId.toString(), error }
      );
    }
  }

  /**
   * Get current subscription state for a plan/subscriber
   * Uses two-step lookup: getPlanSubscription → getSubscription
   *
   * Note: getPlanSubscription() returns subscriptionId but NOT the real nextPaymentDate.
   * We must call getSubscription(subscriptionId) to get the actual nextPaymentDate.
   */
  private async getSubscriptionState(
    planId: bigint,
    subscriber: string
  ): Promise<{ subscriptionId: bigint; nextPaymentDate: bigint }> {
    try {
      // Step 1: Get subscriptionId from plan/subscriber mapping
      // getPlanSubscription returns Subscription struct where 'id' is at index 0
      const planSubscription = await this.contract.getPlanSubscription(planId, subscriber);
      const subscriptionId = planSubscription?.id ?? planSubscription?.[0] ?? 0n;

      logger.debug('getPlanSubscription result:', {
        rawId: planSubscription?.id?.toString(),
        rawIndex0: planSubscription?.[0]?.toString(),
        resolvedId: subscriptionId.toString()
      });

      if (subscriptionId === 0n) {
        return { subscriptionId: 0n, nextPaymentDate: 0n };
      }

      // Step 2: Get full subscription record with real nextPaymentDate
      // getSubscription returns Subscription struct where 'nextPaymentDate' is at index 11
      const subscription = await this.contract.getSubscription(subscriptionId);
      const nextPaymentDate = subscription?.nextPaymentDate ?? subscription?.[11] ?? 0n;

      logger.debug('getSubscriptionState resolved:', {
        subscriptionId: subscriptionId.toString(),
        nextPaymentDate: nextPaymentDate.toString()
      });

      return { subscriptionId, nextPaymentDate };
    } catch (error) {
      logger.debug('getSubscriptionState error:', error);
      return { subscriptionId: 0n, nextPaymentDate: 0n };
    }
  }

  /**
   * Verify subscription payment by checking nextPaymentDate change
   * Uses two-step lookup for accurate state verification
   *
   * @returns subscriptionId if verification passes, null otherwise
   */
  private async verifySubscriptionPayment(
    planId: bigint,
    subscriber: string,
    previousNextPaymentDate: bigint
  ): Promise<bigint | null> {
    try {
      // Step 1: Get subscriptionId from plan/subscriber mapping
      // 'id' field is at index 0 in the Subscription struct
      const planSubscription = await this.contract.getPlanSubscription(planId, subscriber);
      const subscriptionId = planSubscription?.id ?? planSubscription?.[0] ?? 0n;

      if (subscriptionId === 0n) {
        return null;
      }

      // Step 2: Get full subscription record with real nextPaymentDate
      // 'nextPaymentDate' is at index 11 in the Subscription struct
      const subscription = await this.contract.getSubscription(subscriptionId);
      const nextPaymentDate = subscription?.nextPaymentDate ?? subscription?.[11] ?? 0n;

      logger.debug('verifySubscriptionPayment check:', {
        subscriptionId: subscriptionId.toString(),
        previousNextPaymentDate: previousNextPaymentDate.toString(),
        currentNextPaymentDate: nextPaymentDate.toString()
      });

      // Subscription exists and nextPaymentDate has changed (increased)
      if (nextPaymentDate > 0n && nextPaymentDate > previousNextPaymentDate) {
        return subscriptionId;
      }
      return null;
    } catch (error) {
      logger.debug('verifySubscriptionPayment error:', error);
      return null;
    }
  }

  /**
   * Create a subscription with SUBS tokens
   */
  async createSubscription(
    params: SubscriptionCreateParams
  ): Promise<SubscriptionCreateResult> {
    logger.group('createSubscription (SUBS)');
    logger.debug('Parameters:', formatLogValue(params));

    try {
      // Capture state before transaction
      const stateBefore = await this.getSubscriptionState(params.planId, params.subscriber);
      const previousNextPaymentDate = stateBefore.nextPaymentDate;
      logger.debug('State before:', formatLogValue(stateBefore));

      logger.info('Sending subscription transaction...');
      const tx = await this.contract.subscriptionCreate(
        params.planId,
        params.subscriber,
        params.recurring,
        params.remainingCycles,
        params.referral,
        params.onlyCreate,
        params.deductFrom
      );
      logger.debug('Transaction sent:', { hash: tx.hash });

      logger.info('Waiting for confirmation...');
      const receipt = await tx.wait();

      if (!receipt) {
        logger.error('Transaction receipt not available');
        logger.groupEnd();
        throw new ContractError('Transaction receipt not available');
      }

      logger.debug('Receipt received:', {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status,
        logsCount: receipt.logs?.length
      });

      // Try event parsing first
      let subscriptionId: bigint | null = null;
      try {
        subscriptionId = this.parseSubscriptionCreatedEvent(receipt);
        logger.debug('Event parsed successfully:', { subscriptionId: subscriptionId.toString() });
      } catch (parseError) {
        logger.warn('Event parsing failed, using fallback verification', parseError);
      }

      // Fallback: verify via contract state
      if (subscriptionId === null) {
        logger.debug('Verifying via contract state...');
        subscriptionId = await this.verifySubscriptionPayment(
          params.planId,
          params.subscriber,
          previousNextPaymentDate
        );

        if (subscriptionId === null) {
          logger.error('Fallback verification FAILED - nextPaymentDate did not change');
          logger.groupEnd();
          throw new ContractError(
            'Subscription verification failed: nextPaymentDate did not change',
            { txHash: receipt.hash }
          );
        }
        logger.success('Fallback verification succeeded');
      }

      logger.success(`Subscription created: ${subscriptionId}`);
      logger.groupEnd();

      return {
        subscriptionId,
        alreadyExist: previousNextPaymentDate > 0n
      };
    } catch (error) {
      logger.error('createSubscription failed:', error);
      logger.groupEnd();
      throw new ContractError('Failed to create subscription', {
        params,
        error
      });
    }
  }

  /**
   * Create a subscription with USDC (includes swap via Uniswap)
   */
  async paySubscriptionWithUsdc(
    params: PayWithUsdcParams,
    subscriber: string
  ): Promise<PayWithUsdcResult> {
    logger.group('paySubscriptionWithUsdc');
    logger.debug('Parameters:', formatLogValue(params));
    logger.debug('Subscriber:', subscriber);

    try {
      // STEP 1: Capture state BEFORE transaction
      const stateBefore = await this.getSubscriptionState(params.planId, subscriber);
      const previousNextPaymentDate = stateBefore.nextPaymentDate;
      logger.debug('Subscription state before:', formatLogValue(stateBefore));

      // STEP 2: Execute transaction
      logger.info('Sending USDC payment transaction...');
      const tx = await this.contract.paySubscriptionWithUsdc(
        params.planId,
        params.recurring,
        params.remainingCycles,
        params.referral,
        params.feeTier,
        params.deadline,
        params.nonce,
        params.permitDeadline,
        params.signature,
        params.maxUsdcIn6Cap
      );
      logger.debug('Transaction sent:', { hash: tx.hash });

      logger.info('Waiting for confirmation...');
      const receipt = await tx.wait();

      if (!receipt) {
        logger.error('Transaction receipt not available');
        logger.groupEnd();
        throw new ContractError('Transaction receipt not available');
      }

      logger.debug('Receipt received:', {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status,
        logsCount: receipt.logs?.length
      });

      // Log all receipt logs for debugging
      logger.debug('Transaction logs:', receipt.logs?.map((log: { address: string; topics: string[]; data: string }, i: number) => ({
        index: i,
        address: log.address,
        topicsCount: log.topics.length,
        dataLength: log.data?.length
      })));

      // STEP 3: Try event parsing first (might work)
      let subscriptionId: bigint | null = null;
      let paymentData: { subsAmount18: bigint; usdcSpent6: bigint } | null = null;

      try {
        subscriptionId = this.parseSubscriptionCreatedEvent(receipt);
        paymentData = this.parseUsdcPaymentEvent(receipt);
        logger.debug('Events parsed:', {
          subscriptionId: subscriptionId?.toString(),
          paymentData: formatLogValue(paymentData)
        });
      } catch (parseError) {
        logger.warn('Event parsing failed (expected for multi-contract tx):', parseError);
      }

      // STEP 4: If event parsing failed, verify via contract state
      if (subscriptionId === null) {
        logger.debug('Using fallback verification...');
        const stateAfter = await this.getSubscriptionState(params.planId, subscriber);
        logger.debug('State after:', formatLogValue(stateAfter));

        subscriptionId = await this.verifySubscriptionPayment(
          params.planId,
          subscriber,
          previousNextPaymentDate
        );

        if (subscriptionId === null) {
          logger.error('Fallback verification FAILED - nextPaymentDate did not change');
          logger.groupEnd();
          throw new ContractError(
            'Subscription verification failed: nextPaymentDate did not change',
            { txHash: receipt.hash, planId: params.planId.toString() }
          );
        }
        logger.success('Fallback verification succeeded');
      }

      const result = {
        subId: subscriptionId,
        subExist: previousNextPaymentDate > 0n,
        subsPaid18: paymentData?.subsAmount18 || 0n,
        usdcSpent6: paymentData?.usdcSpent6 || 0n
      };

      logger.success('USDC payment complete:', formatLogValue(result));
      logger.groupEnd();

      return result;
    } catch (error) {
      logger.error('paySubscriptionWithUsdc failed:', error);
      logger.groupEnd();
      throw new ContractError('Failed to pay subscription with USDC', {
        params,
        error
      });
    }
  }

  /**
   * Parse _subscriptionCreate event from transaction receipt
   */
  private parseSubscriptionCreatedEvent(receipt: TransactionReceipt): bigint {
    for (const log of receipt.logs) {
      try {
        const parsed = this.contractInterface.parseLog({
          topics: [...log.topics] as string[],
          data: log.data
        });

        if (parsed && parsed.name === '_subscriptionCreate') {
          return parsed.args.subscriptionId;
        }
      } catch {
        // Continue to next log if parsing fails
        continue;
      }
    }

    throw new ContractError(
      'Subscription ID not found in transaction logs',
      { txHash: receipt.hash }
    );
  }

  /**
   * Parse subscriptionPaidWithUsdc event from transaction receipt
   */
  private parseUsdcPaymentEvent(receipt: TransactionReceipt): {
    subsAmount18: bigint;
    usdcSpent6: bigint;
  } | null {
    for (const log of receipt.logs) {
      try {
        const parsed = this.contractInterface.parseLog({
          topics: [...log.topics] as string[],
          data: log.data
        });

        if (parsed && parsed.name === 'subscriptionPaidWithUsdc') {
          return {
            subsAmount18: parsed.args.subsAmount18,
            usdcSpent6: parsed.args.usdcSpent6
          };
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Get contract instance
   */
  getContract(): Contract {
    return this.contract;
  }
}
