"use client"

import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'

import '@rainbow-me/rainbowkit/styles.css'

const botanixChain: Chain = {
	id: 3636,
	name: "Botanix Testnet",
	iconUrl: "/img/b2.png",
	nativeCurrency: {
		decimals: 18,
		name: "Botanix Testnet",
		symbol: "BTC",
	},
	rpcUrls: {
		default: {
			http: ["https://node.botanixlabs.dev"],
		},
		public: {
			http: ["https://node.botanixlabs.dev"],
		},
	},
};

export const wagmiConfig = getDefaultConfig({
	appName: "My RainbowKit App",
	projectId: "ee56c353983496c87480ff2ae841a933",
	chains: [botanixChain],
});


export const config = createConfig({
	chains: [botanixChain],
	transports: {
	  [mainnet.id]: http(),
	  [sepolia.id]: http(),
      [3636]: http('https://node.botanixlabs.dev'),
	},
  })
