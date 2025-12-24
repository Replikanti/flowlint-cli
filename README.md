# FlowLint CLI

![Coverage](https://img.shields.io/badge/coverage-80%25-green)

Command-line tool for static analysis of n8n workflows.

## Installation

```bash
npm install -g flowlint
```

Or use npx:

```bash
npx flowlint scan .
```

## Usage

### Scan workflows

```bash
# Scan current directory
flowlint scan

# Scan specific directory
flowlint scan ./workflows

# Scan single file
flowlint scan ./workflows/payment-flow.n8n.json

# Output as JSON
flowlint scan --format json

# Fail on errors (for CI)
flowlint scan --fail-on-error
```

### Initialize configuration

```bash
flowlint init
```

Creates a `.flowlint.yml` file in the current directory.

## Testing

Run tests with coverage reporting:

```bash
npm run test:coverage
```

## Configuration

Create a `.flowlint.yml` file:

```yaml
files:
  include:
    - "**/*.n8n.json"
  ignore:
    - "node_modules/**"

rules:
  rate_limit_retry:
    enabled: true
  error_handling:
    enabled: true
  # ... more rules
```

## Rules

| Rule | Description | Severity |
|------|-------------|----------|
| R1 | Rate limit retry | must |
| R2 | Error handling | must |
| R3 | Idempotency | should |
| R4 | Secrets exposure | must |
| R5 | Dead ends | nit |
| R6 | Long running | should |
| R7 | Alert/log enforcement | should |
| R8 | Unused data | nit |
| R9 | Config literals | should |
| R10 | Naming convention | nit |
| R11 | Deprecated nodes | should |
| R12 | Unhandled error path | must |
| R13 | Webhook acknowledgment | must |
| R14 | Retry-After compliance | should |

## License

MIT


## Dependencies

This tool depends on [@replikanti/flowlint-core](https://www.npmjs.com/package/@replikanti/flowlint-core) for linting logic.
