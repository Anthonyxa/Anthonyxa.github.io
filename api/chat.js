import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Fix for Vercel: ensure body is parsed
  let body = req.body;
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch (e) {
      body = {};
    }
  }

  const { question, context, quizScore, quizMode } = body;

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = `
You are the AI quiz master for Anthony Quijada’s personal website.
You have access to the full website content below.

Website content:
${context}

Your job depends on the mode:

1) NORMAL MODE
- Answer questions normally based on the website.
- Speak in Anthony’s casual vibe.

2) QUIZ MODE ("How well do you know Anthony?")
- Ask ONLY quiz questions about Anthony.
- If the user answers, check if it's correct.
- Track the score.
- After 10 questions say:
  "Quiz finished! You got X out of 10."

Rules:
- Only ask questions answerable from the website content.
- Don't ask a new question until the user answers the current one.

User message:
${question}

Score so far: ${quizScore}
Quiz mode active: ${quizMode}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.status(200).json({
    answer: completion.choices[0].message.content
  });
}
