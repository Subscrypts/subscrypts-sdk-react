/**
 * Subscrypts Contract Method Wrappers
 *
 * Direct contract method calls using ethers.js
 * These are utility functions for direct contract interaction
 */

import { ethers } from 'ethers';
import { SUBSCRYPTS_ABI } from './abis';
import { SUBSCRYPTS_ADDRESS } from './config';

// ==========================================
//               HELPERS
// ==========================================

export const getContract = (runner: ethers.ContractRunner) => {
  return new ethers.Contract(SUBSCRYPTS_ADDRESS, SUBSCRYPTS_ABI, runner);
};

export const bytes32Encode = (str: string): string => {
  try {
    if (!str) return ethers.ZeroHash;
    return ethers.encodeBytes32String(str);
  } catch (e) {
    console.error("Error encoding bytes32:", e);
    return ethers.ZeroHash;
  }
};

export const bytes32Decode = (hex: string): string => {
  try {
    return ethers.decodeBytes32String(hex).replace(/\0/g, '');
  } catch (e) {
    return hex; // Return raw if decode fails
  }
};

// ==========================================
//           ERC20 / BASIC TOKEN
// ==========================================

export const approve = async (signer: ethers.Signer, spender: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.approve(spender, amount);
};

export const transfer = async (signer: ethers.Signer, to: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.transfer(to, amount);
};

export const transferFrom = async (signer: ethers.Signer, from: string, to: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.transferFrom(from, to, amount);
};

// ==========================================
//           SUBSCRIPTION & PLANS
// ==========================================

export const subscriptionCreate = async (
  signer: ethers.Signer,
  planId: bigint,
  subscriber: string,
  recurring: boolean,
  remainingCycles: bigint,
  referral: string,
  onlyCreate: boolean,
  deductFrom: string
) => {
  const contract = getContract(signer);
  const referralAddr = referral || ethers.ZeroAddress;
  return await contract.subscriptionCreate(planId, subscriber, recurring, remainingCycles, referralAddr, onlyCreate, deductFrom);
};

export const paySubscriptionWithUsdc = async (
  signer: ethers.Signer,
  planId: bigint,
  recurring: boolean,
  remainingCycles: bigint,
  referral: string,
  feeTier: bigint,
  deadline: bigint,
  nonce: bigint,
  permitDeadline: bigint,
  signature: string,
  maxUsdc: bigint
) => {
  const contract = getContract(signer);
  const referralAddr = referral || ethers.ZeroAddress;
  return await contract.paySubscriptionWithUsdc(planId, recurring, remainingCycles, referralAddr, feeTier, deadline, nonce, permitDeadline, signature, maxUsdc);
};

// ==========================================
//               VIEW FUNCTIONS
// ==========================================

// Helper for cleaning Plan structs (decoding bytes32)
const cleanPlan = (p: any) => {
  return {
    id: p.id,
    merchantAddress: p.merchantAddress,
    currencyCode: p.currencyCode,
    subscriptionAmount: p.subscriptionAmount,
    paymentFrequency: p.paymentFrequency,
    referralBonus: p.referralBonus,
    commission: p.commission,
    description: bytes32Decode(p.description),
    defaultAttributes: bytes32Decode(p.defaultAttributes),
    verificationExpiryDate: p.verificationExpiryDate,
    subscriberCount: p.subscriberCount,
    isActive: p.isActive
  };
};

// Helper for cleaning Subscription structs
const cleanSub = (s: any) => {
  return {
    id: s.id,
    merchantAddress: s.merchantAddress,
    planId: s.planId,
    subscriberAddress: s.subscriberAddress,
    currencyCode: s.currencyCode,
    subscriptionAmount: s.subscriptionAmount,
    paymentFrequency: s.paymentFrequency,
    isRecurring: s.isRecurring,
    remainingCycles: s.remainingCycles,
    customAttributes: bytes32Decode(s.customAttributes),
    lastPaymentDate: s.lastPaymentDate,
    nextPaymentDate: s.nextPaymentDate
  };
};

export const getPlan = async (runner: ethers.ContractRunner, planId: bigint) => {
  const result = await getContract(runner).getPlan(planId);
  return cleanPlan(result);
};

export const getPlanSubscription = async (runner: ethers.ContractRunner, planId: bigint, subscriber: string) => {
  const result = await getContract(runner).getPlanSubscription(planId, subscriber);
  return cleanSub(result);
};

export const getSubscription = async (runner: ethers.ContractRunner, subId: bigint) => {
  const result = await getContract(runner).getSubscription(subId);
  return cleanSub(result);
};

export const allowance = async (runner: ethers.ContractRunner, owner: string, spender: string) => {
  return await getContract(runner).allowance(owner, spender);
};

export const balanceOf = async (runner: ethers.ContractRunner, account: string) => {
  return await getContract(runner).balanceOf(account);
};
