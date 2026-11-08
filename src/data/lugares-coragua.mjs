/** COR-AGUA: âmbito das fontes; as linhas históricas medem a edição arquivada do próprio sítio. */
const continente={pt:'Portugal continental',en:'Mainland Portugal'};
const alqueva={pt:'Alqueva',en:'Alqueva'};
const comparacao={pt:'Portugal continental / Alqueva',en:'Mainland Portugal / Alqueva'};
const arquivo={pt:'O Estado do País',en:'O Estado do País'};
export const LUGARES_CORAGUA={
 // ERSAR: abastecimento público de água em Portugal continental, Figura dos encargos domésticos.
 'coragua-ersar-encargo-mensal-2024':continente,
 'coragua-ersar-encargo-metro-cubico-2024':continente,
 // Edital do Empreendimento de Fins Múltiplos de Alqueva, Anexo II.
 'coragua-alqueva-alta-pressao-2026':alqueva,
 'coragua-alqueva-baixa-pressao-2026':alqueva,
 // Anuário da DGADR, aproveitamentos hidroagrícolas; inquérito Gulbenkian, universo na página citada.
 'coragua-dgadr-eficiencia-2024':continente,
 'coragua-gulbenkian-sem-contador':continente,
 'coragua-gulbenkian-universo-hectares':continente,
 'coragua-gulbenkian-inquerito-ano':continente,
 // Auditoria ao contrato de concessão das centrais hidroelétricas, EDIA.
 'coragua-tc-auditoria-ano':alqueva,
 // Comparações entre os dois âmbitos, sem fazer da tarifa do Alqueva uma tarifa nacional.
 'coragua-racio-minimo-2026':comparacao,
 'coragua-racio-maximo-2026':comparacao,
 // São valores que o texto anterior imprimia, não observações territoriais atuais.
 'coragua-historico-racio-minimo':arquivo,
 'coragua-historico-racio-maximo':arquivo,
 'coragua-historico-eficiencia-95':arquivo,
 'coragua-historico-eficiencia-83':arquivo,
 'coragua-historico-eficiencia-85':arquivo,
 'coragua-historico-inquerito-2021':arquivo,
};
