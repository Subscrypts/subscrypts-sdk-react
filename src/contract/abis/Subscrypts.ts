
export const subscryptsABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "ERC1967InvalidImplementation",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERC1967NonPayable",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UUPSUnauthorizedCallContext",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "slot",
        "type": "bytes32"
      }
    ],
    "name": "UUPSUnsupportedProxiableUUID",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "BurnByAdmin",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "facet",
        "type": "address"
      }
    ],
    "name": "FacetSelectorUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "frozen",
        "type": "bool"
      }
    ],
    "name": "FrozenFunds",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "MintByAdmin",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      }
    ],
    "name": "ServiceAccountChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "name": "UPGRADE_INTERFACE_VERSION",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_planAutoIncrement",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_subscriptionAutoIncrement",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_value",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "burnByAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "burnFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "acct",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "freeze",
        "type": "bool"
      }
    ],
    "name": "contractFreezeAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractFundAddress",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractHaltCurrencyUSD",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractHaltNonServiceTransfers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractHaltPlanCreation",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractHaltSubcriptions",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contractHaltSubscriptionPayments",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "addAcct",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "delAcct",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "acct",
        "type": "address"
      }
    ],
    "name": "contractServiceAccountsCHG",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dexFactory",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dexPair",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dexPositionManager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dexQuoter",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dexRouter",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dexUSDC",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facetAdmin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facetPaymentUsdc",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facetSubscription",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "facetView",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractDetails",
    "outputs": [
      {
        "internalType": "string",
        "name": "Symbol",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "Owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "ContractAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "ContractBalanceNative",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "ContractBalanceToken",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "TokenHolders",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "TokenTransactions",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "TotalSupply",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractHaltStates",
    "outputs": [
      {
        "internalType": "bool",
        "name": "ContracthaltNonServiceTransfers",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "ContracthaltPlanCreation",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "ContracthaltSubcriptions",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "ContracthaltSubscriptionPayments",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "ContracthaltCurrencyUSD",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "SanctionsCheckEnabled",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "SanctionsContract",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
      }
    ],
    "name": "getFacetSelector",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSubscriptionAndPlanDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "ContractFundAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "SubscriptionCollectPassiveEnabled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "SubscriptionCollectPassiveIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "SubscriptionCollectPassiveMax",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "TotalSubscriptionsActive",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "PlanCreationCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "PlanVerificationCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "PlanDefaultCommission",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "listFacetSelectors",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bytes4",
            "name": "selector",
            "type": "bytes4"
          },
          {
            "internalType": "address",
            "name": "facetAddress",
            "type": "address"
          }
        ],
        "internalType": "struct Subscrypts.FacetSelectorEntry[]",
        "name": "out",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "mintByAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "planCreationCost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "planDefaultCommission",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "planVerificationCost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxyLogic",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
      },
      {
        "internalType": "address",
        "name": "facetAddress",
        "type": "address"
      }
    ],
    "name": "registerFacetSelector",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "registeredSelectors",
    "outputs": [
      {
        "internalType": "bytes4",
        "name": "",
        "type": "bytes4"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sanctionsCheckEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sanctionsContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "subCheckSanctions",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "subInternalBurn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "subInternalMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "subTxIncrement",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "subscriptionCollectPassiveEnabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "subscriptionCollectPassiveIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "subscriptionCollectPassiveMax",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenHolders",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tokenTransactions",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSubscriptionsActive",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "selector",
        "type": "bytes4"
      }
    ],
    "name": "unregisterFacetSelector",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      }
    ],
    "name": "getPlan",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "merchantAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "currencyCode",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriptionAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentFrequency",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referralBonus",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "commission",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "description",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "defaultAttributes",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "verificationExpiryDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriberCount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct SubscryptsStorage.Plan",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      }
    ],
    "name": "getPlanSubscription",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "merchantAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "planId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "subscriberAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "currencyCode",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriptionAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentFrequency",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isRecurring",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "remainingCycles",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "customAttributes",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "lastPaymentDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nextPaymentDate",
            "type": "uint256"
          }
        ],
        "internalType": "struct SubscryptsStorage.Subscription",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      }
    ],
    "name": "getPlans",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "merchantAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "currencyCode",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriptionAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentFrequency",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referralBonus",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "commission",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "description",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "defaultAttributes",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "verificationExpiryDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriberCount",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          }
        ],
        "internalType": "struct SubscryptsStorage.Plan[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256",
        "name": "IndexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "PlanLength",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subscriptionid",
        "type": "uint256"
      }
    ],
    "name": "getSubscription",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "merchantAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "planId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "subscriberAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "currencyCode",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriptionAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentFrequency",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isRecurring",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "remainingCycles",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "customAttributes",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "lastPaymentDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nextPaymentDate",
            "type": "uint256"
          }
        ],
        "internalType": "struct SubscryptsStorage.Subscription",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      }
    ],
    "name": "getSubscriptions",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "merchantAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "planId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "subscriberAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "currencyCode",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriptionAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentFrequency",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isRecurring",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "remainingCycles",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "customAttributes",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "lastPaymentDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nextPaymentDate",
            "type": "uint256"
          }
        ],
        "internalType": "struct SubscryptsStorage.Subscription[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256",
        "name": "IndexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "SubscriptionLength",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      }
    ],
    "name": "getSubscriptionsByAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "merchantAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "planId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "subscriberAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "currencyCode",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriptionAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentFrequency",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isRecurring",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "remainingCycles",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "customAttributes",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "lastPaymentDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nextPaymentDate",
            "type": "uint256"
          }
        ],
        "internalType": "struct SubscryptsStorage.Subscription[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256",
        "name": "IndexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "SubscriberSubscriptionsLength",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      }
    ],
    "name": "getSubscriptionsByPlan",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "merchantAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "planId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "subscriberAddress",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "currencyCode",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "subscriptionAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "paymentFrequency",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "isRecurring",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "remainingCycles",
            "type": "uint256"
          },
          {
            "internalType": "bytes32",
            "name": "customAttributes",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "lastPaymentDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nextPaymentDate",
            "type": "uint256"
          }
        ],
        "internalType": "struct SubscryptsStorage.Subscription[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "uint256",
        "name": "IndexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "MerchantPlanSubscriptionsLength",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "facetAddr",
        "type": "address"
      }
    ],
    "name": "AdminFacetUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "newFundAddress",
        "type": "address"
      }
    ],
    "name": "ContractFundAddressChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "newSanctionsCheckEnabled",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newSanctionsContract",
        "type": "address"
      }
    ],
    "name": "ContractSanctionsChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "newDexFactory",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newDexRouter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newDexPair",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newDexPositionManager",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newDexQuoter",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newDexUSDC",
        "type": "address"
      }
    ],
    "name": "DexGovernanceChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "newHaltNonServiceTransfers",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "newHaltPlanCreation",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "newHaltSubscriptions",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "newHaltSubscriptionPayments",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "newHaltCurrencyUSD",
        "type": "bool"
      }
    ],
    "name": "HaltStatesChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "facetAddr",
        "type": "address"
      }
    ],
    "name": "PaymentUsdcUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newMerchant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newFrequency",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newReferralBonus",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newCommission",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "newDescription",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "newAttributes",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newVerifExpDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "newActive",
        "type": "bool"
      }
    ],
    "name": "PlanChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPlanCreationCost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPlanVerificationCost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newPlanDefaultCommission",
        "type": "uint256"
      }
    ],
    "name": "PlanGovernanceChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newFrequency",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "newAttribute",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "overrideRecurring",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "subscriptionChanged",
        "type": "uint256"
      }
    ],
    "name": "PlanSubscriptionsBulkChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "logicAddr",
        "type": "address"
      }
    ],
    "name": "ProxyLogicUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "newEnabled",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newMax",
        "type": "uint256"
      }
    ],
    "name": "SubscriptionCollectPassiveChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "facetAddr",
        "type": "address"
      }
    ],
    "name": "SubscriptionFacetUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "facetAddr",
        "type": "address"
      }
    ],
    "name": "ViewFacetUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "newcontractFundAddress",
        "type": "address"
      }
    ],
    "name": "contractFundAddressCHG",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "newSanctionsCheckEnabled",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "newSanctionsContract",
        "type": "address"
      }
    ],
    "name": "contractSanctionsContractCHG",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newDexFactory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "newDexRouter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "newDexPair",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "newDexPositionManager",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "newDexQuoter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "newDexUSDC",
        "type": "address"
      }
    ],
    "name": "dexGovernanceCHG",
    "outputs": [
      {
        "internalType": "address",
        "name": "updatedDexFactory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "updatedDexRouter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "updatedDexPair",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "updatedDexPositionManager",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "updatedDexQuoter",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "updateddexUSDC",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "merchant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "frequency",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "referralbonus",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "contractcommission",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "description",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "setAttribute",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "verifExpDate",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      }
    ],
    "name": "planChange",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "frequency",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "attribute",
        "type": "bytes32"
      },
      {
        "internalType": "bool",
        "name": "overrideRecurring",
        "type": "bool"
      }
    ],
    "name": "planChangeSubscriptionsBulk",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "IndexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "SubscriptionChanged",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newPlanCreationCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newPlanVerificationCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "newPlanDefaultCommission",
        "type": "uint256"
      }
    ],
    "name": "planGoveranceCHG",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "PlanCreationCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "PlanVerificationCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "PlanDefaultCommission",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "facetAddr",
        "type": "address"
      }
    ],
    "name": "setFacetAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "facetAddr",
        "type": "address"
      }
    ],
    "name": "setFacetPaymentUsdc",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "facetAddr",
        "type": "address"
      }
    ],
    "name": "setFacetSubscription",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "facetAddr",
        "type": "address"
      }
    ],
    "name": "setFacetView",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "haltNonServiceTransfers",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "haltPlanCreation",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "haltSubscriptions",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "haltSubscriptionPayments",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "haltCurrencyUSD",
        "type": "bool"
      }
    ],
    "name": "setHaltStates",
    "outputs": [
      {
        "internalType": "bool",
        "name": "IsHaltNonServiceTransfers",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "IsHaltPlanCreation",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "IsHaltSubscriptions",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "IsHaltSubscriptionPayments",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "IsHaltCurrencyUSD",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "logicAddr",
        "type": "address"
      }
    ],
    "name": "setProxyLogicAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "enable",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "newsubscriptionCollectPassiveMax",
        "type": "uint256"
      }
    ],
    "name": "subscriptionCollectPassiveCHG",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "currency",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "frequency",
        "type": "uint256"
      }
    ],
    "name": "_planCreate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "subscriptionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "planId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "recurring",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "remainingCycles",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "referral",
        "type": "address"
      }
    ],
    "name": "_subscriptionCreate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "subscriptionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "planId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "_subscriptionPay",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "subscriptionId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "merchant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "planId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      }
    ],
    "name": "_subscriptionRecurring",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "subscriptionid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "merchant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "planfk",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      }
    ],
    "name": "_subscriptionStop",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountUSDC18",
        "type": "uint256"
      }
    ],
    "name": "convertOtherCurrencyToToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "outputSUBS18",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "inputUSDC18",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value1USDCInSUBS",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amountSUBS18",
        "type": "uint256"
      }
    ],
    "name": "convertTokenToOtherCurrency",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "outputUSDC18",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "inputSUBS18",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value1SUBSInUSDC",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "currency",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "frequency",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "description",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "setAttribute",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "referralBonus",
        "type": "uint256"
      }
    ],
    "name": "planCreate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subscriptionid",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "newAttribute",
        "type": "bytes32"
      }
    ],
    "name": "subscriptionAttributeCHG",
    "outputs": [
      {
        "internalType": "bool",
        "name": "Success",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "Subscriptionid",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "NewAttribute",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxCollect",
        "type": "uint256"
      }
    ],
    "name": "subscriptionCollect",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "IndexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "MaxCollect",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "SubscriptionRenewed",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxCollect",
        "type": "uint256"
      }
    ],
    "name": "subscriptionCollectByAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "Subscriber",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "IndexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "MaxCollect",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "SubscriptionRenewed",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "planId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "indexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxCollect",
        "type": "uint256"
      }
    ],
    "name": "subscriptionCollectByPlan",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "PlanId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "IndexEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "MaxCollect",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "SubscriptionRenewed",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "subscriptionCollectPassive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "Success",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "recurring",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "remainingCycles",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "referral",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "onlycreate",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "deductfrom",
        "type": "address"
      }
    ],
    "name": "subscriptionCreate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "Subscriptionid",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "AlreadyExist",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "planid",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "referral",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "giveaway",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "deductfrom",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timebonus",
        "type": "uint256"
      }
    ],
    "name": "subscriptionGift",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "Planid",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "Subscriber",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "Referral",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "Success",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subscriptionid",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "setCycles",
        "type": "uint256"
      }
    ],
    "name": "subscriptionRecurringCHG",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "Subcriptionid",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "Recurring",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "RemainingCycles",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "subscriptionId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "subscriber",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "subsAmount18",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "usdcSpent6",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint24",
        "name": "feeTier",
        "type": "uint24"
      }
    ],
    "name": "subscriptionPaidWithUsdc",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "planId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "recurring",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "remainingCycles",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "referral",
        "type": "address"
      },
      {
        "internalType": "uint24",
        "name": "feeTier",
        "type": "uint24"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nonce",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "permitDeadline",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      },
      {
        "internalType": "uint256",
        "name": "maxUsdcIn6Cap",
        "type": "uint256"
      }
    ],
    "name": "paySubscriptionWithUsdc",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "subId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "subExist",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "subsPaid18",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "usdcSpent6",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subsOut18",
        "type": "uint256"
      },
      {
        "internalType": "uint24",
        "name": "feeTier",
        "type": "uint24"
      }
    ],
    "name": "quoteUsdcForSubs",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "usdcQuoted6",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SUBS",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "USDC",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "WETH9",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      }
    ],
    "name": "crossmintOnramp",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolFee1",
    "outputs": [
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "poolFee2",
    "outputs": [
      {
        "internalType": "uint24",
        "name": "",
        "type": "uint24"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_usdc",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_subs",
        "type": "address"
      },
      {
        "internalType": "uint24",
        "name": "_fee1",
        "type": "uint24"
      },
      {
        "internalType": "uint24",
        "name": "_fee2",
        "type": "uint24"
      }
    ],
    "name": "setConfig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_router",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_weth",
        "type": "address"
      }
    ],
    "name": "setInfrastructure",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "universalRouter",
    "outputs": [
      {
        "internalType": "contract IUniversalRouter",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_token",
        "type": "address"
      }
    ],
    "name": "withdrawToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
