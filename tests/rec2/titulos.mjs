import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'node-html-parser';
const dist = process.env.OEDP_DIST ?? 'dist';
const slug = 'evora-contas-da-camara-2010-2025';
for (const [lang, base, titulo] of [
  ['pt', 'estudos', 'Os quatro eixos do plano'],
  ['en', 'en/studies', "The plan's four axes"],
]) {
  const rota = `${base}/${slug}`;
  const root = parse(fs.readFileSync(`${dist}/${rota}/index.html`, 'utf8'));
  const heading = root.querySelector('#bloco-117');
  assert.equal(heading.textContent, titulo, rota);
  assert.equal(heading.tagName, 'H4', 'a transcrição conserva o elemento da origem');
  assert.equal(heading.getAttribute('aria-level'), '3', `${rota}: o título dos eixos deve ter nível acessível 3`);
  const record = JSON.parse(fs.readFileSync(`registos/${slug}/${lang}.record.json`, 'utf8'));
  assert.equal(record.blocks[117].level, 4, 'o registo de origem mantém os bytes transcritos');
  const headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6,[role="heading"]');
  const niveis = headings.map(h => Number(h.getAttribute('aria-level') ?? h.tagName.slice(1)));
  for (let i = 1; i < niveis.length; i++) assert(niveis[i] <= niveis[i - 1] + 1, `${rota}: salto em ${headings[i].outerHTML}`);
  console.log(`REC2 títulos: /${rota}/ #bloco-117, nível acessível 3; sequência sem saltos.`);
}
