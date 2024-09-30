export const BorrowerOperationbi = [
   {
     "inputs": [],
     "name": "EthUnsupportedError",
     "type": "error"
   },
   {
     "inputs": [],
     "name": "InvalidAmountError",
     "type": "error"
   },
   {
     "anonymous": false,
     "inputs": [
       {
         "indexed": false,
         "internalType": "address",
         "name": "previousAdmin",
         "type": "address"
       },
       {
         "indexed": false,
         "internalType": "address",
         "name": "newAdmin",
         "type": "address"
       }
     ],
     "name": "AdminChanged",
     "type": "event"
   },
   {
     "anonymous": false,
     "inputs": [
       {
         "indexed": true,
         "internalType": "address",
         "name": "beacon",
         "type": "address"
       }
     ],
     "name": "BeaconUpgraded",
     "type": "event"
   },
   {
     "anonymous": false,
     "inputs": [
       {
         "indexed": true,
         "internalType": "address",
         "name": "_asset",
         "type": "address"
       },
       {
         "indexed": true,
         "internalType": "address",
         "name": "_borrower",
         "type": "address"
       },
       {
         "indexed": false,
         "internalType": "uint256",
         "name": "_feeAmount",
         "type": "uint256"
       }
     ],
     "name": "BorrowingFeePaid",
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
         "name": "implementation",
         "type": "address"
       }
     ],
     "name": "Upgraded",
     "type": "event"
   },
   {
     "anonymous": false,
     "inputs": [
       {
         "indexed": true,
         "internalType": "address",
         "name": "_asset",
         "type": "address"
       },
       {
         "indexed": true,
         "internalType": "address",
         "name": "_borrower",
         "type": "address"
       },
       {
         "indexed": false,
         "internalType": "uint256",
         "name": "arrayIndex",
         "type": "uint256"
       }
     ],
     "name": "VesselCreated",
     "type": "event"
   },
   {
     "anonymous": false,
     "inputs": [
       {
         "indexed": true,
         "internalType": "address",
         "name": "_asset",
         "type": "address"
       },
       {
         "indexed": true,
         "internalType": "address",
         "name": "_borrower",
         "type": "address"
       },
       {
         "indexed": false,
         "internalType": "uint256",
         "name": "_debt",
         "type": "uint256"
       },
       {
         "indexed": false,
         "internalType": "uint256",
         "name": "_coll",
         "type": "uint256"
       },
       {
         "indexed": false,
         "internalType": "uint256",
         "name": "stake",
         "type": "uint256"
       },
       {
         "indexed": false,
         "internalType": "enum IBorrowerOperations.BorrowerOperation",
         "name": "operation",
         "type": "uint8"
       }
     ],
     "name": "VesselUpdated",
     "type": "event"
   },
   {
     "inputs": [],
     "name": "DECIMAL_PRECISION",
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
     "name": "NAME",
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
     "name": "activePool",
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
         "name": "_asset",
         "type": "address"
       },
       {
         "internalType": "uint256",
         "name": "_assetSent",
         "type": "uint256"
       },
       {
         "internalType": "address",
         "name": "_upperHint",
         "type": "address"
       },
       {
         "internalType": "address",
         "name": "_lowerHint",
         "type": "address"
       }
     ],
     "name": "addColl",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [
       {
         "internalType": "address",
         "name": "_asset",
         "type": "address"
       },
       {
         "internalType": "uint256",
         "name": "_assetSent",
         "type": "uint256"
       },
       {
         "internalType": "uint256",
         "name": "_collWithdrawal",
         "type": "uint256"
       },
       {
         "internalType": "uint256",
         "name": "_debtTokenChange",
         "type": "uint256"
       },
       {
         "internalType": "bool",
         "name": "_isDebtIncrease",
         "type": "bool"
       },
       {
         "internalType": "address",
         "name": "_upperHint",
         "type": "address"
       },
       {
         "internalType": "address",
         "name": "_lowerHint",
         "type": "address"
       }
     ],
     "name": "adjustVessel",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [],
     "name": "adminContract",
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
         "name": "newImplementation",
         "type": "address"
       }
     ],
     "name": "authorizeUpgrade",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [],
     "name": "borrowerOperations",
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
         "name": "_asset",
         "type": "address"
       }
     ],
     "name": "claimCollateral",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [
       {
         "internalType": "address",
         "name": "_asset",
         "type": "address"
       }
     ],
     "name": "closeVessel",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [],
     "name": "collSurplusPool",
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
     "name": "communityIssuance",
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
     "name": "debtToken",
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
     "name": "defaultPool",
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
     "name": "feeCollector",
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
     "name": "gasPoolAddress",
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
         "name": "_asset",
         "type": "address"
       },
       {
         "internalType": "uint256",
         "name": "_debt",
         "type": "uint256"
       }
     ],
     "name": "getCompositeDebt",
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
         "name": "_asset",
         "type": "address"
       }
     ],
     "name": "getEntireSystemColl",
     "outputs": [
       {
         "internalType": "uint256",
         "name": "entireSystemColl",
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
         "name": "_asset",
         "type": "address"
       }
     ],
     "name": "getEntireSystemDebt",
     "outputs": [
       {
         "internalType": "uint256",
         "name": "entireSystemDebt",
         "type": "uint256"
       }
     ],
     "stateMutability": "view",
     "type": "function"
   },
   {
     "inputs": [],
     "name": "grvtStaking",
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
     "name": "initialize",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [],
     "name": "isAddressSetupInitialized",
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
         "internalType": "address",
         "name": "_asset",
         "type": "address"
       },
       {
         "internalType": "uint256",
         "name": "_assetAmount",
         "type": "uint256"
       },
       {
         "internalType": "uint256",
         "name": "_debtTokenAmount",
         "type": "uint256"
       },
       {
         "internalType": "address",
         "name": "_upperHint",
         "type": "address"
       },
       {
         "internalType": "address",
         "name": "_lowerHint",
         "type": "address"
       }
     ],
     "name": "openVessel",
     "outputs": [],
     "stateMutability": "nonpayable",
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
     "name": "priceFeed",
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
     "name": "renounceOwnership",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [
       {
         "internalType": "address",
         "name": "_asset",
         "type": "address"
       },
       {
         "internalType": "uint256",
         "name": "_debtTokenAmount",
         "type": "uint256"
       },
       {
         "internalType": "address",
         "name": "_upperHint",
         "type": "address"
       },
       {
         "internalType": "address",
         "name": "_lowerHint",
         "type": "address"
       }
     ],
     "name": "repayDebtTokens",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [
       {
         "internalType": "address[]",
         "name": "_addresses",
         "type": "address[]"
       }
     ],
     "name": "setAddresses",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [
       {
         "internalType": "address",
         "name": "_communityIssuance",
         "type": "address"
       }
     ],
     "name": "setCommunityIssuance",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [
       {
         "internalType": "address",
         "name": "_grvtStaking",
         "type": "address"
       }
     ],
     "name": "setGRVTStaking",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [],
     "name": "sortedVessels",
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
     "name": "stabilityPool",
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
     "name": "timelockAddress",
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
     "inputs": [],
     "name": "treasuryAddress",
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
         "name": "newImplementation",
         "type": "address"
       }
     ],
     "name": "upgradeTo",
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
     "inputs": [],
     "name": "vesselManager",
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
     "name": "vesselManagerOperations",
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
         "name": "_asset",
         "type": "address"
       },
       {
         "internalType": "uint256",
         "name": "_collWithdrawal",
         "type": "uint256"
       },
       {
         "internalType": "address",
         "name": "_upperHint",
         "type": "address"
       },
       {
         "internalType": "address",
         "name": "_lowerHint",
         "type": "address"
       }
     ],
     "name": "withdrawColl",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   },
   {
     "inputs": [
       {
         "internalType": "address",
         "name": "_asset",
         "type": "address"
       },
       {
         "internalType": "uint256",
         "name": "_debtTokenAmount",
         "type": "uint256"
       },
       {
         "internalType": "address",
         "name": "_upperHint",
         "type": "address"
       },
       {
         "internalType": "address",
         "name": "_lowerHint",
         "type": "address"
       }
     ],
     "name": "withdrawDebtTokens",
     "outputs": [],
     "stateMutability": "nonpayable",
     "type": "function"
   }
 ]
