/** Caso real congelado: os avisos de teste não dependem das revisões atuais. */
import fs from 'node:fs';
import {revisoesPorAplicar} from '../../scripts/check-quadro.mjs';
export const casoFixo=JSON.parse(fs.readFileSync(new URL('./caso-fixo.json',import.meta.url),'utf8'));
export const linhasFixas=new Map([[casoFixo.linha.id,casoFixo.linha]]);
export const pendentesFixos=revisoesPorAplicar(linhasFixas);
if(pendentesFixos.size!==1)throw Error('o caso fixo exige uma revisão por aplicar');
