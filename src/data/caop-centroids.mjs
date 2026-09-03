/**
 * CAOP 2025 — posições dos 308 municípios.
 *
 * PROVENIÊNCIA (ver também src/data/verbatim.mjs, colofão):
 *   Carta Administrativa Oficial de Portugal (CAOP) 2025
 *   Direção-Geral do Território (DGT) · dados.gov.pt · licença CC-BY
 *   https://geo2.dgterritorio.gov.pt/caop/
 *   Acedido a 12 de Agosto de 2026.
 *
 * Centróides ponderados pela área, calculados sobre os polígonos oficiais,
 * projectados em Web Mercator e normalizados para um referencial de 600 x 790.
 * Madeira à mesma escala do Continente; Açores a 0,38x dessa escala.
 * Nenhuma coordenada foi estimada.
 *
 * Estas coordenadas são transcritas, sem alteração, do estudo de identidade
 * aprovado (observatorio-identidade-v2.html, 12.08.2026). Formato de cada linha:
 *   [nome, índice em DISTRITOS, x, y]
 *
 * NÃO EDITAR À MÃO. Qualquer actualização vem de um novo processamento da CAOP.
 */

export const FIELD_W = 600;
export const FIELD_H = 790;

export const DISTRITOS = ["Aveiro","Beja","Braga","Bragança","Castelo Branco","Coimbra","Faro","Guarda","Ilha Terceira","Ilha da Graciosa","Ilha da Madeira","Ilha das Flores","Ilha de Porto Santo","Ilha de Santa Maria","Ilha de São Jorge","Ilha de São Miguel","Ilha do Corvo","Ilha do Faial","Ilha do Pico","Leiria","Lisboa","Portalegre","Porto","Santarém","Setúbal","Viana do Castelo","Vila Real","Viseu","Évora"];

/**
 * Cada linha é `[nome, índice do distrito, x, y]`, no campo `FIELD_W × FIELD_H`.
 *
 * @type {[string, number, number, number][]}
 */
