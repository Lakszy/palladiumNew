"use client";

import { wagmiConfig } from "@/app/src/config/config";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import '@rainbow-me/rainbowkit/styles.css'

import {
  ConnectProvider,
  OKXConnector,
  UnisatConnector,
  BitgetConnector,
  TokenPocketConnector,
  BybitConnector,
  WizzConnector,
  XverseConnector
} from '@particle-network/btc-connectkit';

import { 
  MerlinTestnet, Merlin,  BEVMTestnet, BEVM, 
  MAPProtocolTestnet, MAPProtocol, SatoshiVMTestnet, BSquaredTestnet, 
   Mantle, BitlayerTestnet, BotanixTestnet, PolygonzkEVMCardona 
} from '@particle-network/chains';

type Props = {
    children: ReactNode;
};

const queryClient = new QueryClient();

export const ContextProvider = (props: Props) => {
    const { children } = props;

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ConnectProvider
                    options={{
                        projectId: "87d966e0-e9f2-452f-bd09-4ce0469f2ef5",
                        clientKey: "cDGtgHnqqahxotD9MWgcjUcT2lfqDnPCTEEDIEq0",
                        appId: "sdqWhsFIW0vuRDC9Ekf5rXzYRSrDxiB5VncE845x",
                        aaOptions: {
                            accountContracts: {
                                BTC: [
                                    {
                                        chainIds: [
                                            MerlinTestnet.id, Merlin.id, BEVMTestnet.id, BEVM.id, 
                                            MAPProtocolTestnet.id, MAPProtocol.id, 
                                            SatoshiVMTestnet.id
                                        ],
                                        version: '1.0.0',
                                    },
                                    {
                                        chainIds: [
                                            BitlayerTestnet.id, BotanixTestnet.id, 
                                            PolygonzkEVMCardona.id, BSquaredTestnet.id, 
                                            Mantle.id
                                        ],
                                        version: '2.0.0',
                                    },
                                ],
                            },
                        },
                        walletOptions: {
                            visible: true,
                        }
                    }}
                    connectors={[
                        new UnisatConnector(), 
                        new OKXConnector(), 
                        new BitgetConnector(), 
                        new TokenPocketConnector(), 
                        new BybitConnector(), 
                        new WizzConnector(), 
                        new XverseConnector()
                    ]}
                >
                    <RainbowKitProvider>
                        {children}
                    </RainbowKitProvider>
                </ConnectProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};