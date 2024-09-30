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
 export const sepoliaChain: Chain = {
	id: 11155111,
	name: "Sepolia Testnet",
	iconUrl: "/img/b2.png",
	nativeCurrency: {
		decimals: 18,
		name: "Sepolia Testnet",
		symbol: "ETH",
	},
	rpcUrls: {
		default: {
			http: ["https://sepolia.infura.io/v3/ad9cef41c9c844a7b54d10be24d416e5"],
		},
		public: {
		http: ["https://sepolia.infura.io/v3/ad9cef41c9c844a7b54d10be24d416e5"],
		},
	},
};

// Core Blockchain TestNet Chain
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
			name: "Core TestNet Explorer",
		},
	},
};

export const wagmiConfig = getDefaultConfig({
	appName: "My RainbowKit App",
	projectId: "ee56c353983496c87480ff2ae841a933",
	// chains: [botanixChain, sepoliaChain], 
	chains: [botanixChain, sepoliaChain, coreTestNetChain],  // Added Core TestNet here
});


export const config = createConfig({
	chains: [botanixChain, sepoliaChain, coreTestNetChain],  // Added Core TestNet here
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		// [3636]: http('https://node.botanixlabs.dev'),
		[sepoliaChain.id]: http ('https://sepolia.infura.io/v3/ad9cef41c9c844a7b54d10be24d416e5'),
		[coreTestNetChain.id]: http('https://rpc.test.btcs.network'),  // Added Core TestNet RPC URL
	},
})


