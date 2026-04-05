import 'dotenv/config';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// POST /api/symptom
export async function checkSymptoms(req, res){
  try {
    const { symptoms, duration, severity } = req.body;

    if (!symptoms) {
      return res.status(400).json({
        error: "Symptoms are required",
      });
    }

    const prompt = `
    A patient reports the following symptoms: ${symptoms}.
    Duration of symptoms: ${duration || "not specified"}.
    Severity of symptoms: ${severity || "not specified"}.

    Act like a medical triage assistant.
    Provide:
    1. Possible conditions (not diagnosis, just suggestions)
    2. Urgency level (self-care, consult in 24hrs, consult immediately).
    3. Recommended next steps (e.g., book virtual consultation, go to ER). 
    Keep response short and patient-friendly.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    res.status(200).json({
      response: aiResponse,
    });
  } catch (error) {
    console.error("Error checking symptoms:", error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
}