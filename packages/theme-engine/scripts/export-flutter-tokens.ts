import * as fs from 'fs';
import * as path from 'path';
import { generateFlutterTokensJSON } from '../src/flutter-tokens';

const outputPath = path.resolve(__dirname, '..', '..', 'flutter_core', 'assets', 'theme-tokens.json');
const outputDir = path.dirname(outputPath);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, generateFlutterTokensJSON(), 'utf-8');
console.log(`[theme-engine] Flutter theme tokens exported to ${outputPath}`);