export const MUNICIPIOS = [["Águeda",0,396.5,251],["Albergaria-a-Velha",0,386.9,236.6],["Anadia",0,392,267.8],["Arouca",0,410.3,207.6],["Aveiro",0,374.2,243.9],["Castelo de Paiva",0,405.4,196.2],["Espinho",0,374.4,199.2],["Estarreja",0,379.2,228.8],["Santa Maria da Feira",0,385.5,202.7],["Ílhavo",0,367.3,248.4],["Mealhada",0,392.1,280.3],["Murtosa",0,369.8,229.3],["Oliveira de Azeméis",0,389.5,218.6],["Oliveira do Bairro",0,381.5,259.9],["Ovar",0,375,214.2],["São João da Madeira",0,387.4,211.8],["Sever do Vouga",0,400.7,233.5],["Vagos",0,368.3,259.9],["Vale de Cambra",0,402.2,219.7],["Aljustrel",1,416.4,585.4],["Almodôvar",1,426.4,635.5],["Alvito",1,430.5,542],["Barrancos",1,525.4,553.7],["Beja",1,448.3,576.3],["Castro Verde",1,431.8,607.7],["Cuba",1,442.8,548.3],["Ferreira do Alentejo",1,416.3,561],["Mértola",1,462.6,614.7],["Moura",1,502.9,555.5],["Odemira",1,379.1,619.5],["Ourique",1,406.5,615.5],["Serpa",1,483.5,579.9],["Vidigueira",1,461.6,551.2],["Amares",2,401.3,115.2],["Barcelos",2,374.6,130],["Braga",2,394.1,129],["Cabeceiras de Basto",2,438.9,129.5],["Celorico de Basto",2,430.7,147.3],["Esposende",2,361.7,128.7],["Fafe",2,420.2,137.6],["Guimarães",2,404.2,139.7],["Póvoa de Lanhoso",2,410.2,123.4],["Terras de Bouro",2,416.1,104],["Vieira do Minho",2,424.5,117.8],["Vila Nova de Famalicão",2,386.1,146.4],["Vila Verde",2,391.9,111.5],["Vizela",2,406.1,150.9],["Alfândega da Fé",3,535.1,153.9],["Bragança",3,555.8,99.9],["Carrazeda de Ansiães",3,500.9,169.5],["Freixo de Espada à Cinta",3,546.5,184.1],["Macedo de Cavaleiros",3,539.4,129.1],["Miranda do Douro",3,592,133.3],["Mirandela",3,512.4,133.6],["Mogadouro",3,562.1,156],["Torre de Moncorvo",3,528.8,176.5],["Vila Flor",3,515.1,157.5],["Vimioso",3,575.5,125.6],["Vinhais",3,525.8,92],["Belmonte",4,498.8,283.2],["Castelo Branco",4,482.3,342.9],["Covilhã",4,476.4,292.5],["Fundão",4,484.1,309.5],["Idanha-a-Nova",4,519.6,337.2],["Oleiros",4,446.8,331.7],["Penamacor",4,517.3,302.6],["Proença-a-Nova",4,448.3,357.5],["Sertã",4,424.9,346.7],["Vila de Rei",4,420.6,364.3],["Vila Velha de Ródão",4,466.7,364.6],["Arganil",5,435.9,296],["Cantanhede",5,373.3,280.1],["Coimbra",5,391.6,297.6],["Condeixa-a-Nova",5,386.5,312.4],["Figueira da Foz",5,356.8,303.6],["Góis",5,425.9,311.9],["Lousã",5,412.5,308.2],["Mira",5,362,270.3],["Miranda do Corvo",5,403,311.6],["Montemor-o-Velho",5,371.3,297.8],["Oliveira do Hospital",5,447.5,278.4],["Pampilhosa da Serra",5,442.5,314.2],["Penacova",5,408.8,287.4],["Penela",5,399,323.5],["Soure",5,375,316.4],["Tábua",5,433,282.8],["Vila Nova de Poiares",5,410.4,297.5],["Alandroal",28,493.7,496.4],["Arraiolos",28,442.5,475.4],["Borba",28,485.4,471.8],["Estremoz",28,471.5,468.2],["Évora",28,446.9,506.6],["Montemor-o-Novo",28,406,492.4],["Mora",28,425.9,459.1],["Mourão",28,504.1,532.9],["Portel",28,463.6,534.9],["Redondo",28,473,495.2],["Reguengos de Monsaraz",28,484.6,523.4],["Vendas Novas",28,385,491.6],["Viana do Alentejo",28,422.7,524.8],["Vila Viçosa",28,496.5,477.6],["Albufeira",6,412.1,676.7],["Alcoutim",6,467.9,642.1],["Aljezur",6,357.6,657],["Castro Marim",6,480.8,657.5],["Faro",6,442.3,686.1],["Lagoa",6,391,677.6],["Lagos",6,364.6,674.5],["Loulé",6,430,665.6],["Monchique",6,377.7,654.7],["Olhão",6,452.7,685.3],["Portimão",6,378.5,669.7],["São Brás de Alportel",6,446.1,669.2],["Silves",6,401.3,660.2],["Tavira",6,460.2,665.6],["Vila do Bispo",6,349.7,682.4],["Vila Real de Santo António",6,480.6,669.4],["Aguiar da Beira",7,479.7,226.3],["Almeida",7,538.7,246.3],["Celorico da Beira",7,493.5,246.4],["Figueira de Castelo Rodrigo",7,534.3,213.2],["Fornos de Algodres",7,482.4,242.8],["Gouveia",7,474.7,261.7],["Guarda",7,506.9,259.4],["Manteigas",7,480.5,275.6],["Mêda",7,506.2,206.6],["Pinhel",7,519.9,231.3],["Sabugal",7,527.3,277.8],["Seia",7,461.4,277.3],["Trancoso",7,498.3,225],["Vila Nova de Foz Côa",7,514.1,191.8],["Alcobaça",19,339.4,380.6],["Alvaiázere",19,396.5,347.3],["Ansião",19,392.4,333],["Batalha",19,361,370.1],["Bombarral",19,323.3,414],["Caldas da Rainha",19,330,398.6],["Castanheira de Pêra",19,415.7,322.2],["Figueiró dos Vinhos",19,407.4,334.1],["Leiria",19,357.5,351.1],["Marinha Grande",19,343,351.6],["Nazaré",19,334.2,375.4],["Óbidos",19,320.3,404.1],["Pedrógão Grande",19,416.9,332.9],["Peniche",19,307.8,407.2],["Pombal",19,369.4,333.9],["Porto de Mós",19,356.1,379.9],["Alenquer",20,334.7,437],["Arruda dos Vinhos",20,329.4,452.2],["Azambuja",20,348.4,432.6],["Cadaval",20,332,420.1],["Cascais",20,300,483],["Lisboa",20,323.4,481.5],["Loures",20,323.9,466.2],["Lourinhã",20,312.6,418.6],["Mafra",20,308.8,453.9],["Oeiras",20,312,484],["Sintra",20,304.2,470.9],["Sobral de Monte Agraço",20,323.1,449.7],["Torres Vedras",20,313.5,436.2],["Vila Franca de Xira",20,340,458.7],["Amadora",20,316.5,478.7],["Odivelas",20,319.4,474],["Alter do Chão",21,460.9,422.8],["Arronches",21,507.1,434.7],["Avis",21,442.8,440.5],["Campo Maior",21,525.6,445.9],["Castelo de Vide",21,483.1,391.6],["Crato",21,468.5,410.3],["Elvas",21,508.5,460.2],["Fronteira",21,470.3,439.7],["Gavião",21,444.5,394.8],["Marvão",21,495.6,398.9],["Monforte",21,488.7,443.2],["Nisa",21,466.4,384.3],["Ponte de Sor",21,426.5,425.9],["Portalegre",21,492.1,415.8],["Sousel",21,459.5,453.9],["Amarante",22,430.4,163.8],["Baião",22,435.5,178.4],["Felgueiras",22,415.1,153.8],["Gondomar",22,388.1,184.6],["Lousada",22,408.1,162.1],["Maia",22,376.7,167.3],["Marco de Canaveses",22,419.3,178.7],["Matosinhos",22,370,171.4],["Paços de Ferreira",22,398,161.7],["Paredes",22,396.4,175.4],["Penafiel",22,406.3,179.3],["Porto",22,374.9,177.9],["Póvoa de Varzim",22,365.6,145],["Santo Tirso",22,391.8,157.6],["Valongo",22,387,172.2],["Vila do Conde",22,368.9,155.4],["Vila Nova de Gaia",22,378.7,189],["Trofa",22,380,158.8],["Abrantes",23,419.3,396.3],["Alcanena",23,368.3,390.6],["Almeirim",23,378.8,429.5],["Alpiarça",23,379.7,419.3],["Benavente",23,356.6,465.4],["Cartaxo",23,358.7,431.1],["Chamusca",23,398,415.5],["Constância",23,406.5,396.4],["Coruche",23,391.5,456.5],["Entroncamento",23,388.5,391.6],["Ferreira do Zêzere",23,404.1,359.6],["Golegã",23,385.4,401.8],["Mação",23,436.9,374.1],["Rio Maior",23,347.9,408.4],["Salvaterra de Magos",23,368.4,443.3],["Santarém",23,364.5,407.4],["Sardoal",23,421.2,379.3],["Tomar",23,397.3,374.3],["Torres Novas",23,381.6,386.5],["Vila Nova da Barquinha",23,396,389.4],["Ourém",23,379.3,363.2],["Alcácer do Sal",24,388.3,526.6],["Alcochete",24,346.6,481.7],["Almada",24,320,494],["Barreiro",24,334.2,494.9],["Grândola",24,378.7,549.1],["Moita",24,338.4,491.8],["Montijo",24,367.9,482.4],["Palmela",24,357,496.2],["Santiago do Cacém",24,379.9,577.5],["Seixal",24,328,497.8],["Sesimbra",24,327,511.3],["Setúbal",24,349.3,508.7],["Sines",24,359.8,580.9],["Arcos de Valdevez",25,399.5,82.9],["Caminha",25,358.6,90],["Melgaço",25,414,63.9],["Monção",25,393.5,66.8],["Paredes de Coura",25,379.6,81.9],["Ponte da Barca",25,404.7,95.3],["Ponte de Lima",25,378.1,101.6],["Valença",25,376.3,70.6],["Viana do Castelo",25,361.6,106.8],["Vila Nova de Cerveira",25,366.6,81],["Alijó",26,483.8,159.8],["Boticas",26,460,112.1],["Chaves",26,488.5,102.6],["Mesão Frio",26,446.8,177.6],["Mondim de Basto",26,444.5,148.9],["Montalegre",26,448.7,99.3],["Murça",26,488.1,144.6],["Peso da Régua",26,456.7,175.2],["Ribeira de Pena",26,453.9,133.5],["Sabrosa",26,473,166.4],["Santa Marta de Penaguião",26,453.4,169.5],["Valpaços",26,497.7,120.3],["Vila Pouca de Aguiar",26,470.6,133.3],["Vila Real",26,459.6,158.8],["Armamar",27,465.4,186.4],["Carregal do Sal",27,435.6,268.2],["Castro Daire",27,440.9,209.6],["Cinfães",27,424.6,194],["Lamego",27,451.5,188.2],["Mangualde",27,461.3,249.9],["Moimenta da Beira",27,469.1,203.1],["Mortágua",27,410.2,272],["Nelas",27,447.4,258.5],["Oliveira de Frades",27,411.6,236.1],["Penalva do Castelo",27,467.5,240.2],["Penedono",27,492.5,199.6],["Resende",27,440.2,188.8],["Santa Comba Dão",27,423.4,274.4],["São João da Pesqueira",27,488.4,183.4],["São Pedro do Sul",27,425.4,221.8],["Sátão",27,465.8,227.7],["Sernancelhe",27,481.8,209.9],["Tabuaço",27,476.2,186.5],["Tarouca",27,457.3,196.7],["Tondela",27,422.7,256.4],["Vila Nova de Paiva",27,457.2,214.7],["Viseu",27,443.5,238.1],["Vouzela",27,421.1,239.7],["Calheta",10,160.8,493.5],["Câmara de Lobos",10,180.5,501.2],["Funchal",10,189.7,514.4],["Machico",10,197.2,496.8],["Ponta do Sol",10,169.2,498.9],["Porto Moniz",10,164.2,488.1],["Ribeira Brava",10,175.1,500.5],["Santa Cruz",10,199.4,506.1],["Santana",10,187.4,492.2],["São Vicente",10,177.2,491.5],["Porto Santo",12,241.2,459.6],["Vila do Porto",13,250,737.1],["Lagoa",15,234.2,701.8],["Nordeste",15,245.7,698.2],["Ponta Delgada",15,227.2,698.4],["Povoação",15,244.2,700.9],["Ribeira Grande",15,237.1,699.1],["Vila Franca do Campo",15,238.4,701.9],["Angra do Heroísmo",8,172,657.3],["Praia da Vitória",8,175.4,655.5],["Santa Cruz da Graciosa",9,144.3,641.3],["Calheta de São Jorge",14,147.8,662.6],["Velas",14,139.2,658.5],["Lajes do Pico",18,136.6,670.2],["Madalena",18,127.9,667.7],["São Roque do Pico",18,133.2,667.2],["Horta",17,119.3,663.4],["Lajes das Flores",11,28,624.3],["Santa Cruz das Flores",11,28.8,621.6],["Corvo",16,31.9,610.9]];

