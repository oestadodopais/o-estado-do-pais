/** E0: medidas reproduzíveis; a E0b revê os três detetores apontados na leitura. */
import fs from 'node:fs';
import os from 'node:os';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { load } from 'js-yaml';
import { conferirLinhasDaCasa, plantasDasLinhasDaCasa } from '../../../../tests/inicio/linhas-da-casa.mjs';
import { decimalDoExcerto, anatomiaDoDiff, lerCodigoDaCorrida, recontarCorrecoes, conferirPrefixosDaHistoria } from './detetores-e0b.mjs';
import { provarDetetores } from './provar-detetores-e0b.mjs';
import { provarDetetoresE0c } from './provar-detetores-e0c.mjs';
import { loadClaims } from '../../../../src/lib/ledger.mjs';
const pasta = 'design/especime-v3/medicoes/e0-2026-09-30';
const base = '07549ee1e9ec2b39186f9e9f13eeac4914bf5e76';
const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const sha = b => createHash('sha256').update(b).digest('hex');
const cabeca = git('rev-parse', 'HEAD');
const celula = conferirLinhasDaCasa('dist');
const plantas = plantasDasLinhasDaCasa('dist');
const medidas = [];
const positivosRevistos = provarDetetores();
fs.writeFileSync(`${pasta}/detetores-e0b.json`, JSON.stringify({ cabeca, medido_em: new Date().toISOString(), ...positivosRevistos }, null, 2) + '\n');
const positivosE0c = provarDetetoresE0c();
fs.writeFileSync(`${pasta}/detetores-e0c.json`, JSON.stringify({ cabeca, medido_em: new Date().toISOString(), ...positivosE0c }, null, 2) + '\n');
const medida = (nome, valor, o_que, encontrado, evidencia) => {
  assert.ok(encontrado, `${nome}: o conhecido-positivo não foi encontrado.`);
  medidas.push({ nome, valor, comando: `node ${pasta}/medir-e0.mjs`, conhecido_positivo: { o_que, encontrado }, evidencia });
};
const anteriores = json(`${pasta}/estado-anterior.json`);
medida('selador_ja_aceitava_a_linha_do_projeto', anteriores.selador_ja_aceita_derivadas,
  'A entrada 3 para 5 foi escrita pelo selador original numa cópia sem source_url.',
  anteriores.selador_derivado.codigo === 0 && anteriores.selador_derivado.historia[0].new_value === '5', 'estado-anterior.json');
const linhas = celula.medidas.linhas;
const decimais = linhas.filter(c => c.id.startsWith('taxa-')).map(c => ({ ...c,
  campo_lido: 'excerpt', decimal_da_fonte: decimalDoExcerto(load(fs.readFileSync(`ledger/claims/${c.id}.yml`, 'utf8')).excerpt) }));
medida('desemprego_com_decimal', decimais, 'O detetor lê 6.0 no campo excerpt de cada linha e recusa a planta com 6.',
  positivosRevistos.conhecidos_positivos.desemprego_com_decimal, 'detetores-e0b.json e leitura dos dois YAML.');
const contado = recontarCorrecoes(loadClaims());
assert.equal(contado, celula.medidas.correcoes_contadas);
medida('correcoes_publicadas', { contado, linha: linhas.find(c => c.id === 'correcoes-publicadas') },
  'Retirar a correção do PIB do Alentejo numa cópia baixa uma unidade no mesmo detetor da recontagem.',
  positivosE0c.conhecidos_positivos.correcoes_publicadas, 'detetores-e0c.json e contagensDoRegisto.');
medida('tres_mudancas_com_lugar', celula.medidas.registos,
  'O lugar do contador é visto nas duas edições; a planta retira-o da inglesa.',
  celula.medidas.registos.filter(r => r.id === 'correcoes-publicadas' && r.lugar === 'O Estado do País').length === 2 && plantas.find(p => p.nome === 'lugar retirado do registo inglês').mordeu, 'HTML de /correcoes e /en/corrections.');
medida('desemprego_visivel', celula.medidas.valores_visiveis,
  'A primeira página tem as duas representações da medida e o cartão tem a sua quantidade.',
  celula.medidas.valores_visiveis.length === 4 && celula.medidas.valores_visiveis.every(v => v.valores.length > 0), 'HTML da primeira página e de Emprego, nas duas edições.');
