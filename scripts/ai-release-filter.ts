import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PR_BODY = process.env.PR_BODY || '';

if (!OPENAI_API_KEY) { console.error('Missing OPENAI_API_KEY'); process.exit(1); }

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function main() {
  const prompt = `
You are a Release Manager Quality Gate.
Analyze the following Pull Request description (which contains a Changelog).

Goal: Determine if this release contains ACTUAL BUSINESS VALUE (new features, user-facing fixes, performance improvements, new rules).
Ignore: Internal chores, CI updates, dependency bumps that don't bring new features (unless it's a major framework update), docs tweaks (unless it's a new guide).

Input:
"""
${PR_BODY}
"""

Instructions:
1. If there is NO business value, return exactly: "NO_RELEASE"
2. If there IS business value, rewrite the Changelog to be user-focused and exciting. Remove technical jargon if possible. Keep the format compatible with Release Please (using headers like ### Features, ### Bug Fixes).
3. If the input mentions "update dependency @replikanti/flowlint-core", assume this BRINGS new rules/features. In this case, explicitly state: "Includes latest FlowLint Core rules and improvements."

Output ONLY the rewriten changelog or "NO_RELEASE".
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
