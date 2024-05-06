/* eslint-disable */


"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "../ui/button";
import React from "react";

interface Props {
	className: string
  }

export const CustomConnectButton: React.FC<Props>  = ({ className }) => {
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
										style={{ display: "flex", alignItems: "center", backgroundColor: "#383427", height: 50, borderRadius: 3, border: "1px solid gray", borderWidth: "2px" }}>
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
										style={{ display: "flex", alignItems: "center", backgroundColor: "#383427", height: 50, border: "1px solid gray", borderWidth: "1px" }}>

										{chain.hasIcon && (
											<div
												style={{
													width: 28,
													height: 28,
													borderRadius: 0,
													marginRight: 4,
												}}
											>
												{chain.iconUrl && (
													<img

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

										style={{ display: "flex", alignItems: "center", backgroundColor: "#383427", height: 50, border: "1px solid gray", borderWidth: "1px" }}>
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
