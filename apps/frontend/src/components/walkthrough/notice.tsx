import { factoryAddress } from "@/config/contracts";
import { networkKind, networkName } from "@/config/network-copy";

const FAUCET_URL = "https://faucet.testnet.chain.robinhood.com";
const ZERO = "0x0000000000000000000000000000000000000000";

export function TestnetNotice() {
  if (factoryAddress === ZERO) return null;

  if (networkKind === "local") {
    return (
      <div className="rounded-xl border border-rh-lime/40 bg-rh-lime/5 px-4 py-3 text-sm leading-relaxed text-rh-muted">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-rh-lime">
          Local Anvil
        </span>{" "}
        Reads and transactions go to chain 31337 at http://localhost:8545. Add that
        network in your wallet and import the Anvil account from the README. That
        key is public. Use it on this local chain only.
      </div>
    );
  }

  if (networkKind === "mainnet") {
    return (
      <div className="rounded-xl border border-rh-danger/50 bg-rh-danger/10 px-4 py-3 text-sm leading-relaxed text-rh-muted">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-rh-danger">
          Mainnet
        </span>{" "}
        This page reads {networkName}. Mint and redeem move real Stock Tokens and
        spend real ETH on gas.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rh-lime/40 bg-rh-lime/5 px-4 py-3 text-sm leading-relaxed text-rh-muted">
      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-rh-lime">
        Live testnet demo
      </span>{" "}
      Every value on this page is read from contracts on Robinhood Chain testnet
      (chain 46630), and the mint and redeem steps send real transactions. Grab
      testnet ETH and Stock Tokens from the{" "}
      <a
        href={FAUCET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-rh-lime underline hover:text-rh-lime-hover"
      >
        official faucet
      </a>
      .
    </div>
  );
}
