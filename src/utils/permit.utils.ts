/**
 * PERMIT2 signature generation utilities
 *
 * PERMIT2 is Uniswap's universal token approval contract that allows
 * secure, gas-efficient token transfers using EIP-712 signatures.
 */

import { ethers } from 'ethers';
import { PERMIT2_ADDRESS } from '../constants';

/**
 * EIP-712 domain for PERMIT2 on Arbitrum One
 */
export const PERMIT2_DOMAIN = {
  name: 'Permit2',
  chainId: 42161,
  verifyingContract: PERMIT2_ADDRESS
} as const;

/**
 * EIP-712 types for PERMIT2 PermitTransferFrom
 */
export const PERMIT2_TYPES = {
  TokenPermissions: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' }
  ],
  PermitTransferFrom: [
    { name: 'permitted', type: 'TokenPermissions' },
    { name: 'spender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' }
  ]
};

/**
 * Generate PERMIT2 signature for token transfer
 *
 * This function creates a valid EIP-712 signature that allows the spender
 * to transfer tokens on behalf of the signer through PERMIT2.
 *
 * @param signer - Ethers signer (wallet) that will sign the permit
 * @param tokenAddress - Address of the token to permit (e.g., USDC)
 * @param amount - Amount of tokens to permit (in wei/token decimals)
 * @param spender - Address that will be allowed to spend tokens (e.g., Subscrypts contract)
 * @param deadline - Unix timestamp when the permit expires
 * @returns Object containing the signature and nonce
 *
 * @example
 * ```typescript
 * const { signature, nonce } = await generatePermit2Signature(
 *   signer,
 *   USDC_ADDRESS,
 *   parseUnits('100', 6), // 100 USDC
 *   SUBSCRYPTS_CONTRACT_ADDRESS,
 *   BigInt(Math.floor(Date.now() / 1000) + 1800) // 30 minutes
 * );
 * ```
 */
export async function generatePermit2Signature(
  signer: ethers.Signer,
  tokenAddress: string,
  amount: bigint,
  spender: string,
  deadline: bigint
): Promise<{ signature: string; nonce: string }> {
  // Generate random nonce for replay protection
  const nonce = ethers.hexlify(ethers.randomBytes(32));

  // Create EIP-712 message
  const message = {
    permitted: {
      token: tokenAddress,
      amount: amount.toString()
    },
    spender: spender,
    nonce: BigInt(nonce).toString(),
    deadline: deadline.toString()
  };

  // Sign typed data (will prompt user's wallet)
  const signature = await signer.signTypedData(
    PERMIT2_DOMAIN,
    PERMIT2_TYPES,
    message
  );

  return { signature, nonce };
}
