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

export const burn = async (signer: ethers.Signer, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.burn(amount);
};

export const burnFrom = async (signer: ethers.Signer, account: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.burnFrom(account, amount);
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
//           ADMIN & GOVERNANCE
// ==========================================

export const contractFreezeAccount = async (signer: ethers.Signer, account: string, freeze: boolean) => {
  const contract = getContract(signer);
  return await contract.contractFreezeAccount(account, freeze);
};

export const contractFundAddressCHG = async (signer: ethers.Signer, newAddress: string) => {
  const contract = getContract(signer);
  return await contract.contractFundAddressCHG(newAddress);
};

export const contractSanctionsContractCHG = async (signer: ethers.Signer, enabled: boolean, newContract: string) => {
  const contract = getContract(signer);
  return await contract.contractSanctionsContractCHG(enabled, newContract);
};

export const contractServiceAccountsCHG = async (signer: ethers.Signer, add: boolean, del: boolean, account: string) => {
  const contract = getContract(signer);
  return await contract.contractServiceAccountsCHG(add, del, account);
};

export const dexGovernanceCHG = async (signer: ethers.Signer, factory: string, router: string, pair: string, posMgr: string, quoter: string, usdc: string) => {
  const contract = getContract(signer);
  return await contract.dexGovernanceCHG(factory, router, pair, posMgr, quoter, usdc);
};

export const mintByAdmin = async (signer: ethers.Signer, to: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.mintByAdmin(to, amount);
};

export const burnByAdmin = async (signer: ethers.Signer, wallet: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.burnByAdmin(wallet, amount);
};

export const planGoveranceCHG = async (signer: ethers.Signer, creationCost: bigint, verifCost: bigint, commission: bigint) => {
  const contract = getContract(signer);
  return await contract.planGoveranceCHG(creationCost, verifCost, commission);
};

export const setHaltStates = async (signer: ethers.Signer, noTransfer: boolean, noPlan: boolean, noSub: boolean, noPay: boolean, noUSD: boolean) => {
  const contract = getContract(signer);
  return await contract.setHaltStates(noTransfer, noPlan, noSub, noPay, noUSD);
};

export const renounceOwnership = async (signer: ethers.Signer) => {
  const contract = getContract(signer);
  return await contract.renounceOwnership();
};

export const transferOwnership = async (signer: ethers.Signer, newOwner: string) => {
  const contract = getContract(signer);
  return await contract.transferOwnership(newOwner);
};

// ==========================================
//           SUBSCRIPTION & PLANS
// ==========================================

export const planChange = async (signer: ethers.Signer, planId: bigint, merchant: string, amount: bigint, frequency: bigint, referralBonus: bigint, commission: bigint, description: string, setAttribute: string, verifExpDate: bigint, active: boolean) => {
  const contract = getContract(signer);
  const descBytes = bytes32Encode(description);
  const attrBytes = bytes32Encode(setAttribute);
  return await contract.planChange(planId, merchant, amount, frequency, referralBonus, commission, descBytes, attrBytes, verifExpDate, active);
};

export const planChangeSubscriptionsBulk = async (signer: ethers.Signer, start: bigint, end: bigint, planId: bigint, amount: bigint, frequency: bigint, attribute: string, overrideRecurring: boolean) => {
  const contract = getContract(signer);
  const attrBytes = bytes32Encode(attribute);
  return await contract.planChangeSubscriptionsBulk(start, end, planId, amount, frequency, attrBytes, overrideRecurring);
};

export const planCreate = async (signer: ethers.Signer, currency: bigint, amount: bigint, frequency: bigint, description: string, setAttribute: string, referralBonus: bigint, value: bigint = 0n) => {
  const contract = getContract(signer);
  const descBytes = bytes32Encode(description);
  const attrBytes = bytes32Encode(setAttribute);
  return await contract.planCreate(currency, amount, frequency, descBytes, attrBytes, referralBonus, { value });
};

export const paySubscriptionWithUsdc = async (signer: ethers.Signer, planId: bigint, recurring: boolean, remainingCycles: bigint, referral: string, feeTier: bigint, deadline: bigint, nonce: bigint, permitDeadline: bigint, signature: string, maxUsdc: bigint) => {
  const contract = getContract(signer);
  const referralAddr = referral || ethers.ZeroAddress;
  return await contract.paySubscriptionWithUsdc(planId, recurring, remainingCycles, referralAddr, feeTier, deadline, nonce, permitDeadline, signature, maxUsdc);
};

export const subscriptionAttributeCHG = async (signer: ethers.Signer, subId: bigint, newAttribute: string) => {
  const contract = getContract(signer);
  const attrBytes = bytes32Encode(newAttribute);
  return await contract.subscriptionAttributeCHG(subId, attrBytes);
};

export const subscriptionCollect = async (signer: ethers.Signer, start: bigint, end: bigint, maxCollect: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollect(start, end, maxCollect);
};

export const subscriptionCollectByAddress = async (signer: ethers.Signer, subscriber: string, start: bigint, end: bigint, maxCollect: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollectByAddress(subscriber, start, end, maxCollect);
};

export const subscriptionCollectByPlan = async (signer: ethers.Signer, planId: bigint, start: bigint, end: bigint, maxCollect: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollectByPlan(planId, start, end, maxCollect);
};

export const subscriptionCollectPassive = async (signer: ethers.Signer, from: string, to: string) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollectPassive(from, to);
};