medida('plantas_que_mordem', { total: plantas.length, mordidas: plantas.filter(p => p.mordeu).length, plantas },
  'A planta A produz código 1 com a queixa A3 do portão real.',
  plantas.find(p => p.nome === 'A: contador sem declaração, A3')?.codigo === 1 && plantas.find(p => p.nome === 'A: contador sem declaração, A3')?.mordeu, 'Processos isolados e cópias em memória; nenhum ficheiro real é plantado.');
const historiaAntes = JSON.parse(git('show', `${base}:ledger/historias-valores.json`));
const historia = json('ledger/historias-valores.json');
const queixasDaHistoria = conferirPrefixosDaHistoria(historiaAntes, historia);
const conservadas = queixasDaHistoria.length === 0;
medida('historia_anterior_conservada', { linhas_anteriores: Object.keys(historiaAntes).length, conservadas, linhas_novas: Object.keys(historia).filter(id => !(id in historiaAntes)) },
  'Alterar uma entrada selada de Évora numa cópia produz a queixa do mesmo detetor que confere os prefixos.',
  positivosE0c.conhecidos_positivos.historia_anterior_conservada, 'detetores-e0c.json e comparação dos prefixos com a base.');
const valoresMudados = git('diff', '--name-only', base, '--', 'ledger/claims').split('\n').filter(Boolean).map(p => {
  const antes = load(git('show', `${base}:${p}`));
  const depois = load(fs.readFileSync(p, 'utf8'));
  return { id: depois.id, antes: antes.value, depois: depois.value };
}).filter(c => c.antes !== c.depois);
medida('valores_mudados', valoresMudados, 'A linha do contador é encontrada entre os valores alterados.',
  valoresMudados.some(c => c.id === 'correcoes-publicadas' && c.antes === '3' && c.depois === '5'), 'git diff contra a base, com leitura dos valores YAML.');
const anatomia = anatomiaDoDiff(git('diff', '--name-only', base, '--', 'src/components', 'src/views', 'src/styles'));
medida('anatomia_mudada', anatomia, 'O detetor encontra RegistoCorrecoes no diff real e vê a planta de CartaoDaMedida no mesmo formato.',
  positivosRevistos.conhecidos_positivos.anatomia_mudada, 'git diff e detetores-e0b.json; o registo é a mudança autorizada da E0b.');
