import React from "react";
import { CustomConnectButton } from "./connectBtn";
import Image from "next/image";
import connectimage from "../app/assets/images/notconnect01.png";

const ConnectWalletDefault = () => {
  return (
    <div
      className="h-screen w-full pb-16 sm:pb-1 max-sm:px-5"
      style={{ backgroundColor: "#272315" }}
    >
      <div className=" md:w-full h-full flex flex-col items-center justify-center mt-[-5rem]">
        <div
          className=" max-sm:w-[20rem]  md:px-[2rem] pb-[2rem] flex flex-col items-center justify-center"
          style={{ backgroundColor: "#2D2A1C" }}
        >
          <div className="items-center max-sm:justify-center">
            {" "}
            <Image
              src={connectimage}
              alt="home"
              className="  lg:w-full h-full"
            />
          </div>
          <CustomConnectButton className="" />
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletDefault;
// import React from "react";
// import { CustomConnectButton } from "./connectBtn";
// import Image from "next/image";
// import connectimage from "../app/assets/images/notconnect01.png";

// const ConnectWalletDefault = () => {
//   return (
//     <div
//       className="h-screen flex justify-center items-center"
//       style={{ backgroundColor: "#272315" }}
//     >
//       <div className="w-full md:max-w-lg bg-gray-300 p-8  shadow-lg">
//         <div className="mb-8">
//           <Image
//             src={connectimage}
//             alt="Connect Wallet Image"
//             width={500}
//             height={500}
//             className="object-cover rounded-lg"
//           />
//         </div>
//         <CustomConnectButton className="" />
//       </div>
//     </div>
//   );
// };

// export default ConnectWalletDefault;