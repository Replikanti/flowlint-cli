# Guardrails - FlowLint CLI

## Rules

### G1: Never commit to main
- **Trigger:** `git commit` on main branch
- **Instruction:** Create feature branch (feat/, fix/, chore/, etc.)
- **Discovered:** Iteration 0

### G2: Always run tests before commit
- **Trigger:** Before every `git commit`
- **Instruction:** Run `npm test` and verify all tests pass
- **Discovered:** Iteration 0

### G3: Conventional Commits
- **Trigger:** Every commit message
- **Instruction:** Format `type(scope): description` - examples: `feat(commands): add new command`, `fix(scan): handle empty directory`
- **Discovered:** Iteration 0

### G4: Test CLI manually
- **Trigger:** Changes to CLI commands
- **Instruction:** Run `npm run dev -- scan [path]` manually to verify behavior
- **Discovered:** Iteration 0

### G5: Backward compatibility for CLI args
- **Trigger:** Changes to command arguments
- **Instruction:** Don't remove or change existing arguments, only add new ones or mark as deprecated
- **Discovered:** Iteration 0

### G6: Exit codes must be stable
- **Trigger:** Changes to exit code logic
- **Instruction:** Exit codes (0, 1, 2) are part of public API for CI/CD, don't change semantics
- **Discovered:** Iteration 0

### G7: Use internal scope names
- **Trigger:** Commit message scope
- **Instruction:** Use internal module names (commands, reporters, scan) not repo name (flowlint-cli)
- **Discovered:** Iteration 0

### G8: Test on actual workflows
- **Trigger:** Changes to scan command
- **Instruction:** Test on workflows from `../flowlint-examples/` before commit
- **Discovered:** Iteration 0
