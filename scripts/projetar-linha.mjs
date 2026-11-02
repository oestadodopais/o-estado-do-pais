import fs from 'node:fs';
import { projecaoLinha } from '../src/lib/projecao-linha.mjs';

process.stdout.write(projecaoLinha(fs.readFileSync(0)));