export const subscriptionCollectPassiveCHG = async (signer: ethers.Signer, enable: boolean, newMax: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionCollectPassiveCHG(enable, newMax);
};

export const subscriptionCreate = async (signer: ethers.Signer, planId: bigint, subscriber: string, recurring: boolean, remainingCycles: bigint, referral: string, onlyCreate: boolean, deductFrom: string) => {
  const contract = getContract(signer);
  const referralAddr = referral || ethers.ZeroAddress;
  return await contract.subscriptionCreate(planId, subscriber, recurring, remainingCycles, referralAddr, onlyCreate, deductFrom);
};

export const subscriptionGift = async (signer: ethers.Signer, planId: bigint, subscriber: string, referral: string, giveaway: boolean, deductFrom: string, timeBonus: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionGift(planId, subscriber, referral, giveaway, deductFrom, timeBonus);
};

export const subscriptionRecurringCHG = async (signer: ethers.Signer, subId: bigint, enabled: boolean, cycles: bigint) => {
  const contract = getContract(signer);
  return await contract.subscriptionRecurringCHG(subId, enabled, cycles);
};

export const subInternalBurn = async (signer: ethers.Signer, from: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.subInternalBurn(from, amount);
};

export const subInternalMint = async (signer: ethers.Signer, to: string, amount: bigint) => {
  const contract = getContract(signer);
  return await contract.subInternalMint(to, amount);
};

export const subTxIncrement = async (signer: ethers.Signer) => {
  const contract = getContract(signer);
  return await contract.subTxIncrement();
};

// ==========================================
//           PROXY & DIAMOND FACETS
// ==========================================

export const initialize = async (signer: ethers.Signer) => {
  const contract = getContract(signer);
  return await contract.initialize();
};

export const registerFacetSelector = async (signer: ethers.Signer, selector: string, facet: string) => {
  const contract = getContract(signer);
  return await contract.registerFacetSelector(selector, facet);
};

export const unregisterFacetSelector = async (signer: ethers.Signer, selector: string) => {
  const contract = getContract(signer);
  return await contract.unregisterFacetSelector(selector);
};

export const setFacetAdmin = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setFacetAdmin(module);
};

export const setFacetPaymentUsdc = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setFacetPaymentUsdc(module);
};

export const setFacetSubscription = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setFacetSubscription(module);
};

export const setFacetView = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setFacetView(module);
};

export const setProxyLogicAddress = async (signer: ethers.Signer, module: string) => {
  const contract = getContract(signer);
  return await contract.setProxyLogicAddress(module);
};

export const upgradeToAndCall = async (signer: ethers.Signer, newImpl: string, data: string) => {
  const contract = getContract(signer);
  return await contract.upgradeToAndCall(newImpl, data);
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

export const planAutoIncrement = async (runner: ethers.ContractRunner) => {
  return await getContract(runner)._planAutoIncrement();
};

export const subscriptionAutoIncrement = async (runner: ethers.ContractRunner) => {
  return await getContract(runner)._subscriptionAutoIncrement();
};

export const allowance = async (runner: ethers.ContractRunner, owner: string, spender: string) => {
  return await getContract(runner).allowance(owner, spender);
};

export const balanceOf = async (runner: ethers.ContractRunner, account: string) => {
  return await getContract(runner).balanceOf(account);
};

export const contractAddress = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractAddress();
};

export const contractFundAddress = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractFundAddress();
};

export const contractHaltCurrencyUSD = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltCurrencyUSD();
};

export const contractHaltNonServiceTransfers = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltNonServiceTransfers();
};

export const contractHaltPlanCreation = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltPlanCreation();
};

export const contractHaltSubcriptions = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltSubcriptions();
};

export const contractHaltSubscriptionPayments = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).contractHaltSubscriptionPayments();
};

export const convertOtherCurrencyToToken = async (runner: ethers.ContractRunner, amount: bigint) => {
  return await getContract(runner).convertOtherCurrencyToToken(amount);
};

