import { AbiItem } from "web3";


export const troveManagerAbi: readonly AbiItem[] = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_activePoolAddress",
				"type": "address"
			}
		],
		"name": "ActivePoolAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_baseRate",
				"type": "uint256"
			}
		],
		"name": "BaseRateUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_newBorrowerOperationsAddress",
				"type": "address"
			}
		],
		"name": "BorrowerOperationsAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_collSurplusPoolAddress",
				"type": "address"
			}
		],
		"name": "CollSurplusPoolAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_defaultPoolAddress",
				"type": "address"
			}
		],
		"name": "DefaultPoolAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_gasPoolAddress",
				"type": "address"
			}
		],
		"name": "GasPoolAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_lqtyStakingAddress",
				"type": "address"
			}
		],
		"name": "LQTYStakingAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_lqtyTokenAddress",
				"type": "address"
			}
		],
		"name": "LQTYTokenAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_L_ETH",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_L_LUSDDebt",
				"type": "uint256"
			}
		],
		"name": "LTermsUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_newLUSDTokenAddress",
				"type": "address"
			}
		],
		"name": "LUSDTokenAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_lastFeeOpTime",
				"type": "uint256"
			}
		],
		"name": "LastFeeOpTimeUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_liquidatedDebt",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_liquidatedColl",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_collGasCompensation",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_LUSDGasCompensation",
				"type": "uint256"
			}
		],
		"name": "Liquidation",
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
				"indexed": false,
				"internalType": "address",
				"name": "_newPriceFeedAddress",
				"type": "address"
			}
		],
		"name": "PriceFeedAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_attemptedLUSDAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_actualLUSDAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_ETHSent",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_ETHFee",
				"type": "uint256"
			}
		],
		"name": "Redemption",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_sortedTrovesAddress",
				"type": "address"
			}
		],
		"name": "SortedTrovesAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_stabilityPoolAddress",
				"type": "address"
			}
		],
		"name": "StabilityPoolAddressChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_totalStakesSnapshot",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_totalCollateralSnapshot",
				"type": "uint256"
			}
		],
		"name": "SystemSnapshotsUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_newTotalStakes",
				"type": "uint256"
			}
		],
		"name": "TotalStakesUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_newIndex",
				"type": "uint256"
			}
		],
		"name": "TroveIndexUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
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
				"internalType": "enum TroveManager.TroveManagerOperation",
				"name": "_operation",
				"type": "uint8"
			}
		],
		"name": "TroveLiquidated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_L_ETH",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_L_LUSDDebt",
				"type": "uint256"
			}
		],
		"name": "TroveSnapshotsUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
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
				"name": "_stake",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum TroveManager.TroveManagerOperation",
				"name": "_operation",
				"type": "uint8"
			}
		],
		"name": "TroveUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "BETA",
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
		"name": "BOOTSTRAP_PERIOD",
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
		"name": "BORROWING_FEE_FLOOR",
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
		"name": "CCR",
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
		"name": "LUSD_GAS_COMPENSATION",
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
		"name": "L_ETH",
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
		"name": "L_LUSDDebt",
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
		"name": "MAX_BORROWING_FEE",
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
		"name": "MCR",
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
		"name": "MINUTE_DECAY_FACTOR",
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
		"name": "MIN_NET_DEBT",
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
		"name": "PERCENT_DIVISOR",
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
		"name": "REDEMPTION_FEE_FLOOR",
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
		"name": "SECONDS_IN_ONE_MINUTE",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "TroveOwners",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "Troves",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "debt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "coll",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stake",
				"type": "uint256"
			},
			{
				"internalType": "enum TroveManager.Status",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint128",
				"name": "arrayIndex",
				"type": "uint128"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_100pct",
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
		"name": "activePool",
		"outputs": [
			{
				"internalType": "contract IActivePool",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "addTroveOwnerToArray",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "index",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "applyPendingRewards",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "baseRate",
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
				"internalType": "address[]",
				"name": "_troveArray",
				"type": "address[]"
			}
		],
		"name": "batchLiquidateTroves",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "borrowerOperationsAddress",
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
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "checkRecoveryMode",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "closeTrove",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decayBaseRateFromBorrowing",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_collDecrease",
				"type": "uint256"
			}
		],
		"name": "decreaseTroveColl",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
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
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_debtDecrease",
				"type": "uint256"
			}
		],
		"name": "decreaseTroveDebt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "defaultPool",
		"outputs": [
			{
				"internalType": "contract IDefaultPool",
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
				"internalType": "uint256",
				"name": "_LUSDDebt",
				"type": "uint256"
			}
		],
		"name": "getBorrowingFee",
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
				"name": "_LUSDDebt",
				"type": "uint256"
			}
		],
		"name": "getBorrowingFeeWithDecay",
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
		"name": "getBorrowingRate",
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
		"name": "getBorrowingRateWithDecay",
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
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "getCurrentICR",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "getEntireDebtAndColl",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "debt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "coll",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pendingLUSDDebtReward",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pendingETHReward",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
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
		"inputs": [],
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
		"inputs": [
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "getNominalICR",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "getPendingETHReward",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "getPendingLUSDDebtReward",
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
				"name": "_ETHDrawn",
				"type": "uint256"
			}
		],
		"name": "getRedemptionFeeWithDecay",
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
		"name": "getRedemptionRate",
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
		"name": "getRedemptionRateWithDecay",
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
				"name": "_price",
				"type": "uint256"
			}
		],
		"name": "getTCR",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "getTroveColl",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "getTroveDebt",
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
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getTroveFromTroveOwnersArray",
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
		"name": "getTroveOwnersCount",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "getTroveStake",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "getTroveStatus",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "hasPendingRewards",
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
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_collIncrease",
				"type": "uint256"
			}
		],
		"name": "increaseTroveColl",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
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
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_debtIncrease",
				"type": "uint256"
			}
		],
		"name": "increaseTroveDebt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isOwner",
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
		"name": "lastETHError_Redistribution",
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
		"name": "lastFeeOperationTime",
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
		"name": "lastLUSDDebtError_Redistribution",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "liquidate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_n",
				"type": "uint256"
			}
		],
		"name": "liquidateTroves",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lqtyStaking",
		"outputs": [
			{
				"internalType": "contract ILQTYStaking",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lqtyToken",
		"outputs": [
			{
				"internalType": "contract ILQTYToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lusdToken",
		"outputs": [
			{
				"internalType": "contract ILUSDToken",
				"name": "",
				"type": "address"
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
		"name": "priceFeed",
		"outputs": [
			{
				"internalType": "contract IPriceFeed",
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
				"internalType": "uint256",
				"name": "_LUSDamount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_firstRedemptionHint",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_upperPartialRedemptionHint",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_lowerPartialRedemptionHint",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_partialRedemptionHintNICR",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_maxIterations",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_maxFeePercentage",
				"type": "uint256"
			}
		],
		"name": "redeemCollateral",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "removeStake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "rewardSnapshots",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "ETH",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "LUSDDebt",
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
				"name": "_borrowerOperationsAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_activePoolAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_defaultPoolAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_stabilityPoolAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_gasPoolAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_collSurplusPoolAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_priceFeedAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_lusdTokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_sortedTrovesAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_lqtyTokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_lqtyStakingAddress",
				"type": "address"
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
				"name": "_borrower",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_num",
				"type": "uint256"
			}
		],
		"name": "setTroveStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sortedTroves",
		"outputs": [
			{
				"internalType": "contract ISortedTroves",
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
				"internalType": "contract IStabilityPool",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalCollateralSnapshot",
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
		"name": "totalStakes",
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
		"name": "totalStakesSnapshot",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "updateStakeAndTotalStakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
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
				"name": "_borrower",
				"type": "address"
			}
		],
		"name": "updateTroveRewardSnapshots",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
] as const
