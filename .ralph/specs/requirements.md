# FlowLint CLI - Technical Requirements

## Overview

Command-line interface for FlowLint. Published as `flowlint` on npm.

## Core Functionality

### Commands

#### scan
- Scan directory or file for n8n workflows
- Support glob patterns
- Output in multiple formats (text, json, sarif, junit)
- CI/CD mode with proper exit codes

#### init
- Create `.flowlint.yml` config file
- Interactive or non-interactive mode
- Default configuration template

### Output Formats

#### Text (default)
- Human-readable
- Colors for severity (red=must, yellow=should, gray=nit)
- Summary statistics
- File paths and line numbers

#### JSON
- Machine-readable
- Complete finding details
- Suitable for programmatic consumption

#### SARIF
- Static Analysis Results Interchange Format (v2.1.0)
- IDE integration (VS Code, etc.)
- GitHub Code Scanning compatible

#### JUnit
- XML format
- CI/CD system integration
- Jenkins, GitLab CI, etc.

### Configuration

- Read from `.flowlint.yml` (default)
- Custom config path via `--config`
- Environment variable support
- Config validation

## Technical Constraints

- Node.js >= 24.12.0
- Depends on `@replikanti/flowlint-core`
- Cross-platform (Linux, macOS, Windows)
- No external runtime dependencies

## CLI Standards

- POSIX-compliant argument parsing
- Standard streams (stdout, stderr)
- Exit codes: 0 (success), 1 (errors found), 2 (CLI error)
- Help text via `--help`
- Version via `--version`

## Performance

- Handle large directories efficiently
- Stream processing for large files
- Parallel file processing where possible

## Error Handling

- Clear error messages
- Suggestions for fixing common errors
- Graceful degradation (partial results if some files fail)