export const convertTokenToOtherCurrency = async (runner: ethers.ContractRunner, amount: bigint) => {
  return await getContract(runner).convertTokenToOtherCurrency(amount);
};

export const decimals = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).decimals();
};

export const dexFactory = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexFactory();
};

export const dexPair = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexPair();
};

export const dexPositionManager = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexPositionManager();
};

export const dexQuoter = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexQuoter();
};

export const dexRouter = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexRouter();
};

export const dexUSDC = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).dexUSDC();
};

export const getContractDetails = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).getContractDetails();
};

export const getContractHaltStates = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).getContractHaltStates();
};

export const getPlan = async (runner: ethers.ContractRunner, planId: bigint) => {
  const result = await getContract(runner).getPlan(planId);
  return cleanPlan(result);
};

export const getPlans = async (runner: ethers.ContractRunner, start: bigint, end: bigint) => {
  const result = await getContract(runner).getPlans(start, end);
  const plans = result[0].map(cleanPlan);
  return [plans, result[1], result[2], result[3]]; // Plans, Start, End, Length
};

export const getPlanSubscription = async (runner: ethers.ContractRunner, planId: bigint, subscriber: string) => {
  const result = await getContract(runner).getPlanSubscription(planId, subscriber);
  return cleanSub(result);
};

export const getSubscription = async (runner: ethers.ContractRunner, subId: bigint) => {
  const result = await getContract(runner).getSubscription(subId);
  return cleanSub(result);
};

export const getSubscriptionAndPlanDetails = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).getSubscriptionAndPlanDetails();
};

export const getSubscriptions = async (runner: ethers.ContractRunner, start: bigint, end: bigint) => {
  const result = await getContract(runner).getSubscriptions(start, end);
  const subs = result[0].map(cleanSub);
  return [subs, result[1], result[2], result[3]];
};

export const getSubscriptionsByAddress = async (runner: ethers.ContractRunner, subscriber: string, start: bigint, end: bigint) => {
  const result = await getContract(runner).getSubscriptionsByAddress(subscriber, start, end);
  const subs = result[0].map(cleanSub);
  return [subs, result[1], result[2], result[3]];
};

export const getSubscriptionsByPlan = async (runner: ethers.ContractRunner, planId: bigint, start: bigint, end: bigint) => {
  const result = await getContract(runner).getSubscriptionsByPlan(planId, start, end);
  const subs = result[0].map(cleanSub);
  return [subs, result[1], result[2], result[3]];
};

export const name = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).name();
};

export const owner = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).owner();
};

export const planCreationCost = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).planCreationCost();
};

export const planDefaultCommission = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).planDefaultCommission();
};

export const sanctionsCheckEnabled = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).sanctionsCheckEnabled();
};

export const sanctionsContract = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).sanctionsContract();
};

export const subCheckSanctions = async (runner: ethers.ContractRunner, from: string, to: string) => {
  return await getContract(runner).subCheckSanctions(from, to);
};

export const subscriptionCollectPassiveEnabled = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).subscriptionCollectPassiveEnabled();
};

export const subscriptionCollectPassiveIndex = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).subscriptionCollectPassiveIndex();
};

export const subscriptionCollectPassiveMax = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).subscriptionCollectPassiveMax();
};

export const symbol = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).symbol();
};

export const tokenHolders = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).tokenHolders();
};

export const tokenTransactions = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).tokenTransactions();
};

export const totalSubscriptionsActive = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).totalSubscriptionsActive();
};

export const totalSupply = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).totalSupply();
};

export const UPGRADE_INTERFACE_VERSION = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).UPGRADE_INTERFACE_VERSION();
};

export const facetAdmin = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).facetAdmin();
};

export const facetSubscription = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).facetSubscription();
};

export const facetView = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).facetView();
};

export const proxyLogic = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).proxyLogic();
};

export const facetPaymentUsdc = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).facetPaymentUsdc();
};

export const getFacetSelector = async (runner: ethers.ContractRunner, selector: string) => {
  return await getContract(runner).getFacetSelector(selector);
};

export const listFacetSelectors = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).listFacetSelectors();
};

export const registeredSelectors = async (runner: ethers.ContractRunner, index: bigint) => {
  return await getContract(runner).registeredSelectors(index);
};

export const planVerificationCost = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).planVerificationCost();
};

export const proxiableUUID = async (runner: ethers.ContractRunner) => {
  return await getContract(runner).proxiableUUID();
};

export const quoteUsdcForSubs = async (runner: ethers.ContractRunner, subsOut: bigint, feeTier: bigint) => {
  return await getContract(runner).quoteUsdcForSubs(subsOut, feeTier);
};
