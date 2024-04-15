import React from "react";
import Image from "next/image";
import pusdbtc from "../app/assets/images/PUSDBTC.svg"
import Link from "next/link";
import { CustomConnectButton } from "./connectBtn";
function NavBar() {
  return (
    <div className="flex border-2 border-gray-100 h-28  border-opacity-10 items-center justify-between gap-x-4 border-l px-4 py-4 z-50" style={{ backgroundColor: "#272315" }}>
      <div className="flex items-center gap-x-4">
        <div className="w-full min-w-[400px] rounded-xl">
          <Image src={pusdbtc} alt="btc" width={300} />
        </div>
      </div>
      <div className="flex items-center gap-x-4">
        <CustomConnectButton />
      </div>
    </div>
  );
}

export default NavBar;
