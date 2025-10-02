# examples

These examples are Bun-first and demonstrate how to use `@osaurus/sdk` locally.

## Prerequisites

- Osaurus is installed and running locally
- Bun v1.0+ installed

## Install dependencies

```bash
cd examples
bun install
```

If you modified the SDK in the repo root, build it first so `examples` picks up the latest `dist/`:

```bash
cd ..
bun run build
cd examples
```

## Run examples

```bash
# Basic discovery and model list
bun run basic

# Use OpenAI SDK against Osaurus
bun run openai

# Streaming chat completions
bun run streaming

# Electron demo app (for development use only)
bun run electron
```

Notes:

- The Electron example is intentionally simplified for demos.
- Do not use the Electron settings from this example in production.
