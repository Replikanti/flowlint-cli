# FlowLint CLI Development Skill

## Metadata
- **Name:** flowlint-cli-dev
- **License:** MIT
- **Compatibility:** Claude Code, Node.js 24+
- **Package:** flowlint (npm)

## Description

FlowLint CLI is the command-line tool for scanning n8n workflows locally and in CI/CD pipelines. It provides commands for scanning workflows, initializing configuration, and outputting results in multiple formats.

Depends on `@replikanti/flowlint-core` for parsing and rule execution.

## Capabilities

- **add-command:** Add new CLI command
- **add-reporter:** Implement new output format (JSON, SARIF, JUnit, etc.)
- **improve-ux:** Enhance user experience (progress bars, colors, help text)
- **ci-integration:** Improve CI/CD integration (exit codes, output formats)
- **fix-bug:** Fix CLI bugs

## Project Structure

```
flowlint-cli/
├── src/
│   ├── commands/        # CLI commands (scan, init)
│   ├── reporters/       # Output formatters (JSON, SARIF, JUnit)
│   ├── index.ts         # CLI entry point
│   └── types.ts         # CLI-specific types
├── tests/               # CLI tests
└── dist/                # Build output
```

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm test` | Run all tests |
| `npm run dev` | Run CLI in development (tsx) |
| `npm run build` | Build CLI |

## Usage Examples

```bash
# Scan current directory
flowlint scan

# Scan specific directory
flowlint scan ./workflows

# Scan single file
flowlint scan ./workflow.json

# JSON output
flowlint scan --format json

# Fail on errors (CI mode)
flowlint scan --fail-on-error

# Initialize config
flowlint init
```

## CLI Arguments

### scan command
- `[path]` - Directory or file to scan (default: current directory)
- `--format` - Output format: text, json, sarif, junit (default: text)
- `--config` - Config file path (default: .flowlint.yml)
- `--fail-on-error` - Exit with code 1 if errors found
- `--quiet` - Minimal output

### init command
- Creates `.flowlint.yml` with default configuration

## Output Formats

### Text (default)
Human-readable output with colors and formatting

### JSON
Machine-readable JSON for programmatic consumption

### SARIF
Static Analysis Results Interchange Format for IDE integration

### JUnit
XML format for CI/CD systems (Jenkins, GitLab CI, etc.)

## Exit Codes

- `0` - Success, no errors found
- `1` - Errors found (with --fail-on-error)
- `2` - CLI error (invalid arguments, file not found, etc.)

## Common Tasks

### Add New Command

1. Create `src/commands/{command}.ts`
2. Implement command logic
3. Register in `src/index.ts`
4. Add tests in `tests/commands/{command}.test.ts`
5. Update help text

### Add New Reporter

1. Create `src/reporters/{format}.ts`
2. Implement Reporter interface
3. Register in `src/commands/scan.ts`
4. Add tests
5. Update documentation

### Improve Error Messages

1. Identify error scenario
2. Add helpful error message with suggestions
3. Test error handling
4. Update tests

## Guardrails

- Never commit to main branch
- Always run `npm test` before committing
- Test CLI commands manually after changes
- Follow Conventional Commits: `type(scope): description`
- Use internal scope names (commands, reporters) not repo name
- Maintain backward compatibility for CLI arguments
- Exit codes must remain consistent

## Related Files

- `CLAUDE.md` - Main project instructions
- `README.md` - CLI documentation
- `package.json` - Package configuration
- `../flowlint-core/` - Core library dependency
