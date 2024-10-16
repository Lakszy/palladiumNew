import Web3 from "web3"

const TARGET_NETWORK_ID = 1115
const TARGET_CHAIN_NAME = "Core Testnet"
const RPC_URL = "https://rpc.test.btcs.network"
const EXPLORER_URL = "https://scan.test.btcs.network"

export const switchNetwork = async () => {
  try {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum)
      const currentChainId = await web3Instance.eth.getChainId()

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
                    name: "Core Blockchain TestNet",
                    symbol: "tCORE",
                    decimals: 18
                  },
                  rpcUrls: [RPC_URL],
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

export const coreTestNetChain = {
  id: 1115,
  name: "Core Blockchain TestNet",
  nativeCurrency: {
    decimals: 18,
    name: "Core Blockchain TestNet",
    symbol: "tCORE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.test.btcs.network"],
    },
    public: {
      http: ["https://rpc.test.btcs.network"],
    },
  },
  blockExplorers: {
    default: {
      url: "https://scan.test.btcs.network",
      name: "Core TestNet Explorer"
    }
  }
};

export const useEthereumChainId = (setChainId: any) => {
  const fetchChainId = async () => {
    if (window.ethereum) {
      try {
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        const chainIdDecimal = parseInt(chainIdHex, 16);
        setChainId(chainIdDecimal);
      } catch (error) {
        console.error('Error fetching chain ID:', error);
      }
    }
  };

  const handleChainChanged = (newChainId: string) => {
    const newChainIdDecimal = parseInt(newChainId, 16);
    setChainId(newChainIdDecimal);
  };

  fetchChainId();

  if (window.ethereum) {
    window.ethereum.on('chainChanged', handleChainChanged);
  }

  return () => {
    if (window.ethereum) {
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };
};

