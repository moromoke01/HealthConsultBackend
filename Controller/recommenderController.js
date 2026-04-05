import axios from 'axios';
import Doctor from '../Model/DoctorModel.js';

export const recommendDoctorAI = async (req, res) => {
    try {
    const { symptoms } = req.body;

    
    // Call Hugging Face API for classification
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: symptoms,
        parameters: {
          candidate_labels: [
            "Dermatologist",
            "Cardiologist",
            "General Practitioner",
            "Pulmonologist",
            "Endocrinologist",
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
        },
      }
    );

    // Pick top label or fallback
    const labels = response.data?.labels || [];
    const recommendedSpecialty = labels?.[0] || "General Practitioner";


    // Query doctors from MongoDB that match the specialty
    const recommendedDoctor = await Doctor.find({
      specialty: recommendedSpecialty,
    });

    res.json({
      recommendedSpecialty,
      recommendedDoctor,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
}