/** Molduras que declaram a quebra de escala: [x, y, largura, altura] */
export const FRAMES = {mad:[146.8,433.6,108.5,92.9],aco:[14,584.9,250,164.3]};

/** Índices agrupados por região autónoma, derivados de DISTRITOS (não escritos à mão). */
const ILHAS_ACORES = ["Ilha Terceira","Ilha da Graciosa","Ilha das Flores","Ilha de Santa Maria","Ilha de São Jorge","Ilha de São Miguel","Ilha do Corvo","Ilha do Faial","Ilha do Pico"];
const ILHAS_MADEIRA = ["Ilha da Madeira","Ilha de Porto Santo"];

/** @param {number} indiceDistrito */
export function regiaoDe(indiceDistrito) {
  const d = DISTRITOS[indiceDistrito];
  if (ILHAS_ACORES.includes(d)) return "acores";
  if (ILHAS_MADEIRA.includes(d)) return "madeira";
  return "continente";
}

/** Contagem por região, calculada a partir das coordenadas. */
export function contagens() {
  const c = { continente: 0, acores: 0, madeira: 0 };
  for (const m of MUNICIPIOS) c[regiaoDe(m[1])]++;
  return { ...c, total: MUNICIPIOS.length };
}

export const INDICE_EVORA = MUNICIPIOS.findIndex((m) => m[0] === "Évora");

