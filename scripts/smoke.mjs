// End-to-end check against a local Anvil deploy.
//
//   anvil                          terminal 1
//   pnpm run deploy:local          terminal 2
//   pnpm run smoke                 terminal 2
//
// Mints two basket shares from the Anvil account, checks the dollar price,
// redeems them, and expects the basket supply to return to zero.

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { must } from "./run.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envFile = resolve(root, "apps/frontend/.env.local");
const rpc = process.env.RPC_URL ?? "http://localhost:8545";

// Anvil's account zero. Public test key. Never use this pattern on a live network.
const key = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

if (!existsSync(envFile)) {
  console.error(`missing ${envFile}`);
  console.error("run pnpm run deploy:local first, with Anvil already listening on port 8545");
  process.exit(1);
}

const env = readEnv(envFile);
const basket = env.NEXT_PUBLIC_DEMO_BASKET_ADDRESS;
const factory = env.NEXT_PUBLIC_FACTORY_ADDRESS;
if (!basket || !factory) {
  console.error(`${envFile} is missing the factory or demo basket address`);
  process.exit(1);
}

console.error(`factory ${factory}`);
console.error(`basket  ${basket}`);

const registered = call(factory, "isBasket(address)(bool)", [basket]);
if (registered !== "true") fail("factory does not recognize the demo basket");
console.error("factory recognizes the demo basket");

const count = BigInt(firstWord(call(basket, "componentCount()(uint256)")));
for (let i = 0n; i < count; i++) {
  const row = call(basket, "componentAt(uint256)((address,address,uint256))", [i.toString()]);
  const token = firstAddress(row);
  console.error(`approving component ${token}`);
  send(token, "approve(address,uint256)", [basket, maxUint()]);
}

const twoShares = "2000000000000000000";
console.error("minting 2 shares");
send(basket, "mint(uint256,address)", [twoShares, account]);

const balance = firstWord(call(basket, "balanceOf(address)(uint256)", [account]));
if (balance !== twoShares) fail(`expected 2e18 shares, got ${balance}`);

const price = BigInt(firstWord(call(basket, "sharePriceUsd()(uint256)")));
if (price <= 0n) fail(`share price should be positive, got ${price}`);
console.error(`share price: $${formatUsd8(price)} (raw ${price})`);

const value = BigInt(firstWord(call(basket, "balanceValueUsd(address)(uint256)", [account])));
if (value !== price * 2n) fail("balance value should be twice the share price");

console.error("redeeming 2 shares");
send(basket, "redeem(uint256,address)", [twoShares, account]);

const supply = firstWord(call(basket, "totalSupply()(uint256)"));
if (supply !== "0") fail(`total supply should be zero after redeem, got ${supply}`);

console.error("smoke test passed");

function call(address, signature, args = []) {
  const result = must("cast", ["call", address, signature, ...args, "--rpc-url", rpc]);
  return result.stdout.trim();
}

function send(address, signature, args = []) {
  must("cast", [
    "send",
    address,
    signature,
    ...args,
    "--private-key",
    key,
    "--rpc-url",
    rpc,
  ]);
}

function maxUint() {
  return must("cast", ["max-uint"]).stdout.trim();
}

function firstWord(text) {
  return text.split(/\s+/)[0] ?? "";
}

function firstAddress(text) {
  const match = text.match(/0x[0-9a-fA-F]{40}/);
  if (!match) fail(`no address in cast output:\n${text}`);
  return match[0];
}

function formatUsd8(raw) {
  const whole = raw / 100_000_000n;
  const frac = (raw % 100_000_000n).toString().padStart(8, "0").slice(0, 2);
  return `${whole}.${frac}`;
}

function readEnv(path) {
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) env[match[1]] = match[2].trim();
  }
  return env;
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}
