import { ethers } from "ethers";

export const getContract = (address: string, abi: any, provider: any) => {
	return new ethers.Contract(address, abi, provider);
};
