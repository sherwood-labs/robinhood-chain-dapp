import Link from "next/link";
import { demoBasketAddress, factoryAddress } from "@/config/contracts";
import { networkKind, networkName } from "@/config/network-copy";

const ZERO = "0x0000000000000000000000000000000000000000";

const STEPS = [
  ["1", "Stock Tokens", "The ingredients. Each one is an ERC-20."],
  ["2", "Price feeds", "A dollar price for each ingredient."],
  ["3", "The basket", "The recipe. One share needs a fixed amount of each token."],
  ["4", "Mint", "Pay the recipe, receive shares."],
  ["5", "Redeem", "Burn shares, receive the recipe back."],
];

export function StartHere() {
  const ready = factoryAddress !== ZERO && demoBasketAddress !== ZERO;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
      <div className="rounded-xl border border-rh-border bg-rh-surface px-4 py-4 sm:px-5">
        <p className="font-mono text-xs uppercase tracking-widest text-rh-lime">Start here</p>
        <h2 className="mt-1 text-lg font-semibold">A basket share is a fixed recipe</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-rh-muted">
          The demo basket is called Tech Trio. One share is backed by a set mix of Stock
          Tokens, such as 0.4 of the first, 0.3 of the second, and 0.3 of the third. Minting
          pulls that mix from your wallet. Redeeming sends it back. The dollar price adds
          each token&apos;s Chainlink price. Mint and redeem do not read the price. Only the
          dollar number does.
        </p>

        <ol className="mt-4 grid gap-3 sm:grid-cols-5">
          {STEPS.map(([n, title, body]) => (
            <li key={n} className="rounded-lg border border-rh-border bg-rh-bg px-3 py-3">
              <p className="font-mono text-xs text-rh-lime">
                {n} · {title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-rh-muted">{body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-4 text-sm leading-relaxed text-rh-muted">
          {ready ? (
            <>
              This page is reading <span className="text-rh-text">{networkName}</span>
              {networkKind === "local"
                ? ". Import the Anvil account from the README so the wallet holds the mock tokens."
                : "."}{" "}
              The console on the right logs each read and each transaction.
            </>
          ) : (
            <>
              No contracts are configured yet. In one terminal run <code className="font-mono text-rh-lime">anvil</code>.
              In another run <code className="font-mono text-rh-lime">pnpm run deploy:local</code>, then
              restart <code className="font-mono text-rh-lime">pnpm run dev</code>. Deploy writes{" "}
              <code className="font-mono text-rh-lime">apps/frontend/.env.local</code>.
            </>
          )}
        </p>

        <p className="mt-3 font-mono text-[11px] leading-relaxed text-rh-faint">
          contracts/src/BasketToken.sol · contracts/src/BasketFactory.sol ·
          contracts/script/Deploy.s.sol · apps/frontend/src/hooks/use-basket.ts ·{" "}
          <Link href="/learn" className="text-rh-lime hover:text-rh-lime-hover">
            developer deep dive
          </Link>
        </p>
      </div>
    </section>
  );
}
