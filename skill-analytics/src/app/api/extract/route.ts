import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { spawn } from "child_process";

async function runPythonExtractor(pdfPath: string) {
  const projectRoot = process.cwd();
  const cvExtractorDir = path.resolve(projectRoot, "..", "cv-extractor");
  const pythonPath = path.join(cvExtractorDir, ".venv", "Scripts", "python.exe");
  const scriptPath = path.join(cvExtractorDir, "cv_extractor.py");

  return new Promise<string>((resolve, reject) => {
    const proc = spawn(pythonPath, [scriptPath, pdfPath], {
      env: { ...process.env, PYTHONIOENCODING: "utf-8" },
    });
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Extractor exited with code ${code}: ${stderr}`));
      }
    });
    proc.on("error", reject);
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tmpPath = path.join(os.tmpdir(), `upload-${Date.now()}.pdf`);
    await fs.writeFile(tmpPath, buffer);

    try {
      const output = await runPythonExtractor(tmpPath);
      const parsed = JSON.parse(output);
      return NextResponse.json(parsed);
    } finally {
      await fs.rm(tmpPath, { force: true });
    }
  } catch (err) {
    console.error("Extractor error", err);
    return NextResponse.json({ error: "Extraction failed", details: `${err}` }, { status: 500 });
  }
}
