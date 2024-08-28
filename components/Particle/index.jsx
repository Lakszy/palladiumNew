import React from 'react';
import ReactDOM from 'react-dom/client';
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
import App from './App';

import { MerlinTestnet, Merlin, LumiBitTestnet, PolygonMumbai, BEVMTestnet, BEVM, MAPProtocolTestnet, MAPProtocol, SatoshiVMTestnet, BSquaredTestnet, AINNTestnet, Mantle, BitlayerTestnet, BotanixTestnet, PolygonzkEVMCardona } from '@particle-network/chains';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConnectProvider
      options={{
        projectId: "87d966e0-e9f2-452f-bd09-4ce0469f2ef5",
        clientKey: "cDGtgHnqqahxotD9MWgcjUcT2lfqDnPCTEEDIEq0",
        appId: "sdqWhsFIW0vuRDC9Ekf5rXzYRSrDxiB5VncE845x",
        aaOptions: {
          accountContracts: {
            BTC: [
              {
                chainIds: [MerlinTestnet.id, Merlin.id, LumiBitTestnet.id, PolygonMumbai.id, BEVMTestnet.id, BEVM.id, MAPProtocolTestnet.id, MAPProtocol.id, SatoshiVMTestnet.id],
                version: '1.0.0',
              },
              {
                chainIds: [BitlayerTestnet.id, BotanixTestnet.id, PolygonzkEVMCardona.id, BSquaredTestnet.id, Mantle.id, AINNTestnet.id],
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
      <App />
    </ConnectProvider>
  </React.StrictMode>
);
