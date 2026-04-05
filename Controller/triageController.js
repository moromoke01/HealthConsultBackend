// backend/controllers/triageController.js
import axios from "axios";

export async function triageSymptoms(req, res) {
  try {
    const { symptoms } = req.body;

    // ✅ Validate input
    if (!symptoms || symptoms.trim() === "") {
      return res.status(400).json({ error: "Symptoms are required" });
    }

    // Create the input for Hugging Face NLI model
    const inputText = `Patient reports: ${symptoms}. 
Classify urgency as: Emergency, Urgent (24h), or Routine.`;

    // ✅ Call Hugging Face Inference API with candidate labels
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: inputText,
        parameters: {
          candidate_labels: ["Emergency", "Urgent (24h)", "Routine"],
        },
      },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
      }
    );

    // ✅ Hugging Face response looks like:
    // {
    //   "sequence": "...",
    //   "labels": ["Routine", "Urgent (24h)", "Emergency"],
    //   "scores": [0.85, 0.10, 0.05]
    // }

    const { labels, scores } = response.data;

    // Pick the top label
    const prediction = labels?.[0] || "Routine";

    res.json({
      triage: prediction,
      scores, // send scores if frontend wants confidence values
    });
  } catch (err) {
    console.error("Error in triage:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to classify symptoms" });
  }
}
