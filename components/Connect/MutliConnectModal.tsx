import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog } from "primereact/dialog";
import { MdClose } from 'react-icons/md';
import { EVMConnect } from '../EVMConnect';
import { CustomConnectButton } from '../connectBtn';
import WalletConnectButton from '../WalletConnectButton';
interface WalletConnectionProps {
    isConnected: boolean;
    accounts: any[];
  }
  
  const WalletConnection: React.FC<WalletConnectionProps> = ({ isConnected, accounts }) => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const openDialog = () => setIsDialogVisible(true);
  const closeDialog = () => setIsDialogVisible(false);

  return (
    <div>
      <div className="flex items-center gap-x-10">
        {(isConnected) && (
          <>
            {isConnected ? (
              <EVMConnect className="" />
            ) : (
              <WalletConnectButton />
            )}
          </>
        )}
      </div>

      {(isConnected) ? (
        <></>
      ) : (
        <Button
          onClick={openDialog}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#383427",
            height: 50,
            borderRadius: 3,
            border: "1px solid gray",
            borderWidth: "2px",
          }}
        >
          <h2 className="title-text">Connect Wallet</h2>
        </Button>
      )}

      <Dialog
        visible={isDialogVisible}
        onHide={closeDialog}
        style={{ minWidth: '20vw' }}
      >
        <div className="mt-4 flex justify-end">
          <button onClick={closeDialog} className="w-fit h-fit text-white body-text">
            <MdClose className="text-gray-500 text-lg" />
          </button>
        </div>
        <div className="flex space-y-10 mt-4 py-10 items-center flex-col gap-4">
          {/* <div>
            <h3 className="text-white title-text">EVM Wallets</h3>
            {  > 0 ? (
              <button className="text-red-400 title-text2 cursor-not-allowed" disabled>
                Connected already
              </button>
            ) : (
              <CustomConnectButton className={""} />
            )}
          </div> */}
          <div>
            <h3 className="text-white title-text">WBTC Wallets</h3>
            {isConnected ? (
              <button className="text-gray-400 cursor-not-allowed" disabled>
                Connected
              </button>
            ) : (
              <WalletConnectButton />
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default WalletConnection;