// Paste your CSV data as a JS array of objects:
const rawData = [
  // Example rows (add all rows from your CSV here, or use a script to convert)
  // { Disease: "Fungal infection", symptoms: ["itching", "skin_rash", "nodal_skin_eruptions", "dischromic _patches"] },
  // { Disease: "Allergy", symptoms: ["continuous_sneezing", "shivering", "chills", "watering_from_eyes"] },
  // ... (add all rows)
];

// If you want to automate CSV to JS conversion, use a script or online tool to convert your CSV to this format.

function predictDisease(userSymptoms) {
  let bestMatch = null;
  let maxMatches = 0;
  let matchCountByDisease = {};

  // For each row in the dataset, count how many symptoms match
  for (const row of rawData) {
    const disease = row.Disease.trim();
    const symptoms = row.symptoms.map(s => s.trim());
    const matches = symptoms.filter(s => userSymptoms.includes(s)).length;

    if (!matchCountByDisease[disease]) matchCountByDisease[disease] = 0;
    matchCountByDisease[disease] += matches;

    if (matches > maxMatches) {
      maxMatches = matches;
      bestMatch = disease;
    }
  }

  // Calculate confidence as a percentage of matched symptoms to total user symptoms
  const confidence = Math.round((maxMatches / (userSymptoms.length || 1)) * 100);

  return {
    predictedDisease: bestMatch || "Unknown",
    confidence: confidence,
    matchCountByDisease
  };
}

module.exports = { predictDisease, rawData };