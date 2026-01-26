# Ralph Loop - FlowLint CLI

## Task

Development and maintenance of FlowLint CLI - command-line tool for scanning n8n workflows.

## Completion Criteria

- [ ] `flowlint scan` command works correctly
- [ ] `flowlint init` creates proper config file
- [ ] All output formats work (text, json, sarif, junit)
- [ ] Exit codes are correct for CI/CD
- [ ] Tests pass
- [ ] Help text is clear and accurate

## Max Iterations

10

## Context Files

- CLAUDE.md - Main project instructions
- README.md - CLI documentation
- src/index.ts - CLI entry point
- src/commands/ - Command implementations
- src/reporters/ - Output formatters
- tests/ - Test suite

## Notes

FlowLint CLI is the primary way users interact with FlowLint locally and in CI/CD.

When making changes:
- Test commands manually
- Verify exit codes for CI/CD scenarios
- Ensure error messages are helpful
- Maintain backward compatibility for CLI arguments