const capturas = json(`${pasta}/capturas-e0.json`);
const imagens = capturas.resultados.map(r => {
  const b = fs.readFileSync(r.ficheiro);
  assert.equal(b.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  return { ficheiro: r.ficheiro, lang: r.lang, largura_janela: r.largura, largura_png: b.readUInt32BE(16), altura_png: b.readUInt32BE(20), confere: sha(b) === r.sha256 };
});
const controle = fs.readFileSync(capturas.resultados[0].ficheiro);
const corrompida = Buffer.from(controle); corrompida[0] ^= 1;
medida('capturas', { total: imagens.length, resumos_conferidos: imagens.filter(r => r.confere).length, problemas: capturas.problemas, imagens },
  'A primeira imagem é um PNG; trocar um byte faz o resumo divergir pelo mesmo detetor.',
  sha(controle) === capturas.resultados[0].sha256 && sha(corrompida) !== capturas.resultados[0].sha256, 'capturas-e0.json e PNG, com resumos recalculados.');
const e1 = json(`${pasta}/prova-e1.json`);
medida('selador_disponivel_para_e1', e1, 'As quatro entradas seladas de Évora são preservadas e a quinta é acrescentada só na cópia.',
  e1.antes === 4 && e1.depois === 5 && e1.passado_conservado && e1.linha_real_conservada, 'prova-e1.json');
const portas = ['build', 'verify', 'typecheck'].map(nome => {
  const p = `${pasta}/portoes/e0b/${nome}`;
  if (!fs.existsSync(`${p}.json`)) return { nome, codigo: null, cabeca: null, segundos: null, medido: false };
  const r = json(`${p}.json`);
  const lido = lerCodigoDaCorrida(`${p}.codigo`, r.limites_da_escrita.inicio, r.limites_da_escrita.fim);
  const codigo = lido.codigo;
  const head = fs.readFileSync(`${pasta}/portoes/e0b/cabeca`, 'utf8').trim();
  assert.equal(codigo, r.codigo); assert.equal(head, r.cabeca);
  return { nome, codigo, cabeca: head, segundos: r.segundos, segundos_relatorio: Number(r.segundos.toFixed(1)),
    medido: lido.medido && r.medido_nesta_corrida, codigo_por_registar: r.codigo_por_registar };
});
medida('portoes', portas, 'O detetor lê o código 1 de um processo desta corrida e recusa a mesma escrita envelhecida.',
  positivosRevistos.conhecidos_positivos.portoes, 'portoes/e0b, produzido por portoes.sh, e detetores-e0b.json.');
const custo = json(`${pasta}/custo.json`);
medida('custo', custo, 'O evento token_count tem saída e total cumulativo, na sessão identificada pelo ambiente.',
  custo.conhecido_positivo && custo.construtor.sessao === process.env.CODEX_THREAD_ID, 'custo.json, extraído por medir-custo.py.');
const alterados = [...new Set([...git('diff', '--name-only', base).split('\n'), ...git('ls-files', '--others', '--exclude-standard').split('\n')])].filter(p => p && fs.existsSync(p) && fs.statSync(p).isFile());
const revela = b => [process.cwd(), os.homedir(), os.userInfo().username].some(s => b.includes(s));
const fugas = alterados.filter(p => revela(fs.readFileSync(p).toString()));
medida('ficheiros_com_dados_da_maquina', { lidos: alterados.length, fugas },
  'O mesmo detetor vê o caminho real só em memória e aceita uma frase limpa.', revela(process.cwd()) && !revela('Uma frase do projeto.'), 'Ficheiros alterados e novos, sem guardar a cadeia privada da planta.');
const erros = [...celula.erros];
const contadorE0b = load(fs.readFileSync('ledger/claims/correcoes-publicadas.yml', 'utf8'));
if (contadorE0b.reference_date !== '2026-09-30' || contadorE0b.access_date !== '2026-09-30' || contadorE0b.document.edition !== '30.09.2026')
  erros.push('E0b: as datas do contador não são as da recontagem.');
if (linhas.filter(c => c.id.startsWith('taxa-')).some(c => c.valor !== '6,0') ||
    celula.medidas.correcoes_contadas !== 5 || linhas.find(c => c.id === 'correcoes-publicadas').valor !== '5')
  erros.push('Os valores do teste de aceitação E0 não são 6,0, 6,0 e 5.');
if (plantas.some(p => !p.mordeu)) erros.push('Uma planta não mordeu.');
if (decimais.some(c => c.decimal_da_fonte?.replace('.', ',') !== c.valor)) erros.push('A precisão da casa diverge dos dois campos excerpt.');
if (!conservadas || valoresMudados.length !== 3 || anatomia.some(p => p !== 'src/components/RegistoCorrecoes.astro') || fugas.length) erros.push('História, âmbito ou privacidade divergentes.');
if (imagens.length !== 12 || imagens.some(i => !i.confere) || capturas.problemas.length || capturas.cabeca !== cabeca) erros.push('Capturas incompletas, divergentes ou de outra cabeça.');
const finais = portas.every(p => p.medido && p.codigo === 0 && p.cabeca === cabeca && !p.codigo_por_registar);
const r = { bloco: 'E0', base, cabeca, medido_em: new Date().toISOString(), medidas, erros,
  e0b: { base: '728ffc67a702e4912f4919b8a8b356e28a66ea63', ponto_1: 'parado por fonte, ver fontes-e0b.json',
    nomes_do_registo: celula.medidas.nomes, contador: { value: contadorE0b.value, reference_date: contadorE0b.reference_date,
      access_date: contadorE0b.access_date, edition: contadorE0b.document.edition },
    restantes_conferidos: erros.length === 0 && finais, completa: false },
  contagens: { medidas: medidas.length, conhecidos_positivos: medidas.filter(m => m.conhecido_positivo.encontrado).length,
    linhas_desemprego: linhas.filter(c => c.id.startsWith('taxa-')).length, edicoes: new Set(celula.medidas.registos.map(r => r.lang)).size },
  aceitação: { conteudo_e_provas: erros.length === 0, portoes_na_cabeca_final: finais, completa: erros.length === 0 && finais } };
fs.writeFileSync(`${pasta}/plantas.json`, JSON.stringify(plantas, null, 2) + '\n');
fs.writeFileSync(`${pasta}/medidas.json`, JSON.stringify(r, null, 2) + '\n');
console.log(`E0: ${medidas.length} medidas com conhecido-positivo, ${plantas.length} plantas, ${erros.length} erros, aceitação completa: ${r.aceitação.completa}.`);
process.exitCode = erros.length ? 1 : 0;
