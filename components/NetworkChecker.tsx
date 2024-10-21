/* eslint-disable */
"use client";

import { useEffect } from "react"
import Web3 from "web3"

const TARGET_NETWORK_ID = 355113
const TARGET_CHAIN_NAME = "Bitfinity Testnet"
const BOTANIX_RPC_URL = "https://testnet.bitfinity.network"
const EXPLORER_URL = "https://explorer.testnet.bitfinity.network"

export const switchNetwork = async () => {
  try {
    if (typeof window !== "undefined" && window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      const currentChainId = await web3Instance.eth.getChainId();

      if (currentChainId !== BigInt(TARGET_NETWORK_ID)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${TARGET_NETWORK_ID.toString(16)}` }]
          })
        } catch (error: any) {
          if (error.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${TARGET_NETWORK_ID.toString(16)}`,
                  chainName: TARGET_CHAIN_NAME,
                  nativeCurrency: {
                    name: "Bitfinity",
                    symbol: "BFT",
                    decimals: 18
                  },
                  rpcUrls: [BOTANIX_RPC_URL],
                  blockExplorerUrls: [EXPLORER_URL]
                }
              ]
            })
          } else {
            console.error("Error switching network:", error)
          }
        }
      }
    } else {
      console.error("MetaMask is not installed.")
    }
  } catch (error) {
    console.error("An error occurred while switching networks:", error)
  }
}

export const bitfinityTestNetChain = {
  id: 355113,
  name: "Bitfinity TestNet",
  nativeCurrency: {
    decimals: 18,
    name: "Bitfinity",
    symbol: "BFT",
  },
  rpcUrls: {
    default: {
      http: [BOTANIX_RPC_URL]
    },
    public: {
      http: [BOTANIX_RPC_URL]
    },
  },
  blockExplorers: {
    default: {
      url: EXPLORER_URL,
      name: "Bitfinity TestNet Explorer"
    }
  }
};

export const useEthereumChainId = (setChainId: any) => {
useEffect(() => {
  const fetchChainId = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainIdDecimal = parseInt(chainIdHex, 16)
        setChainId(chainIdDecimal)
      } catch (error) {
        console.error('Error fetching chain ID:', error)}
      }
    }

  const handleChainChanged = (newChainId: string) => {
    const newChainIdDecimal = parseInt(newChainId, 16);
    setChainId(newChainIdDecimal);
  };

  fetchChainId();

  if (typeof window !== "undefined" && window.ethereum) {
    window.ethereum.on('chainChanged', handleChainChanged);
  }

  return () => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };
}, [setChainId])
};

