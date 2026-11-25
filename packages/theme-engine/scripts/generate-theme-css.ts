import * as fs from 'fs';
import * as path from 'path';
import { generateAllThemesCSS } from '../src/css-generator';

const outputPath = path.resolve(__dirname, '..', 'theme.css');

fs.writeFileSync(outputPath, generateAllThemesCSS(), 'utf-8');
console.log(`[theme-engine] Theme CSS generated at ${outputPath}`);
