import { configuredChainId } from "./contracts";

// The walkthrough was written for the public testnet demo. This copy also runs
// on local Anvil and on mainnet, so the sentences below follow NEXT_PUBLIC_CHAIN_ID.
export type NetworkKind = "local" | "testnet" | "mainnet";

export const networkKind: NetworkKind =
  configuredChainId === 4663 ? "mainnet" : configuredChainId === 46630 ? "testnet" : "local";

export const networkName = {
  local: "local Anvil",
  testnet: "Robinhood Chain testnet",
  mainnet: "Robinhood Chain",
}[networkKind];

export const trafficLabel = {
  local: "local traffic",
  testnet: "testnet traffic",
  mainnet: "mainnet traffic",
}[networkKind];

export const tokenSourceLabel = {
  local: "live from Anvil",
  testnet: "live from testnet",
  mainnet: "live from mainnet",
}[networkKind];

export const tokenIntro = {
  local: "The row below is a mock Stock Token deployed on local Anvil. It exposes the same ERC-20 and ERC-8056 functions as a real Stock Token.",
  testnet:
    "The row below is the real testnet TSLA token that the faucet dispenses, read live from the chain.",
  mainnet: "The row below is a real Stock Token on Robinhood Chain mainnet, read live from the chain.",
}[networkKind];

export const tokenAddressNote = {
  local: "Mock token created by the local deploy. That deploy mints 1,000 of each mock token to the Anvil account.",
  testnet:
    "The faucet TSLA token on Robinhood Chain testnet. On mainnet the docs publish canonical addresses per ticker.",
  mainnet: "Canonical Stock Token. Confirm it on the official contracts page before sending real funds.",
}[networkKind];

export const tokenReadNote = {
  local: "Plain eth_call reads against the mock Stock Token on local Anvil.",
  testnet: "Plain eth_call reads against the Stock Token contract on testnet.",
  mainnet: "Plain eth_call reads against the Stock Token contract on mainnet.",
}[networkKind];

export const feedSetup = {
  local: "This local demo deploys mock feeds with that same interface. Chainlink publishes the real USD feeds on Robinhood Chain mainnet.",
  testnet:
    "Feeds exist on mainnet only, so this testnet demo deploys mock feeds with the same interface. Everything a consumer contract does is identical.",
  mainnet: "This deployment reads the real Chainlink USD feeds for the Stock Tokens in the basket.",
}[networkKind];

export const feedCaption = {
  local: "mock feed on Anvil",
  testnet: "mock on testnet, real on mainnet",
  mainnet: "live Chainlink feed",
}[networkKind];

export const feedAddressNote = {
  local: "Mock feed deployed with the basket. The mainnet RHTSLA / USD feed is 0x4A1166a659A55625345e9515b32adECea5547C38.",
  testnet:
    "Mock feed deployed by this demo. The mainnet RHTSLA / USD feed lives at 0x4A1166a659A55625345e9515b32adECea5547C38.",
  mainnet: "Live Chainlink feed for the first component in this basket.",
}[networkKind];
