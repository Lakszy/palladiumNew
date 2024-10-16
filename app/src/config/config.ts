"use client"

import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import '@rainbow-me/rainbowkit/styles.css'


const coreTestNetChain: Chain = {
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
}

export const wagmiConfig = getDefaultConfig({
	appName: "My RainbowKit App",
	projectId: "ee56c353983496c87480ff2ae841a933",
	chains: [coreTestNetChain]
})

export const config = createConfig({
	chains: [coreTestNetChain],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[coreTestNetChain.id]: http('https://rpc.test.btcs.network')
	},
})