/**
 * A CARTA ESCREVE DUAS COISAS NO MESMO CAMPO, E A ETIQUETA TEM DE AS DISTINGUIR.
 *
 * ISSUES I18, fechado na subetapa 2g. O campo que a CAOP dá a cada concelho é um
 * distrito («Beja», «Viana do Castelo») ou uma ilha («Ilha do Faial», «Ilha de
 * São Miguel»), e as duas coisas não se leem da mesma maneira: «distrito de
 * Beja» é o que se diz, e «distrito de Ilha do Faial» não é português nenhum.
 *
 * A comparação é sobre a primeira palavra do campo, e não sobre uma lista de
 * nomes: a lista de ilhas deste ficheiro é derivada do mesmo campo, e conferir
 * uma lista contra a outra seria conferir a Carta contra ela própria.
 *
 * VIVE AQUI, e não em `src/lib/inicio.mjs`, desde o bloco dos 308 (P2): a
 * entrada de um concelho gerado precisa da regra para escrever a sua etiqueta, e
 * `src/data/concelhos.mjs` não pode importar de `src/lib/inicio.mjs`, que importa
 * `src/data/municipios.mjs`, que importa `src/data/concelhos.mjs`. A regra é uma
 * leitura do campo da Carta, e o sítio da leitura de um campo da Carta é o
 * ficheiro da Carta. `src/lib/inicio.mjs` reexporta-a, sem uma letra mudada.
 */
/** @param {unknown} distrito */
export const eIlha = (distrito) => /^Ilha\b/.test(String(distrito));
