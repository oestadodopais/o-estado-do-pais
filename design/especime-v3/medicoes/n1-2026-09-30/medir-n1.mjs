/** N1: mede o HTML construído, os dados preservados e as provas, sem inferir sucesso do comando. */
import fs from 'node:fs';
import { ficheirosComDadosLocais, plantaDaPrivacidade } from './privacidade-n1.mjs';
import { conferirAcertosN1c, plantasDosAcertosN1c } from '../../../../tests/inicio/n1c.mjs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { parse } from 'node-html-parser';
import { load } from 'js-yaml';
import { ENTRADAS } from '../../../../src/data/primeira-pagina.mjs';
import { conferirBlocosUnicos, plantasDosBlocosUnicos } from '../../../../tests/inicio/blocos-unicos.mjs';
import { conferirEntradas, plantasDasEntradas } from '../../../../tests/inicio/entradas.mjs';
import { conferirConcelhosNosLugares, plantasDosConcelhos } from '../../../../tests/inicio/concelhos-nos-lugares.mjs';
import { loadClaims, contagensDoRegisto } from '../../../../src/lib/ledger.mjs';
import { conferirHistoriaDoValor } from '../../../../src/lib/historia-do-valor.mjs';
const pasta = 'design/especime-v3/medicoes/n1-2026-09-30';
const n1c = process.argv.includes('--n1c');
const n1b = process.argv.includes('--n1b');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const json = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const html = (rota) => parse(fs.readFileSync(`dist/${rota.replace(/^\//, '')}index.html`, 'utf8'));
const sha = (s) => createHash('sha256').update(s).digest('hex');
const unicos = conferirBlocosUnicos('dist');
const entradas = conferirEntradas('dist');
const concelhos = conferirConcelhosNosLugares('dist');
const plantas = [...plantasDosBlocosUnicos('dist'), ...plantasDasEntradas('dist'), ...plantasDosConcelhos('dist'), ...(n1c ? plantasDosAcertosN1c('dist') : [])];
const medidas = [];
const medida = (nome, valor, conhecido_positivo, evidencia) => medidas.push({ nome, valor, conhecido_positivo, evidencia });
medida('blocos_fora_da_primeira', unicos.contas.blocos_fora, unicos.contas.blocos_na_primeira === 10, 'Dez blocos lidos nas duas primeiras páginas; a planta copia um para Emprego.');
medida('titulos_de_bloco_fora_da_primeira', unicos.contas.titulos_fora, plantas.find((p) => p.nome.startsWith('título copiado')).mordeu, 'Título copiado sem atributos também recusado.');
medida('primeiras_frases_fora_da_primeira', unicos.contas.frases_fora, plantas.filter((p) => p.nome.startsWith('primeira frase sem marcas')).length === 2 && plantas.filter((p) => p.nome.startsWith('primeira frase sem marcas')).every((p) => p.mordeu), 'A frase copiada sem marcas atravessa o filtro do texto cru e é recusada nas duas línguas.');
medida('portas_finais_dos_blocos', unicos.contas.portas_dos_blocos, html('/').querySelector('[data-porta-assunto]')?.getAttribute('href') === '/precos/', 'A primeira porta abre Preços; as dez são comparadas à declaração.');
medida('cartoes_por_edicao', entradas.contas.cartoes_nas_entradas / 2, html('/precos/').querySelectorAll('[data-cartao-medida]').length === 6, 'Os seis cartões atuais de Preços são lidos, incluindo o IHPC.');
medida('repeticoes_de_cartoes_nacionais', entradas.erros.filter((e) => e.startsWith('N1C')).length + unicos.contas.cartoes_fora_dos_assuntos, plantas.find((p) => p.nome.startsWith('cartão inteiro repetido')).mordeu, 'A planta repete uma pensão em Emprego; áreas de governo são a exceção expressa do mandato.');
medida('portas_em_cada_indice', { primeira: entradas.contas.entradas_na_primeira / 2, temas: entradas.contas.entradas_no_indice / 2 }, html('/temas/').querySelector('[data-entrada="lugares"]') !== null, 'Lugares é visto como oitava porta; nomes, âmbito, ordem e secções são comparados.');
medida('cartoes_inteiros_nos_temas', entradas.contas.cartoes_dos_temas, plantas.find((p) => p.nome === 'cartão inteiro nos temas').mordeu, 'A cópia de um cartão para Temas é recusada.');
medida('redirecionamentos', entradas.contas.redirecionamentos, plantas.find((p) => p.nome.startsWith('redirecionamento inglês')).mordeu, 'Treze regras 301, origem com e sem barra, destino existente e antes de filesystem.');
medida('portas_no_mapa_do_sitio', entradas.contas.entradas_no_mapa_do_sitio, plantas.find((p) => p.nome === 'porta omitida do mapa do sítio').mordeu, 'Dezasseis portas nas duas edições; a primeira página é controlo independente.');
medida('ligacoes_internas_antigas', unicos.contas.ligacoes_antigas, plantas.filter((p) => p.nome.startsWith('ligação antiga')).length === 4 && plantas.filter((p) => p.nome.startsWith('ligação antiga')).every((p) => p.mordeu), 'Ligações antigas relativas e absolutas plantadas nas duas edições provam o mesmo detetor que varre as páginas.');
const antes = json(`${pasta}/comparacoes-antes.json`);
const transferencias = antes.paginas.flatMap((p) => p.formas.map((f) => {
  const root = html(p.lang === 'pt' ? '/lugares/' : '/en/places/');
  const n = root.querySelector(`[data-forma="${f.forma}"][data-instrumento="${f.instrumento}"]`);
  const depois = n ? sha(n.outerHTML) : null;
  const linhasDepois = n?.querySelectorAll('[data-claim]').map((c) => ({ id: c.getAttribute('data-claim'), valor: c.textContent })) ?? [];
  const valoresIguais = JSON.stringify(linhasDepois) === JSON.stringify(f.linhas);
  return { lang: p.lang, forma: f.forma, instrumento: f.instrumento, antes: f.sha256, depois, igual: depois === f.sha256, linhas: f.linhas.length, valores_iguais: valoresIguais, alteracao_n1c: f.forma === 'barra-concelho-pais' ? 'Barra isolada retirada pelo mandato N1c.' : 'Cabeçalho da tabela e legenda com a unidade das linhas.' };
}));
medida('formas_municipais_preservadas', transferencias, transferencias.length === 6 && antes.paginas[0].formas[0].linhas.length > 300, 'O resumo do HTML regista as alterações autorizadas das legendas e dos cabeçalhos; as linhas dos dois mapas são comparadas ao estado anterior. A barra isolada saiu pelo mandato N1c.');
medida('tabelas_municipais', concelhos.contas, concelhos.contas.linhas === 1232 && plantas.find((p) => p.nome === 'linha retirada da tabela').mordeu, 'Duas tabelas de 308 linhas por edição; o valor trocado também é recusado.');
const desemprego = ['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-2025'].map((id) => {
  const c = load(fs.readFileSync(`ledger/claims/${id}.yml`, 'utf8'));
  const esperado = c.excerpt.match(/2025: (\d+\.\d+)$/)?.[1].replace('.', ',');
  return { id, valor: c.value, excerto_decimal: esperado, igual_ao_excerto: c.value === esperado, historia: c.corrections };
});
medida('desemprego_com_a_casa_decimal', desemprego, desemprego.length === 2 && desemprego.every((r) => r.excerto_decimal === '6,0'), 'Os dois excertos publicam a casa decimal; cada valor é comparado ao seu próprio excerto.');
const primeiras = ['pt', 'en'].map((lang) => {
  const bloco = html(lang === 'pt' ? '/' : '/en/').querySelector('[data-bloco="trabalho"]');
  const lados = ['taxa-de-desemprego-mip-2025', 'taxa-de-desemprego-mip-2025-ue'].map((id) => {
    const valores = bloco.querySelectorAll(`[data-claim="${id}"]`);
    return { id, valores: valores.map((n) => n.textContent.trim()), percentagens: valores.every((n) => n.parentNode.textContent.includes('%')) };
  });
  return { lang, lados, cumpre: lados.every((l) => l.valores.length === 2 && l.valores.every((v) => v === '6,0') && l.percentagens) };
});
medida('desemprego_na_primeira_pagina', primeiras, primeiras.every((p) => p.lados[1].valores.length === 2 && p.lados[1].valores.every((v) => v === '6,0')), 'Valor no desenho e na lista acessível, nos lados Portugal e União, nas duas edições; a União é o conhecido-positivo.');
if (n1c) {
  const cartoesDesemprego = ['pt', 'en'].map((lang) => {
    const c = html(lang === 'pt' ? '/emprego/' : '/en/employment/').querySelector('[data-cartao-medida="taxa-de-desemprego-mip-2025"]');
    return { lang, valor_principal: c.querySelector('.cartao-medida-valor [data-claim]').textContent.trim(), portugal_na_faixa: c.textContent.match(/Portugal\s*\(([^)]+)\)/)?.[1] ?? null };
  });
  medida('desemprego_no_cartao', cartoesDesemprego, cartoesDesemprego.every((c) => c.portugal_na_faixa === '6,0'), 'O achado 15 continua visível: a manchete e a faixa usam precisões diferentes também no cartão do emprego. O ponto 5 está parado.');
}
const claims = loadClaims();
const contador = claims.get('correcoes-publicadas');
const seladas = json('ledger/historias-valores.json');
const errosContador = [];
conferirHistoriaDoValor(contador, seladas[contador.id], contador.id, errosContador);
const atualizacao = contador.corrections.find((c) => c.kind === 'atualizacao' && c.old_value === '3' && c.new_value === '5');
const conta = { publicado: contador.value, calculado: contagensDoRegisto(claims).correcoes_publicadas, historia: contador.corrections, seladas: seladas[contador.id] ?? [], erros: errosContador, cumpre: contador.value === '5' && contagensDoRegisto(claims).correcoes_publicadas === 5 && !!atualizacao && errosContador.length === 0 };
medida('contador_das_correcoes_e_historia', conta, contador.check === 'correcoes_publicadas' && seladas['divida-das-familias-2025-ue'].length > 0, 'Recontagem pela função do livro e validação da história contra o registo selado; a história da dívida das famílias prova que o registo foi lido.');
const publicadas = ['pt', 'en'].map((lang) => {
  const root = html(lang === 'pt' ? '/correcoes/' : '/en/corrections/');
  const itens = desemprego.map(({ id }) => {
    const no = root.querySelector(`[data-mudou-registo] [data-correcao-entrada="${id}"]`);
    const corr = claims.get(id).corrections.find((c) => c.kind === 'correcao' && c.new_value === '6,0');
    return { id, presente: !!no, cumpre: !!no && !!corr && no.querySelector('[data-correcao-campo="old_value"]')?.textContent.trim() === '6' && no.querySelector('[data-correcao-campo="new_value"]')?.textContent.trim() === '6,0' && no.querySelector('[data-correcao-campo="reason"]')?.textContent.trim() === corr[lang === 'pt' ? 'reason' : 'reason_en'] };
  });
  return { lang, contador: root.querySelector('[data-claim="correcoes-publicadas"]')?.textContent.trim(), itens, cumpre: itens.every((i) => i.cumpre) };
});
medida('correcoes_do_desemprego_publicadas', publicadas, publicadas.every((p) => typeof p.contador === 'string' && p.contador.length > 0), 'Duas entradas por edição, com os valores e a razão próprios da língua; o contador existente prova a leitura da página.');
const irma = 'retribuicao-minima-mensal-doze-meses-2026';
medida('valor_irmao_do_salario_minimo', ['pt', 'en'].map((lang) => ({ lang, presente: html(ENTRADAS[1].rota[lang]).querySelector(`[data-valor-irmao="${irma}"] [data-claim="${irma}"]`) !== null })), fs.existsSync(`ledger/claims/${irma}.yml`), 'Valor exclusivo do domínio conservado fora de um cartão inteiro.');
const manifestoCapturas = `${pasta}/${n1c ? 'capturas-n1c' : 'capturas-n1'}.json`;
const capturas = fs.existsSync(manifestoCapturas) ? json(manifestoCapturas) : null;
const imagens = capturas?.resultados.map((r) => ({ ficheiro: r.ficheiro, confere: fs.existsSync(r.ficheiro) && sha(fs.readFileSync(r.ficheiro)) === r.sha256 })) ?? [];
medida('capturas', { total: imagens.length, resumos_conferidos: imagens.filter((r) => r.confere).length, problemas: capturas?.problemas ?? ['capturas por fazer'] }, imagens.some((r) => r.confere), 'O resumo de cada PNG é recalculado; o manifesto mede largura e transbordo.');
const documentos = ['design/observatorio/ESTRUTURA-e-vocabulario-2026-09-17.md', 'design/observatorio/MAPA-DO-REPOSITORIO-para-construtores.md'];
medida('documentos_atualizados', documentos.map((p) => ({ ficheiro: p, n1: fs.readFileSync(p, 'utf8').includes('N1') })), documentos.every((p) => fs.existsSync(p)), 'Dois documentos existentes, lidos em disco.');
const ficheiros = [...new Set([...git('diff', '--name-only', '2cbc5cc46327697469347b98a2445494027861f4').split('\n'), ...git('ls-files', '--others', '--exclude-standard').split('\n')])].filter((p) => p && fs.existsSync(p) && fs.statSync(p).isFile());
const fugas = ficheirosComDadosLocais(ficheiros);
const privacidade = plantaDaPrivacidade();
plantas.push(privacidade);
medida('ficheiros_com_caminho_ou_utilizador', fugas, privacidade.limpo && privacidade.mordeu, 'O mesmo detetor lê um ficheiro limpo, depois com um caminho fictício plantado; o ficheiro é removido no fim.');
if (n1c) {
  const acertos = conferirAcertosN1c('dist');
  unicos.erros.push(...acertos.erros);
  medida('acertos_n1c', acertos.medidas, acertos.medidas.length === 4 && plantas.filter((p) => ['salário irmão sem unidade mensal', 'atribuição fora da caixa do cartão', 'idade solta reposta', 'nome antigo na porta da União'].includes(p.nome)).every((p) => p.mordeu), 'Os textos, unidades, caixas e destinos são conferidos pela célula integrada na construção.');
  const custo = json(`${pasta}/custo.json`);
  medida('duas_amostras_de_custo', custo.amostras.map((a) => ({ passagem: a.passagem, medido_em: a.amostra.medido_em, tokens_used: a.fecho_cli.tokens_used, revisores: a.revisores })), custo.conhecido_positivo && custo.amostras.length === 2, 'Duas linhas tokens used lidas dos registos e confrontadas com amostras reais do contador; os revisores indicam as duas bases.');
  medida('valores_municipais_conservados', transferencias.filter((x) => x.forma === 'mapa-por-concelho').map((x) => ({ lang: x.lang, instrumento: x.instrumento, linhas: x.linhas, iguais: x.valores_iguais })), transferencias.filter((x) => x.forma === 'mapa-por-concelho').every((x) => x.linhas === 308) && plantas.find((p) => p.nome === 'valor municipal trocado').mordeu, 'Os 308 pares de identificador e valor de cada mapa são comparados aos guardados antes do N1.');
}
const portoes = Object.fromEntries(['build', 'verify', 'typecheck'].map((nome) => {
  const p = `${pasta}/portoes/${n1c ? 'n1c/' : n1b ? 'n1b/' : ''}${nome}`;
  return [nome, fs.existsSync(`${p}.codigo`) ? { codigo: Number(fs.readFileSync(`${p}.codigo`, 'utf8')), cabeca: fs.readFileSync(`${p}.cabeca`, 'utf8').trim() } : null];
}));
const ponto5 = desemprego.every((d) => d.igual_ao_excerto) && primeiras.every((p) => p.cumpre) && conta.cumpre && publicadas.every((p) => p.cumpre);
const resultado = { bloco: n1c ? 'N1c' : n1b ? 'N1b' : 'N1', medido_em: new Date().toISOString(), cabeca: git('rev-parse', 'HEAD'), construcao: json('dist/version.json'), medidas, plantas, portoes, ponto5_cumprido: ponto5, erros: [...unicos.erros, ...entradas.erros, ...concelhos.erros], divergencias: ponto5 ? [] : ['Ponto 5 ainda não cumprido; ver a secção N1b do relatório e a prova do requisito adicional do contador.'] };
fs.writeFileSync(`${pasta}/medidas.json`, JSON.stringify(resultado, null, 2) + '\n');
console.log(`${resultado.bloco}: ${medidas.length} medidas, ${plantas.length} plantas, ${resultado.erros.length} erros de navegação; ponto 5 cumprido: ${ponto5}.`);
process.exitCode = resultado.erros.length || fugas.length || plantas.some((p) => !p.mordeu) || medidas.some((m) => !m.conhecido_positivo) ? 1 : 0;
