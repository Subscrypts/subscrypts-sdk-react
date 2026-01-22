/**
 * Token service for ERC20 token operations (SUBS and USDC)
 */

import { Contract, Signer } from 'ethers';
import { ERC20_ABI } from '../utils/subscryptsABI';
import { ContractError, InsufficientBalanceError } from '../utils/errors';

/**
 * Service class for ERC20 token operations
 */
export class TokenService {
  private contract: Contract;
  private decimals: number;
  private symbol: string;

  constructor(tokenAddress: string, signer: Signer, decimals: number, symbol: string) {
    this.contract = new Contract(tokenAddress, ERC20_ABI, signer);
    this.decimals = decimals;
    this.symbol = symbol;
  }

  /**
   * Get token balance for an address
   */
  async getBalance(address: string): Promise<bigint> {
    try {
      const balance = await this.contract.balanceOf(address);
      return balance;
    } catch (error) {
      throw new ContractError(
        `Failed to fetch ${this.symbol} balance`,
        { address, error }
      );
    }
  }

  /**
   * Get current allowance for a spender
   */
  async getAllowance(owner: string, spender: string): Promise<bigint> {
    try {
      const allowance = await this.contract.allowance(owner, spender);
      return allowance;
    } catch (error) {
      throw new ContractError(
        `Failed to fetch ${this.symbol} allowance`,
        { owner, spender, error }
      );
    }
  }

  /**
   * Approve spender to use tokens
   */
  async approve(spender: string, amount: bigint): Promise<string> {
    try {
      const tx = await this.contract.approve(spender, amount);
      const receipt = await tx.wait();

      if (!receipt) {
        throw new ContractError('Transaction receipt not available');
      }

      return receipt.hash;
    } catch (error) {
      throw new ContractError(
        `Failed to approve ${this.symbol}`,
        { spender, amount: amount.toString(), error }
      );
    }
  }

  /**
   * Check if balance is sufficient and approve if needed
   */
  async ensureAllowance(
    owner: string,
    spender: string,
    requiredAmount: bigint
  ): Promise<{ needsApproval: boolean; txHash?: string }> {
    // Check balance first
    const balance = await this.getBalance(owner);

    if (balance < requiredAmount) {
      throw new InsufficientBalanceError(
        requiredAmount,
        balance,
        this.symbol as 'SUBS' | 'USDC'
      );
    }

    // Check allowance
    const currentAllowance = await this.getAllowance(owner, spender);

    if (currentAllowance >= requiredAmount) {
      return { needsApproval: false };
    }

    // Approve
    const txHash = await this.approve(spender, requiredAmount);

    return { needsApproval: true, txHash };
  }

  /**
   * Get token contract instance
   */
  getContract(): Contract {
    return this.contract;
  }

  /**
   * Get token decimals
   */
  getDecimals(): number {
    return this.decimals;
  }

  /**
   * Get token symbol
   */
  getSymbol(): string {
    return this.symbol;
  }
}
