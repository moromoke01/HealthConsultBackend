// backend/controllers/recommendationController.js
import Doctor from '../Model/DoctorModel.js';

export const recommendDoctor = async (req, res) => {
  try {
    const { symptoms } = req.body;

    // basic keyword mapping
    const symptomMapping = {
       "skin rash": "Dermatologist",
      "acne": "Dermatologist",
      "eczema": "Dermatologist",

      "chest pain": "Cardiologist",
      "shortness of breath": "Cardiologist",
      "irregular heartbeat": "Cardiologist",

      "fever": "General Practitioner",
      "headache": "General Practitioner",
      "fatigue": "General Practitioner",

      "cough": "Pulmonologist",
      "asthma": "Pulmonologist",
      "difficulty breathing": "Pulmonologist",

      "diabetes": "Endocrinologist",
      "thyroid": "Endocrinologist",
      "hormonal imbalance": "Endocrinologist",
    };

    // find best match
    let recommendedSpecialty = "General Practitioner";
    for (const key in symptomMapping) {
      if (symptoms.toLowerCase().includes(key)) {
        recommendedSpecialty = symptomMapping[key];
        break;
      }
    }

    // fetch doctors in that specialty
    const doctors = await Doctor.find({ specialty: recommendedSpecialty });

    res.json({ recommendedSpecialty, doctors });
  } catch (err) {
    console.error("Error recommending doctors:", err);
    res.status(500).json({ error: "Recommendation failed" });
  }
};
