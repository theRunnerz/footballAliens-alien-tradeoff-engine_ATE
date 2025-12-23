import { json } from '@sveltejs/kit';

const PERSONALITIES = {
  default: 'calm strategic alien optimizing long-term energy',
  ruthless: 'cold disciplined alien focused on dominance',
  gentle: 'supportive alien minimizing burnout'
};

export async function POST({ request }) {
  const { alien, mode, data } = await request.json();

  const prompt = `
You are a ${PERSONALITIES[alien]}.

MODE: ${mode}

If sleep mode:
- Recommend bedtime and wake time
- Give ONE non-negotiable rule
- Be concise

Return JSON:
{
  "decision": "",
  "reasoning": "",
  "tradeoff": "",
  "regretScore": 0.0
}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-3:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: JSON.stringify(data) }] }]
      })
    }
  );

  const out = await response.json();
  const text = out.candidates[0].content.parts[0].text;

  return json(JSON.parse(text));
}
