# Harness Score Report

**Maturity level:** L3 · Sensing
**Maturity score:** 80/108 (74%)
**Maturity scopes:** repo
**Gate:** maturity
**Detected harnesses:** Antigravity, Codex

## Dimensions

| Dimension | Score | % |
|---|---|---|
| Context & Guides | 20/20 | 100% |
| Skills & Commands | 9/17 | 53% |
| Hooks & Guardrails | 0/14 | 0% |
| Sensors & Feedback | 20/20 | 100% |
| CI Feedback | 11/14 | 79% |
| Hygiene & Safety | 20/23 | 87% |

## Checks

| | Check | Points | Evidence |
|---|---|---|---|
| ✅ | [CTX-01](https://paladini.github.io/harness-score/guide/measure-and-improve#ctx-01) Agent context file present (AGENTS.md) | 4/4 | Found AGENTS.md at repository root. |
| ✅ | [CTX-02](https://paladini.github.io/harness-score/guide/measure-and-improve#ctx-02) Agent context file is substantive | 3/3 | AGENTS.md: 27 non-empty lines, 8 headings (needs ≥20 lines and ≥2 headings). |
| ✅ | [CTX-03](https://paladini.github.io/harness-score/guide/measure-and-improve#ctx-03) Scoped rules in use | 4/4 | Found 1 rule(s) (antigravity): .agents/rules/kit-overview.md |
| ✅ | [CTX-04](https://paladini.github.io/harness-score/guide/measure-and-improve#ctx-04) Rules have valid frontmatter | 3/3 | All 1 rule(s) declare usable frontmatter. |
| ✅ | [CTX-05](https://paladini.github.io/harness-score/guide/measure-and-improve#ctx-05) Rules are scoped, not all always-on | 2/2 | 1 rule(s): 1 path-scoped, 0 always-on. |
| ✅ | [CTX-06](https://paladini.github.io/harness-score/guide/measure-and-improve#ctx-06) No bloated rules (≤500 lines each) | 2/2 | All 1 rule(s) are ≤500 lines. |
| ✅ | [CTX-07](https://paladini.github.io/harness-score/guide/measure-and-improve#ctx-07) README present | 1/1 | README.md found at repository root. |
| ✅ | [CTX-08](https://paladini.github.io/harness-score/guide/measure-and-improve#ctx-08) No legacy .cursorrules file | 1/1 | No deprecated .cursorrules file. |
| ✅ | [SKL-01](https://paladini.github.io/harness-score/guide/measure-and-improve#skl-01) At least one agent skill defined | 4/4 | Found 7 skill(s) (codex): .agents/skills/hs-brainstorm/SKILL.md, .agents/skills/hs-build/SKILL.md, .agents/skills/hs-extract-oop/SKILL.md, … |
| ✅ | [SKL-02](https://paladini.github.io/harness-score/guide/measure-and-improve#skl-02) Skills declare name and description | 3/3 | All 7 skill(s) declare name and description. |
| ❌ | [SKL-03](https://paladini.github.io/harness-score/guide/measure-and-improve#skl-03) Explicit workflows/commands defined | 0/3 | No command/workflow files found (.cursor/commands, .windsurf/workflows, .claude/commands, .continue/prompts, …). |
| ✅ | [SKL-04](https://paladini.github.io/harness-score/guide/measure-and-improve#skl-04) Skill descriptions are trigger-worthy | 2/2 | All 7 skill description(s) are ≥40 characters. |
| ❌ | [AGT-01](https://paladini.github.io/harness-score/guide/measure-and-improve#agt-01) Custom subagent defined | 0/3 | No subagent files found (.cursor/agents, .claude/agents, or .opencode/agents). |
| ❌ | [AGT-02](https://paladini.github.io/harness-score/guide/measure-and-improve#agt-02) Subagents declare name and description | 0/2 | No subagents found to validate. |
| ❌ | [HKS-01](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-01) Hooks configuration present and valid JSON | 0/4 | No .cursor/hooks.json or .claude/settings.json hooks configuration found. |
| ❌ | [HKS-02](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-02) Hooks use known events and a version field | 0/2 | No parseable hooks configuration. |
| ❌ | [HKS-03](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-03) Gate hook guards risky operations | 0/4 | No parseable hooks configuration. |
| ❌ | [HKS-04](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-04) Feedback hook observes agent output | 0/2 | No parseable hooks configuration. |
| ❌ | [HKS-05](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-05) Hook scripts exist in the repository | 0/2 | No parseable hooks configuration. |
| ✅ | [SNS-01](https://paladini.github.io/harness-score/guide/measure-and-improve#sns-01) Test runner configured | 6/6 | package.json test script: "node oop-kg/backend/verify-backend.test.js". |
| ✅ | [SNS-02](https://paladini.github.io/harness-score/guide/measure-and-improve#sns-02) Linter configured | 5/5 | Found: .eslintrc.json. |
| ✅ | [SNS-03](https://paladini.github.io/harness-score/guide/measure-and-improve#sns-03) Type checking in place | 4/4 | tsconfig.json (strict: true). |
| ✅ | [SNS-04](https://paladini.github.io/harness-score/guide/measure-and-improve#sns-04) Formatter configured | 3/3 | prettier configuration. |
| ✅ | [SNS-05](https://paladini.github.io/harness-score/guide/measure-and-improve#sns-05) Test files actually exist | 2/2 | Found 1 test file(s), e.g. oop-kg/backend/verify-backend.test.js. |
| ✅ | [CI-01](https://paladini.github.io/harness-score/guide/measure-and-improve#ci-01) CI pipeline configured | 4/4 | Found: .github/workflows/ci.yml. |
| ✅ | [CI-02](https://paladini.github.io/harness-score/guide/measure-and-improve#ci-02) CI runs the test suite | 4/4 | CI invokes tests ("test"). |
| ✅ | [CI-03](https://paladini.github.io/harness-score/guide/measure-and-improve#ci-03) CI runs lint / type checks | 3/3 | CI invokes static checks ("tsc"). |
| ❌ | [CI-04](https://paladini.github.io/harness-score/guide/measure-and-improve#ci-04) Pre-commit checks installed | 0/3 | No pre-commit hook tooling detected. |
| ✅ | [HYG-01](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-01) .gitignore present | 2/2 | .gitignore found at repository root. |
| ✅ | [HYG-02](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-02) .gitignore covers environment files | 3/3 | .gitignore contains a .env pattern. |
| ✅ | [HYG-03](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-03) No unprotected .env files in the tree | 4/4 | No real .env files in the tree (templates like .env.example are fine). |
| ✅ | [HYG-04](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-04) MCP configuration free of credentials | 4/4 | No MCP config in repository (nothing to leak). |
| ✅ | [HYG-05](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-05) License present | 2/2 | Found LICENSE. |
| ✅ | [HYG-06](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-06) No credential signatures in harness files | 2/2 | Scanned 10 harness file(s); no credential signatures. |
| ✅ | [HYG-07](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-07) Dependency lockfile committed | 3/3 | Found package-lock.json. |
| ❌ | [HYG-08](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-08) MCP config uses env interpolation for credentials | 0/3 | No MCP config found (.cursor/mcp.json, .mcp.json, or .agents/mcp_config.json). |

## Recommended improvements

- **SKL-03** — Add explicit workflow/command entry points (.cursor/commands/, .windsurf/workflows/, .claude/commands/, .continue/prompts/, …) for workflows you trigger intentionally. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#skl-03))
- **AGT-01** — Create a subagent definition (.cursor/agents/, .claude/agents/, or .opencode/agents/) for a purpose-built delegate (planning, review, release…). ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#agt-01))
- **AGT-02** — Add frontmatter with name: and description: to every subagent definition — the parent agent decides whether to delegate from those two fields alone. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#agt-02))
- **HKS-01** — Create a hooks configuration (.cursor/hooks.json or .claude/settings.json hooks key) — hooks are the harness layer that can observe and control the agent loop deterministically. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-01))
- **HKS-02** — Register handlers only on documented events for your tool (Cursor: beforeShellExecution, afterFileEdit, …; Claude Code: PreToolUse, PostToolUse, …) — typos fail silently. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-02))
- **HKS-03** — Register a gate hook (Cursor: beforeShellExecution / beforeMCPExecution / preToolUse; Claude Code: PreToolUse) that returns allow/deny/ask for destructive operations. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-03))
- **HKS-04** — Register a feedback hook (Cursor: afterFileEdit / postToolUse / stop; Claude Code: PostToolUse) — e.g. auto-format edited files or run a quick lint. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-04))
- **HKS-05** — Commit the scripts referenced by your hooks config — a hook pointing at a missing script fails open on every machine but yours. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#hks-05))
- **CI-04** — Add pre-commit tooling (husky + lint-staged, pre-commit, lefthook) so fast checks run before a commit exists — the earliest possible feedback loop. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#ci-04))
- **HYG-08** — Reference credential-shaped values in MCP config via ${ENV_VAR} interpolation instead of literals — this rewards deliberate, safe tool-access configuration. ([guide](https://paladini.github.io/harness-score/guide/measure-and-improve#hyg-08))

**To reach L4:** hooks ≥ 70%; total ≥ 80%
