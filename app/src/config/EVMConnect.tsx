/* eslint-disable */


"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../../../components/ui/button";
import React from "react";
import coreImg from "../../assets/images/coretestnet.svg"
import Image from "next/image";

interface Props {
	className: string
}

export const EVMConnect: React.FC<Props> = ({ className }) => {
	return (
		<ConnectButton.Custom>
			{({
				account,
				chain,
				openAccountModal,
				openChainModal,
				openConnectModal,
				authenticationStatus,
				mounted,
			}) => {
				const ready = mounted && authenticationStatus !== "loading";
				const connected =
					ready &&
					account &&
					chain &&
					(!authenticationStatus || authenticationStatus === "authenticated");
				return (
					<div
						{...(!ready && {
							"aria-hidden": true,
							style: {
								opacity: 0,
								pointerEvents: "none",
								userSelect: "none",
							},
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<Button className={className} onClick={openConnectModal}
										style={{ display: "flex", color: "white", alignItems: "center", backgroundColor: "#222222", height: 50, borderRadius: 3, border: "1px solid gray", borderWidth: "2px" }}>
										<h2 className="title-text">
											Connect Wallet
										</h2>
									</Button>
								);
							}
							if (chain.unsupported) {
								return (
									<Button
										onClick={openChainModal}
										type="button"
										variant={"destructive"}
									>
										<h2 className="body-text">
											Wrong network
										</h2>
									</Button>
								);
							}
							return (
								<div style={{ display: "flex", gap: 12 }}>
									<Button
										onClick={openChainModal}
										style={{ display: "flex", color: "white", alignItems: "center", backgroundColor: "#222222", height: 50, border: "1px solid gray", borderWidth: "1px" }}>

										{chain.hasIcon && (
											<div
												style={{
													width: 28,
													height: 28,
													borderRadius: 0,
													marginRight: 4,
													color: "white",
												}}
											>
												{chain.iconUrl && (
													<Image
														alt={chain.name ?? "Chain icon"}
														src={chain.iconUrl}
														style={{ width: 28, height: 28 }}
													/>
												)}
											</div>
										)}
										<h2 className="body-text notMobileDevice">
											{chain.name}
										</h2>
									</Button>
									<Button onClick={openAccountModal}

										style={{ display: "flex", color: "white", alignItems: "center", backgroundColor: "#222222", height: 50, border: "1px solid gray", borderWidth: "1px" }}>
										<h2 className="body-text">

											{account.displayName}
											{account.displayBalance
												? ` (${account.displayBalance})`
												: ""}
										</h2>
									</Button>
								</div>
							);
						})()}
					</div>
				);
			}}
		</ConnectButton.Custom>
	);
};