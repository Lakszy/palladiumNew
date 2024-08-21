import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useConnectModal, useAccounts, useBTCProvider } from '@particle-network/btc-connectkit';
import { useETHProvider } from '@particle-network/btc-connectkit';
import { Button } from './ui/button';
import { Dialog } from 'primereact/dialog';
import "../app/App.css";
import btnx from "../app/assets/images/botanixLogo.svg";
import Image from 'next/image';

const WalletConnectButton = () => {
    const { openConnectModal, disconnect } = useConnectModal();
    const { publicClient } = useETHProvider();
    const { accounts } = useAccounts();
    const { account, getSmartAccountInfo, chainId } = useETHProvider();
    const [isConnected, setIsConnected] = useState(false);
    const [balance, setBalance] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { provider, getNetwork, switchNetwork, signMessage, getPublicKey, sendBitcoin } = useBTCProvider();
    const [showPopup, setShowPopup] = useState(false);

    const fetchBalance = useCallback(async (accountAddress: any) => {
        if (accountAddress) {
            setIsLoading(true);
            try {
                const formattedAddress = accountAddress.startsWith('0x') ? accountAddress as `0x${string}` : `0x${accountAddress}` as `0x${string}`;
                setAddress(formattedAddress);
                const accountInfo = await getSmartAccountInfo();
                const walletAddress = accountInfo?.smartAccountAddress as unknown as `0x${string}`;
                const balanceBigInt = await publicClient?.getBalance({ address: walletAddress });
                const balance = balanceBigInt ? Number(balanceBigInt) : 0;
                if (balanceBigInt && balanceBigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
                    console.log("Balance exceeds Number.MAX_SAFE_INTEGER and may lose precision.");
                }
                setBalance(balance.toString());
                console.log(balance, "alala");
            } catch (error) {
                console.error("Error fetching balance:", error);
                setBalance(null);
            } finally {
                setIsLoading(false);
            }
        } else {
            console.log("No account connected");
        }
    }, [publicClient]);

    useEffect(() => {
        setIsConnected(accounts.length > 0);
        if (accounts.length > 0) {
            fetchBalance(accounts[0])
        }
    }, [accounts, fetchBalance]);

    const handleDisconnect = useCallback(() => {
        if (disconnect) {
            disconnect();
            setShowPopup(false);
        } else {
            console.error("Disconnect function is not available.");
        }
    }, [disconnect]);

    const hidePopup = useCallback(() => {
        setShowPopup(false);
    }, []);

    const truncatedAddress = useMemo(() => {
        return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 'Loading...';
    }, [address]);

    return (
        <div className="flex flex-col w-fit">
            {!isConnected ? (
                <Button onClick={openConnectModal}
                    style={{ display: "flex", alignItems: "center", backgroundColor: "#383427", height: 50, borderRadius: 3, border: "1px solid gray", borderWidth: "2px" }}>
                    <h2 className="title-text">
                        Connect Wallet Using Particle
                    </h2>
                </Button>
            ) : (
                <>
                    <Button
                        className='border'
                        onClick={() => setShowPopup(true)}
                        style={{ display: "flex", alignItems: "center", backgroundColor: "#383427", height: 50, border: "1px solid gray", padding: "0 10px", borderRadius: 5 }}
                    >
                        <h2 className="body-text" style={{ color: "#FFFFFF" }}>
                            {isLoading ? 'Loading...' : `${truncatedAddress} (${balance ? balance : '0'} ETH)`}
                        </h2>
                    </Button>
                    <Dialog
                        visible={showPopup}
                        onHide={hidePopup}
                        className=" p-4"
                        header={
                            <button onClick={hidePopup} className="p-dialog-header-icon p-dialog-header-close" aria-label="Close">
                                <span className="pi pi-times" />
                            </button>
                        }
                        modal={true}
                        onClick={hidePopup}
                        style={{ width: '450px', height: '350px', borderRadius: '10px', padding: '10px' }}
                    >
                        <div className="flex flex-col p-4 items-center">
                            <Image className='border' src={btnx} alt="User Avatar" style={{ width: 100, height: 100, borderRadius: '50%', marginBottom: '15px' }} />
                            <h3 className='text-white body-text font-medium'>{isLoading ? 'Loading...' : truncatedAddress}</h3>
                            <p className="text-lg font-bold text-white title-text2">{isLoading ? 'Loading...' : balance ? `${balance} ETH` : 'Loading...'}</p>
                            <div className="flex justify-between w-[110%] mt-[3rem]">
                                <button onClick={() => navigator.clipboard.writeText(address || '')} className="p-button border hover:scale-95 p-2 p-button-outlined border-yellow-300 text-white font-medium body-text">
                                    Copy Address
                                </button>
                                <button onClick={handleDisconnect} className="p-button body-text text-white font-medium p-button-danger hover:scale-95 ml-1 whitespace-nowrap border border-yellow-300 p-2">
                                    Disconnect
                                </button>
                            </div>
                        </div>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default WalletConnectButton;

