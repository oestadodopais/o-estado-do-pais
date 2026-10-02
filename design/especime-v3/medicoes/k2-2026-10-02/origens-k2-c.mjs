/** K2-c: a coordenada nova da origem `eurostat-tipslm90-sexo` («Age class: From 15 to 29 years»), conferida contra os
 * bytes selados no motor: o sha256 do ficheiro da resposta, o registo do pedido (endereço, hora, cliente, sha256), a
 * etiqueta da dimensão `age` e a da sua única categoria, juntas com «: » (a forma da I129), e o excerto da linha
 * `jovens-nem-2025`, lida no mesmo endereço, que a traz como segmento. O conhecido-positivo é o excerto que a mesma
 * origem já declarava, «Sex: Total», refeito da dimensão `sex` pela mesma conta.
 * Uso, da raiz da worktree: node design/especime-v3/medicoes/k2-2026-10-02/origens-k2-c.mjs <raiz do motor> <saída.json>
 * (a raiz do motor fica fora do ficheiro: a saída guarda só os caminhos relativos a ela). */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { load } from 'js-yaml';
import { ORIGENS_DAS_DEFINICOES } from '../../../../src/data/figuras.mjs';

const [motor, saida] = process.argv.slice(2);
if (!motor || !saida) throw new Error('Uso: origens-k2-c.mjs <raiz do motor> <saída.json>');
const chave = 'eurostat-tipslm90-sexo';
const o = /** @type {any} */ (ORIGENS_DAS_DEFINICOES)[chave];
const ficheiro = path.join(motor, o.selo.motor);
const bytes = fs.readFileSync(ficheiro);
const sha = createHash('sha256').update(bytes).digest('hex');
const resposta = JSON.parse(bytes.toString('utf8'));
const coordenada = (dim) => {
  const d = resposta.dimension?.[dim];
  const etiquetas = Object.values(d?.category?.label ?? {});
  return etiquetas.length === 1 ? `${d.label}: ${etiquetas[0]}` : null;
};
const pedidos = fs.readFileSync(path.join(path.dirname(ficheiro), 'pedidos.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const pedido = pedidos.find((p) => p.file === path.basename(ficheiro) && p.url === o.url) ?? null;
const linha = load(fs.readFileSync('ledger/claims/jovens-nem-2025.yml', 'utf8'));
const resultado = {
  origem: chave,
  coordenadas_declaradas: o.coordenadas,
  ficheiro_no_motor: o.selo.motor,
  sha256_declarado: o.selo.sha256,
  sha256_medido: sha,
  sha256_confere: sha === o.selo.sha256,
  pedido_registado: Boolean(pedido),
  hora_do_pedido: pedido?.timestamp_utc ?? null,
  hora_confere: pedido?.timestamp_utc === o.selo.hora,
  cliente_confere: pedido?.cliente === o.selo.cliente,
  sha256_do_pedido_confere: pedido?.sha256 === o.selo.sha256,
  coordenada_da_resposta: coordenada('age'),
  coordenada_confere: coordenada('age') === o.coordenadas,
  titulo_do_conjunto_na_resposta: resposta.label ?? null,
  linha_lida_no_mesmo_endereco: linha.source_url === o.url,
  segmento_do_excerto_da_linha: String(linha.excerpt).split(' — ').includes(o.coordenadas),
  conhecido_positivo: { o_que: 'o excerto «Sex: Total» da mesma origem, refeito da dimensão sex', refeito: coordenada('sex'), confere: coordenada('sex') === o.excerto },
};
resultado.certo = resultado.sha256_confere && resultado.pedido_registado && resultado.hora_confere && resultado.cliente_confere &&
  resultado.sha256_do_pedido_confere && resultado.coordenada_confere && resultado.linha_lida_no_mesmo_endereco && resultado.segmento_do_excerto_da_linha &&
  resultado.conhecido_positivo.confere;
fs.writeFileSync(saida, JSON.stringify(resultado, null, 2) + '\n');
console.log(`${resultado.certo ? 'certo' : 'ERRADO'} · ${o.coordenadas} · sha256 ${resultado.sha256_confere ? 'confere' : 'NÃO confere'} · resposta «${resultado.coordenada_da_resposta}»`);
process.exitCode = resultado.certo ? 0 : 1;
