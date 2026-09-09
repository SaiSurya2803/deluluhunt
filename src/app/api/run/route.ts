import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ output: 'Error: Missing language or code', error: true }, { status: 400 });
    }

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'code-run-'));
    let output = '';
    let hasError = false;

    try {
      if (language === 'python') {
        const filePath = path.join(tmpDir, 'main.py');
        await fs.writeFile(filePath, code);
        const { stdout, stderr } = await execAsync(`python "${filePath}"`, { timeout: 5000 });
        output = stdout || stderr;
      } 
      else if (language === 'java') {
        const filePath = path.join(tmpDir, 'Main.java');
        // Simple heuristic: if class is not named Main, Java will complain, but we'll try to just wrap it or let them write public class Main
        await fs.writeFile(filePath, code);
        try {
          await execAsync(`javac "${filePath}"`, { timeout: 5000 });
          const { stdout, stderr } = await execAsync(`java -cp "${tmpDir}" Main`, { timeout: 5000 });
          output = stdout || stderr;
        } catch (compileErr: any) {
          output = compileErr.stderr || compileErr.message;
          hasError = true;
        }
      }
      else if (language === 'c') {
        const filePath = path.join(tmpDir, 'main.c');
        const outPath = path.join(tmpDir, 'main.exe');
        await fs.writeFile(filePath, code);
        try {
          await execAsync(`gcc "${filePath}" -o "${outPath}"`, { timeout: 5000 });
          const { stdout, stderr } = await execAsync(`"${outPath}"`, { timeout: 5000 });
          output = stdout || stderr;
        } catch (compileErr: any) {
          output = compileErr.stderr || compileErr.message;
          hasError = true;
        }
      }
      else if (language === 'javascript') {
        const filePath = path.join(tmpDir, 'main.js');
        await fs.writeFile(filePath, code);
        const { stdout, stderr } = await execAsync(`node "${filePath}"`, { timeout: 5000 });
        output = stdout || stderr;
      }
      else {
        output = `Language ${language} not supported`;
        hasError = true;
      }
    } catch (runErr: any) {
      output = runErr.stderr || runErr.stdout || runErr.message || 'Execution failed or timed out';
      hasError = true;
    } finally {
      // Clean up tmp dir
      try {
        await fs.rm(tmpDir, { recursive: true, force: true });
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    return NextResponse.json({ output, error: hasError });
  } catch (error: any) {
    return NextResponse.json({ output: 'Server error: ' + error.message, error: true }, { status: 500 });
  }
}
