"use client"

import { Chain, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import '@rainbow-me/rainbowkit/styles.css'
import coreImg from "../../assets/images/bitFinitityIcon.svg"


const bitfinityTestNetChain: Chain = {
	id: 355113,
	name: "Bitfinity TestNet",
	iconUrl: coreImg,
	nativeCurrency: {
		decimals: 18,
		name: "Bitfinity",
		symbol: "BFT",
	},
	rpcUrls: {
		default: {
			http: ["https://testnet.bitfinity.network"],
		},
		public: {
			http: ["https://testnet.bitfinity.network"],
		},
	},
	blockExplorers: {
		default: {
			url: "https://explorer.testnet.bitfinity.network",
			name: "Bitfinity TestNet Explorer"
		}
	}
}

export const wagmiConfig = getDefaultConfig({
	appName: "My RainbowKit App",
	projectId: "ee56c353983496c87480ff2ae841a933",
	chains: [bitfinityTestNetChain] 
})

export const config = createConfig({
	chains: [bitfinityTestNetChain],
	transports: {
		[bitfinityTestNetChain.id]: http('https://testnet.bitfinity.network')
	},
})