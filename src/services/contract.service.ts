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
import { SUBSCRYPTS_ABI } from '../utils/abi';
import { ContractError } from '../utils/errors';

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

      // Check if subscription exists (nextPaymentDate > 0 indicates active subscription)
      if (subscription.nextPaymentDate === 0n) {
        return null;
      }

      return subscription;
    } catch (error) {
      throw new ContractError(
        `Failed to fetch subscription for plan ${planId}`,
        { planId: planId.toString(), subscriber, error }
      );
    }
  }

  /**
   * Create a subscription with SUBS tokens
   */
  async createSubscription(
    params: SubscriptionCreateParams
  ): Promise<SubscriptionCreateResult> {
    try {
      const tx = await this.contract.subscriptionCreate(
        params.planId,
        params.subscriber,
        params.recurring,
        params.remainingCycles,
        params.referral,
        params.onlyCreate,
        params.deductFrom
      );

      const receipt = await tx.wait();

      if (!receipt) {
        throw new ContractError('Transaction receipt not available');
      }

      // Extract subscription ID from event logs
      const subscriptionId = this.parseSubscriptionCreatedEvent(receipt);

      return {
        subscriptionId,
        alreadyExist: false // TODO: Parse from return value if needed
      };
    } catch (error) {
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
    params: PayWithUsdcParams
  ): Promise<PayWithUsdcResult> {
    try {
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

      const receipt = await tx.wait();

      if (!receipt) {
        throw new ContractError('Transaction receipt not available');
      }

      // Extract subscription ID from event logs
      const subscriptionId = this.parseSubscriptionCreatedEvent(receipt);

      // Parse USDC payment event for amounts
      const paymentData = this.parseUsdcPaymentEvent(receipt);

      return {
        subId: subscriptionId,
        subExist: false,
        subsPaid18: paymentData?.subsAmount18 || 0n,
        usdcSpent6: paymentData?.usdcSpent6 || 0n
      };
    } catch (error) {
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
