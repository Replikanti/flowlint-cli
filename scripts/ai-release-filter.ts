import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PR_BODY = process.env.PR_BODY || '';

if (!OPENAI_API_KEY) { console.error('Missing OPENAI_API_KEY'); process.exit(1); }

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function main() {
  const prompt = `
You are a strict Product Manager polishing a Release Changelog for end users.

Input Changelog:
"""
${PR_BODY}
"""

Your Task:
1. FILTERING:
   - REMOVE all lines about CI, CD, GitHub Actions, workflows, tests, internal chores, refactoring, or dependency updates (except flowlint-core).
   - REMOVE commits like "chore: update renovate", "fix(ci): ...", "docs: update readme".
   - KEEP only user-facing features, bug fixes, and significant performance improvements.

2. REWRITING:
   - Rewrite the remaining items to be exciting and user-focused.
   - Use simple, non-technical language where possible.
   - Group them under clear headers: "### 🚀 New Features", "### 🐛 Bug Fixes", "### ⚡ Improvements".

3. SPECIAL RULE:
   - If you see ANY mention of "@replikanti/flowlint-core" update, YOU MUST ADD this line to Features:
     "- **Core Engine Update**: Includes the latest linting rules and logic improvements from the core engine."

4. DECISION:
   - If AFTER filtering, the changelog is empty (or only has the "Core Engine Update" which turns out to be minor/patch), judge if it's worth a release.
   - HOWEVER, if "Core Engine Update" is present, ALWAYS consider it worth a release (as it propagates rules).
   - If TRULY NO business value remains, output exactly: "NO_RELEASE".

Output:
Return ONLY the final Markdown content (or NO_RELEASE). Do not wrap in markdown code blocks.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-5.1',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
  });

  const content = response.choices[0].message.content?.trim();
  console.log(content);
}

main();
