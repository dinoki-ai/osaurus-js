# @osaurus/sdk

Osaurus SDK for Node.js and Electron.

## Installation

```bash

npm install @osaurus/sdk
# or
pnpm add @osaurus/sdk
# or
yarn add @osaurus/sdk
# or
bun add @osaurus/sdk
```

## Usage

```ts
import { discover } from "@osaurus/sdk";

const instance = await discover();
console.log("Osaurus running at:", instance.url);
```

## Examples

See [examples](examples/) folder for complete examples:

* [Basic](examples/basic.ts) - Basic usage of the SDK.
* [With OpenAI](examples/openai.ts) - Using the SDK with OpenAI.
* [Streaming](examples/streaming.ts) - Using the SDK with streaming.
* [Electron](examples/electron.ts) - Using the SDK with Electron.

### Run examples locally

```bash
cd examples
bun install
bun run basic
```

## API

* `discover(): Promise<OsaurusInstance>`

Discovers the latest running Osaurus instance.

Returns:

* `instanceId`: Unique instance identifier
* `url`: Base URL for API calls
* `port`: Port number
* `address`: IP address
* `exposeToNetwork`: Whether exposed to LAN
* `updatedAt`: Last update timestamp

Throws if no running instance found.

## License

MIT
