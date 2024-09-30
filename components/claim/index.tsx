// import React from "react";
// import "../../app/App.css";

// const Claim = () => {
//   return (
//     <>
//       <div className="grid bg-[#272315] items-start h-66 gap-2 mx-auto border-yellow-400 p-4">
//         <div className="">
//           <div className="flex flex-row gap-x-4 rounded-xl ">
//             <div
//               className="h-[14rem] items-center"
//               style={{ backgroundColor: "rgb(56,52,39)" }}
//             >
//               {/* <div className="flex flex-row justify-between p-4 gap-x-4 body-text text-sm text-[#827f77] whitespace-nowrap mt-[4rem]">
//                 <div className="flex flex-col space-y-1">
//                   <span>Assets </span>
//                   <span></span>
//                   <div>0.001 wETH</div>
//                   <div>0.001 weETH</div>
//                 </div>
//                 <div className="flex flex-col space-y-1">
//                   <span>Market Price</span>
//                   <span></span>
//                   <div>0.001 wETH</div>
//                   <div>0.001 weETH</div>
//                 </div>
//                 <div className="flex flex-col space-y-1">
//                   <span>Claim Value</span>
//                   <span></span>
//                   <div>0.001 wETH</div>
//                   <div>0.001 weETH</div>
//                 </div>
//               </div> */}
//               <div className="flex flex-col p-4 gap-y-2 body-text text-sm text-[#827f77] whitespace-nowrap mt-[4rem]">
//                 {/* Headings Row */}
//                 <div className="flex flex-row justify-between">
//                   <span>Assets</span>
//                   <span>Market Price</span>
//                   <span>Claim Value</span>
//                 </div>
//                 {/* Values Row */}
//                 <div className="flex flex-row justify-between">
//                   <div className="flex flex-col space-y-1">
//                     <div>0.001 wETH</div>
//                     <div>0.001 weETH</div>
//                   </div>
//                   <div className="flex flex-col space-y-1">
//                     <div>0.001 wETH</div>
//                     <div>0.001 weETH</div>
//                   </div>
//                   <div className="flex flex-col space-y-1">
//                     <div>0.001 wETH</div>
//                     <div>0.001 weETH</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col body-text text-sm text-[#827f77] ">
//               <div
//                 className="h-[12rem] justify-between flex flex-row"
//                 style={{ backgroundColor: "rgb(56,52,39)" }}
//               >
//                 <div className="mt-[2rem] flex flex-row items-center">
//                   <div className="p-4 gap-x-4 whitespace-nowrap">
//                     <div>Total Value to claim</div>
//                     <div>wETH</div>
//                     <div>weETH</div>
//                   </div>
//                   <div className="pl-4 whitespace-nowrap">
//                     <div>14</div>
//                     <div>0.00 WETH</div>
//                     <div>0.00 weETH</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-yellow-400 text-center mt-[1rem] h-[3rem]">
//                 <span className=" flex justify-center py-4">CLAIM</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Claim;
/*
import React from "react";
import "../../app/App.css";

const ClaimDashboard = () => {
  const assets = [
    { name: "wETH", amount: 0.001, marketPrice: 2247.89, claimValue: 0.55 },
    { name: "weETH", amount: 0.001, marketPrice: 2247.89, claimValue: 13.25 },
  ];

  const totalValueToClaim = 14; // USD
  const wethBalance = 0.0; // WETH
  const weethBalance = 0.01; // weETH

  return (
    <div className="p-8 bg-[#272315] text-white border-none  rounded-sm">
      <div className="flex gap-x-2">
        
        <div
          className="flex-1 pr-8"
          style={{ backgroundColor: "rgb(56,52,39)" }}
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-body">
                <th className="pb-4">Assets</th>
                <th className="pb-4">Market Price</th>
                <th className="pb-4">Claim Value</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td className="py-2 text-body">
                    <div className="flex items-center">
                      <div className="w-6 h-6  rounded-full mr-2"></div>
                      <span>
                        {asset.amount} {asset.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 text-body">
                    ${asset.marketPrice.toFixed(2)}
                  </td>
                  <td className="py-2 text-body">
                    ${asset.claimValue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div className="flex-1" style={{ backgroundColor: "rgb(56,52,39)" }}>
          <div className="mb-6 mt-2 p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-body">
                Total Value to claim
              </span>
              <span className="font-bold text-body">
                {totalValueToClaim} USD
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-body">WETH</span>
              <span className="text-body">{wethBalance.toFixed(2)} WETH</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-body">weETH</span>
              <span className="text-body">{weethBalance.toFixed(2)} weETH</span>
            </div>
          </div>
        </div>
      </div>

    
      <button className="w-full bg-yellow-400 text-black py-3 rounded font-bold hover:bg-yellow-500 transition-colors mt-4">
        CLAIM
      </button>
    </div>
  );
};

export default ClaimDashboard;
*/
import React from "react";

const ClaimDashboard = () => {
  const assets = [
    { name: "wETH", amount: 0.001, marketPrice: 2247.89, claimValue: 0.55 },
    { name: "weETH", amount: 0.001, marketPrice: 2247.89, claimValue: 13.25 },
  ];

  const totalValueToClaim = 14; // USD
  const wethBalance = 0.0; // WETH
  const weethBalance = 0.01; // weETH

  return (
    <div className="p-4 md:p-8 bg-[#272315] text-white border border-[#333333] rounded-sm">
      <div className="flex flex-col md:flex-row gap-y-4 md:gap-x-2">
        {/* Box 1: Assets Table */}
        <div
          className="flex-1 pr-0 md:pr-8"
          style={{ backgroundColor: "rgb(56,52,39)" }}
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-body">
                <th className="pb-4">Assets</th>
                <th className="pb-4">Market Price</th>
                <th className="pb-4">Claim Value</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td className="py-2 text-body">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                      <span>
                        {asset.amount} {asset.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 text-body">
                    ${asset.marketPrice.toFixed(2)}
                  </td>
                  <td className="py-2 text-body">
                    ${asset.claimValue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Box 2: Claim Summary */}
        <div
          className="flex-1 p-4"
          style={{ backgroundColor: "rgb(56,52,39)" }}
        >
          <div className="mb-6 mt-2">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-body">
                Total Value to claim
              </span>
              <span className="font-bold text-body">
                {totalValueToClaim} USD
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-body">WETH</span>
              <span className="text-body">{wethBalance.toFixed(2)} WETH</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-body">weETH</span>
              <span className="text-body">{weethBalance.toFixed(2)} weETH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Button Outside Box 2 */}
      <button className="w-full bg-yellow-400 text-black py-3 rounded font-bold hover:bg-yellow-500 transition-colors mt-4">
        CLAIM
      </button>
    </div>
  );
};

export default ClaimDashboard;
