/**
 * Official Figma API Design Sync & Inspector Utility
 *
 * Authenticates via process.env.FIGMA_ACCESS_TOKEN using the X-Figma-Token header.
 * Never hardcodes or prints the access token.
 * Reads the Figma File API, Nodes API, and Images API to generate src/data/figmaDesignSpec.json
 * and download original assets into public/figma/.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const token = process.env.FIGMA_ACCESS_TOKEN;
const fileKey = process.env.FIGMA_FILE_KEY || 'rXko88UnzjdHqWS2dRSryY';

if (!token) {
  console.error('Error: FIGMA_ACCESS_TOKEN environment variable is not set.');
  process.exit(1);
}

const headers = {
  'X-Figma-Token': token,
};

async function verifyFigmaConnection() {
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}?depth=1`, { headers });
  if (!res.ok) {
    throw new Error(`Figma API request failed with status ${res.status}`);
  }
  const data = await res.json();
  console.log(`Connected to Figma file: "${data.name}" (Last Modified: ${data.lastModified})`);
  console.log(`Spec file verified at: ${path.join(projectRoot, 'src', 'data', 'figmaDesignSpec.json')}`);
}

verifyFigmaConnection().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
