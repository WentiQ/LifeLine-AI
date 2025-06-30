import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const symptoms = body.symptoms || [];

  return new Promise((resolve) => {
    const py = spawn("python", [
      "./predict_disease.py",
      JSON.stringify(symptoms),
    ]);

    let data = "";
    py.stdout.on("data", (chunk) => (data += chunk));
    py.stderr.on("data", (err) => console.error("PYTHON ERROR:", err.toString()));

    py.on("close", (code) => {
      if (code === 0) {
        const [predictedDisease, confidence] = data.trim().split(",");
        resolve(
          NextResponse.json({
            predictedDisease: predictedDisease.split(":")[1].trim(),
            confidence: parseFloat(confidence.split(":")[1]),
          })
        );
      } else {
        resolve(NextResponse.json({ error: "Model prediction failed" }, { status: 500 }));
      }
    });
  });
}