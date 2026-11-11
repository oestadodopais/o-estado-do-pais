/** EVA-T: a mesma medida total em dois relatórios anuais distintos.
 * A comparação fica presa ao par, às fontes e aos excertos da linha Total.
 * @param {any} atual @param {any} anterior
 */
export function execucaoTotalEvora(atual, anterior) {
  if (atual?.id !== 'evora-execucao-da-receita-2025' || anterior?.id !== 'evora-execucao-da-receita-2021') return false;
  const fontes = [
    [atual, '2025', 'Prestação de Contas 2025', 111, 'https://www.cm-evora.pt/wp-content/uploads/2026/05/PRESTACAO_CONTAS_2025.pdf'],
    [anterior, '2021', 'RELATÓRIO DE GESTÃO 2021', 60, 'https://www.cm-evora.pt/wp-content/uploads/2022/05/2_Relatorio_Gestao_2021.pdf'],
  ];
  return anterior.document?.source_sha256 === 'be0c8f8228552a27e48de3cbd2ea3a994d9020d1f2385ef6103f69afd282964a' && fontes.every(([c, ano, titulo, pagina, endereco]) =>
    c.source === 'Município de Évora' && c.unit === '% do orçamento' && !c.derivation &&
    c.reference_date === ano && c.document?.edition === ano && c.document?.title === titulo &&
    c.document?.page === pagina && c.source_url === `${endereco}#page=${pagina}` &&
    /^Total\s/.test(c.excerpt ?? '') && /^\d+,\d+$/.test(c.value ?? '') &&
    c.excerpt.split('%')[0].trim().endsWith(' '+c.value));
}
