# robinhood-chain-dapp

## Credits

Based on [hummusonrails/robinhood-chain-dapp-example](https://github.com/hummusonrails/robinhood-chain-dapp-example) by Ben Greenberg, used under the MIT License (see [LICENSE](LICENSE)).

An application for minting and redeeming index baskets of tokenized stocks on [Robinhood Chain](https://docs.robinhood.com/chain/), an Arbitrum Orbit Layer 2. One basket share is a fixed mix of Stock Tokens. Depositing that mix mints shares. Burning shares returns the mix. A Chainlink USD feed, or a mock of one, prices the share.

The interface is a five-step walkthrough. A [developer deep dive](apps/frontend/src/app/learn/page.tsx) shows the same contracts beside the source. The upstream project and its hosted testnet demo are [hummusonrails/robinhood-chain-dapp-example](https://github.com/hummusonrails/robinhood-chain-dapp-example) and [robinhood-chain-dapp.vercel.app](https://robinhood-chain-dapp.vercel.app).

These contracts are examples for learning how the chain works. They are not audited. Do not use them to hold real funds.

## Networks

| | Local Anvil | Testnet | Mainnet |
| --- | --- | --- | --- |
| Chain ID | 31337 | 46630 | 4663 |
| RPC | `http://localhost:8545` | `https://rpc.testnet.chain.robinhood.com` | `https://rpc.mainnet.chain.robinhood.com` |
| Explorer | — | [explorer.testnet.chain.robinhood.com](https://explorer.testnet.chain.robinhood.com) | [robinhoodchain.blockscout.com](https://robinhoodchain.blockscout.com) |
| Faucet | — | [faucet.testnet.chain.robinhood.com](https://faucet.testnet.chain.robinhood.com) | — |

Public RPCs are rate-limited. For anything beyond this tutorial, use a provider such as Alchemy.

Gas is ETH. Robinhood Chain is an Orbit chain, so a deployment's gas estimate includes an L1 data fee that can move between estimation and inclusion. `scripts/deploy.mjs` waits for each receipt (`--slow`) and multiplies the gas estimate by three.

## What the application does

| Piece | Role |
| --- | --- |
| `BasketFactory` | Deploys a basket and records its address. Anyone can create one. |
| `BasketToken` | An ERC-20 share. `mint` pulls the recipe. `redeem` returns it. `sharePriceUsd` sums the feeds. |
| Demo basket | Tech Trio. One share holds 0.4, 0.3, and 0.3 of three Stock Tokens. |
| Local / testnet | Mock Chainlink feeds. Testnet uses the faucet's real Stock Tokens. |
| Mainnet | Canonical TSLA, NVDA, and AAPL Stock Tokens and their Chainlink feeds. |
| Frontend | Next.js walkthrough. Contract addresses come from `apps/frontend/.env.local`. |

The basket has no owner, no fee, and no rebalance function. The composition is fixed when the basket is created, and a basket holds at most 10 tokens.

## Requirements

- [Foundry](https://book.getfoundry.sh/getting-started/installation): `forge`, `cast`, and `anvil`
- [Node.js](https://nodejs.org) 20 or newer
- [pnpm](https://pnpm.io) 10 or newer
- A browser wallet, such as MetaMask, for the walkthrough

OpenZeppelin Contracts v5.4.0 and forge-std are already in `contracts/lib`. If that folder is empty:

```bash
cd contracts
forge install foundry-rs/forge-std --no-commit
forge install OpenZeppelin/openzeppelin-contracts@v5.4.0 --no-commit
```

## Local development

Install dependencies and run the offline tests from the repository root:

```bash
pnpm install
pnpm run test:contracts
```

`pnpm run test:contracts` uses mock tokens and mock feeds. It does not call the network. `pnpm run test:fork` forks Robinhood Chain mainnet.

Start Anvil in one terminal:

```bash
anvil
```

Deploy, check the round trip, and start the interface in another:

```bash
pnpm run deploy:local
pnpm run smoke
pnpm run dev
```

`deploy:local` deploys mock Stock Tokens, mock feeds, `BasketFactory`, and the Tech Trio basket. It writes `apps/frontend/.env.local`. Restart `pnpm run dev` when that file changes so Next.js loads the new addresses.

Open [http://localhost:3000](http://localhost:3000).

### Wallet

Add this network in the wallet:

| Setting | Value |
| --- | --- |
| Network name | Local Anvil |
| RPC URL | `http://localhost:8545` |
| Chain ID | `31337` |
| Currency symbol | ETH |

Import Anvil's first account. The deploy mints 1,000 of each mock Stock Token to it.

| Field | Value |
| --- | --- |
| Address | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` |
| Private key | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |

This is Anvil's published test key. Every default Anvil node uses it. Use it on this local chain only.

## Walkthrough

The page has five steps. The panel on the right logs each read and each transaction. The sentences on the page follow the chain id in `.env.local`.

| Step | What you see |
| --- | --- |
| Stock Tokens | The first ingredient, read as an ERC-20. Splits change `uiMultiplier()` (ERC-8056) and leave raw balances unchanged. |
| Price feeds | The USD price for that token. Local and testnet deploys use a mock feed. Mainnet uses Chainlink. |
| The basket | Tech Trio's recipe and `sharePriceUsd()`. On the local mocks that price is $265.00. |
| Mint | Approve each token, then `mint`. Amounts round up. |
| Redeem | `redeem` burns the shares and returns the tokens. Amounts round down. |

[/learn](http://localhost:3000/learn) is the same system with the contract source inline. It is available once `pnpm run dev` is running.

## Repository layout

| Path | Contents |
| --- | --- |
| `contracts/src/BasketToken.sol` | Share token: `mint`, `redeem`, `sharePriceUsd` |
| `contracts/src/BasketFactory.sol` | Deploys a basket and stores the address |
| `contracts/src/interfaces/IScaledUIAmount.sol` | ERC-8056 stock-split multiplier |
| `contracts/src/mocks/` | `MockStockToken` and `MockPriceFeed` |
| `contracts/script/Deploy.s.sol` | Mainnet tokens, testnet faucet tokens, or local mocks, chosen by chain id |
| `contracts/test/BasketToken.t.sol` | Unit tests, including the mint/redeem rounding fuzz |
| `scripts/deploy.mjs` | Broadcasts the deploy and writes the frontend env file |
| `scripts/smoke.mjs` | Mints, prices, and redeems against the local deploy |
| `apps/frontend/src/app/page.tsx` | Walkthrough |
| `apps/frontend/src/hooks/use-basket.ts` | One hook per basket call |
| `apps/frontend/src/app/learn/page.tsx` | Developer deep dive |

`scripts/deploy.sh` and `scripts/smoke.sh` are the bash equivalents. The deep dive quotes `deploy.sh`. The `pnpm` scripts call the Node versions, which run under PowerShell and bash.

## How a share is priced and settled

`BasketToken` stores each ingredient as `(token, feed, unitsPerShare)`. `unitsPerShare` uses the token's own decimals. `0.4e18` is 0.4 of an 18-decimal Stock Token for one basket share, and one share is `1e18` share units.

`mint` transfers `unitsPerShare * shares / 1e18` of every ingredient from the caller, rounded up, then mints the shares. `redeem` burns the shares, then transfers each ingredient back, rounded down. `testFuzz_mintRedeemRoundTrip` checks that a round trip leaves the reserves intact aside from at most one wei of dust per ingredient.

`sharePriceUsd()` sums `tokenPrice * unitsPerShare / 10^tokenDecimals`. The result uses 8 decimals, matching Chainlink USD feeds on Robinhood Chain. Those feeds already apply corporate actions to the raw token, so the basket prices the raw balance.

Equity feeds update 24 hours a day, 5 days a week. The deploy script sets `maxPriceAge` to 4 days so a weekend does not freeze the dollar views. A stale or non-positive answer reverts `sharePriceUsd`, `balanceValueUsd`, and `totalValueUsd`. `mint` and `redeem` move tokens at the fixed recipe and complete while a feed is quiet.

## Testnet

Request testnet ETH and Stock Tokens from the [faucet](https://faucet.testnet.chain.robinhood.com).

PowerShell:

```powershell
$env:PRIVATE_KEY = "0xYOUR_TESTNET_KEY"
pnpm run deploy:testnet
```

bash:

```bash
export PRIVATE_KEY=0xYOUR_TESTNET_KEY
pnpm run deploy:testnet
```

A root `.env` file is also read. See `.env.example`. A variable already set in the environment is left as it is.

The testnet basket uses the faucet Stock Tokens TSLA, AMZN, and NFLX, plus mock feeds. Chainlink publishes the real feeds on mainnet. The script verifies the contracts on the testnet Blockscout. Set `VERIFY=0` to skip verification.

The upstream demo deployment:

| Contract | Address |
| --- | --- |
| `BasketFactory` | [`0xC1940D5fd58ce735A44a53f910852B12250F6a14`](https://explorer.testnet.chain.robinhood.com/address/0xC1940D5fd58ce735A44a53f910852B12250F6a14) |
| `BasketToken` (Tech Trio) | [`0x7633e0920Ea46A8Ec54F61C95adECD391c01Edd4`](https://explorer.testnet.chain.robinhood.com/address/0x7633e0920Ea46A8Ec54F61C95adECD391c01Edd4) |

## Mainnet

```bash
export PRIVATE_KEY=0xYOUR_MAINNET_KEY
pnpm run deploy:mainnet
```

On PowerShell, set the key with `$env:PRIVATE_KEY = "0xYOUR_MAINNET_KEY"` before the same `pnpm` command.

The mainnet basket uses TSLA, NVDA, and AAPL and their Chainlink feeds. Minting spends those tokens. Confirm every address on Blockscout and on the [official contracts page](https://docs.robinhood.com/chain/contracts/) before broadcasting.

`pnpm run test:fork` runs that configuration on a local fork and does not broadcast.

## Contract reference

### BasketFactory

| Function | Description |
| --- | --- |
| `createBasket(name, symbol, components, maxPriceAge)` | Deploys a `BasketToken` and registers it |
| `allBaskets()` | Every basket created by this factory |
| `basketCount()` / `basketAt(index)` | Indexed access to the registry |
| `isBasket(address)` | Whether this factory deployed the address |

### BasketToken

| Function | Description |
| --- | --- |
| `mint(shares, to)` | Pulls each ingredient and mints shares. Amounts round up |
| `redeem(shares, to)` | Burns shares and returns each ingredient. Amounts round down |
| `quoteMint(shares)` / `quoteRedeem(shares)` | Ingredient amounts for a share count |
| `sharePriceUsd()` | USD value of one share, 8 decimals. Reverts on a stale or invalid feed |
| `balanceValueUsd(account)` / `totalValueUsd()` | Value of an account, and of the whole basket |
| `components()` / `componentCount()` / `componentAt(i)` | The recipe |

## Reference addresses

Confirm tokens on the [contracts page](https://docs.robinhood.com/chain/contracts/) and feeds in the [Chainlink directory](https://docs.chain.link/data-feeds/price-feeds/addresses?network=robinhood) before use. Another contract can use the same ticker. The testnet Stock Token addresses below come from the faucet's onchain activity and were checked for the ERC-8056 interface. They are not listed in the official docs.

| Asset | Network | Address |
| --- | --- | --- |
| TSLA Stock Token | Mainnet | `0x322F0929c4625eD5bAd873c95208D54E1c003b2d` |
| NVDA Stock Token | Mainnet | `0xd0601CE157Db5bdC3162BbaC2a2C8aF5320D9EEC` |
| AAPL Stock Token | Mainnet | `0xaF3D76f1834A1d425780943C99Ea8A608f8a93f9` |
| TSLA / USD feed | Mainnet | `0x4A1166a659A55625345e9515b32adECea5547C38` |
| NVDA / USD feed | Mainnet | `0x379EC4f7C378F34a1B47E4F3cbeBCbAC3E8E9F15` |
| AAPL / USD feed | Mainnet | `0x6B22A786bAa607d76728168703a39Ea9C99f2cD0` |
| TSLA Stock Token | Testnet | `0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E` |
| AMZN Stock Token | Testnet | `0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02` |
| NFLX Stock Token | Testnet | `0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93` |

## Commands

| Command | Effect |
| --- | --- |
| `pnpm run test:contracts` | Unit tests with mocks |
| `pnpm run test:fork` | Fork tests against Robinhood Chain mainnet |
| `pnpm run build:contracts` | `forge build` |
| `pnpm run fmt:contracts` | `forge fmt` |
| `pnpm run deploy:local` | Deploy to Anvil and write `apps/frontend/.env.local` |
| `pnpm run deploy:testnet` | Deploy to testnet and verify on Blockscout |
| `pnpm run deploy:mainnet` | Deploy to mainnet and verify on Blockscout |
| `pnpm run smoke` | Mint, price, and redeem on the local deploy |
| `pnpm run dev` | Frontend at http://localhost:3000 |
| `pnpm run build:frontend` | Production frontend build |
| `pnpm run lint:frontend` | Frontend lint |
| `pnpm run check` | Compile contracts, run unit tests, and build the frontend |
| `node scripts/extract-snippets.mjs` | Refresh the deep-dive snippets from the contracts |

## License

[MIT](LICENSE).
