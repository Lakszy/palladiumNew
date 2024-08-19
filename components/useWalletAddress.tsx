import { useEffect, useState } from 'react';
import { useAccounts } from '@particle-network/btc-connectkit';
import { useETHProvider } from '@particle-network/btc-connectkit';

export const useWalletAddress = () => {
    const { account } = useETHProvider();
    const { accounts } = useAccounts();
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        if (accounts.length > 0 && account) {
            const formattedAddress: `0x${string}` = account.startsWith('0x') ? account as `0x${string}` : `0x${account}` as `0x${string}`;
            setAddress(formattedAddress);
        } else {
            setAddress(null);
        }
    }, [accounts, account]);

    return address;
};
