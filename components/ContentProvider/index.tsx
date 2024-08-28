"use client";

import { wagmiConfig } from "@/app/src/config/config";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import '@rainbow-me/rainbowkit/styles.css'

type Props = {
    children: ReactNode;
};

const queryClient = new QueryClient();

export const ContextProvider = (props: Props) => {
    const { children } = props;
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
