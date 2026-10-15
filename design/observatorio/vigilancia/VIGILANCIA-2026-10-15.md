# A vigilância de 15.10.2026 (o passo 3 da sessão), pelo lugar de direção

*Achados e o que se fez com eles. Sem travessões.*

## O Parlamento e o Diário da República (o guião do motor, corrido à mão)

`python3 -m vigilancia.diario --dados ~/Instruments/_vigilancia-local/vigilancia` (os dados do pacote copiados para fora do repositório, para não sujar a árvore do motor), duas corridas (02:40 e 02:50 UTC):

- **O Diário da Assembleia da República, I Série:** publicados os n.º 007 (sessão de 30.09.2026, 901 declarações reconhecidas) e n.º 008 (sessão de 07.10.2026, 511 declarações). O DAR da sessão de 09.10.2026 (a apresentação do Orçamento, a fonte primária da afirmação do PCP na V2-a) continua por publicar.
- **O Diário da República, I Série, a 14.10.2026:** 12 atos, entre eles os Decretos do Presidente da República n.º 152 e 153/2026, as Resoluções da Assembleia da República n.º 261 e 262/2026, as Resoluções do Conselho de Ministros n.º 197, 198 e 199/2026, a Portaria n.º 456/2026/1, a Declaração de Retificação n.º 37/2026/1, duas resoluções da Assembleia Legislativa dos Açores (34 e 35/2026/A) e a Declaração n.º 15-A/2026/1. Os títulos estão no índice local `indice/2026-10-15.json`.
- **A maquinaria:** a primeira corrida recusou («designações, razões e cabeçalhos DAR excedem o limite do resumo; nenhum omitido em silêncio») sem escrever índice nem recibo, mas com `estado.json` mudado; a segunda escreveu tudo e saiu com código 1 pelas limitações e pela falha das iniciativas («teto de uma transferência cumulativa por dia atingido», porque a primeira já tinha feito a transferência do dia). Vai para o bloco de higiene (o §5 do `MANDATO-HIGIENE-2026-10-15.md`): a V1-39 fecha com estas corridas reais.

## O Orçamento do Estado para 2027, pela fonte oficial

O calendário de apreciação da Assembleia da República, `https://www.parlamento.pt/Documents/2026/outubro/calendario-OE2027.pdf` (lido a 15.10.2026 às 04 UTC; sha256 `67e01b0794fcc7a44bdae9dff14deca8f0ed1403723a30cf30e829cd67eb6d9d`; a cópia em `<scratchpad>/ar-oe2027/`, a alojar no motor pelo V2-b): a apreciação na generalidade de 9 a 28 de outubro, com o debate em plenário a 27 e 28 de outubro e as votações a 28 de outubro às 15:00; a especialidade de 29 de outubro a 24 de novembro, com as audições dos ministros a partir de 29 de outubro (o Tribunal de Contas a 29.10 às 10:30, o CFP a 5.11 às 11:00, o Ministro de Estado e das Finanças a 6.11 às 15:00, entre outras). A página da iniciativa é a Proposta de Lei n.º 110/XVII/2.ª (`/ActividadeParlamentar/Paginas/DetalheIniciativa.aspx?BID=377352`); a página da COFAP sobre o OE 2027 é `/sites/COM/XVIILeg/5COFAP/Paginas/OE2027.aspx`. A imprensa (RTP, Executive Digest, lida por WebSearch) diz o mesmo calendário e a votação final global a 24 de novembro; a fonte do sítio é o PDF da Assembleia, não a imprensa. **O que se fez:** fica para a V2-b («O que se discute»), como o primeiro item: o calendário do Orçamento com as datas lidas no documento oficial, selado no motor.

## O sítio, lido como leitor

- **A edição inglesa dos estudos** lista onze estudos, sete dos quais só existem em português: as páginas inglesas de `evolucao-de-portugal-desde-1981`, `onde-esta-a-agua`, `penalizacoes-por-reforma-antecipada-2026`, `evora-quem-governou-a-camara-2009-2025`, `agua-nao-faturada`, `alentejo-algarve` e `which-door-is-yours` mostram o título português (ou o inglês original) e nenhuma secção da leitura; e o título inglês de `avaliacao-economica-regional-de-portugal-2026` («Avaliação Económica Regional de Portugal 2026») não é o português («Portugal — Avaliação Económica Regional, Agosto de 2026»). Medido em `design/especime-v3/medicoes/me1-2026-10-15/estudos-aberturas.json`. **O que se fez:** vai para a lista de questões como Minor de conteúdo (a abertura dos estudos antigos, o B4 da estrutura, e a edição inglesa dos estudos só em português), para um bloco de conteúdo depois da V2-b.
- **O Método**: o que o financiador disse a 14.10 (explica a casa a si própria, nomeia modelos, o rótulo leva ao meio da página), medido em `medidas-mandato.json` e em construção no ME1.

## O GitHub e a segurança

- Os alertas de dependências (ligados a 14.10) abriram cinco PRs do Dependabot, todos vermelhos no portão (as corridas do Dependabot não recebem os segredos do repositório) e todos com a história antiga; o lugar de direção quis fechá-los e desligar as correções automáticas e o modo automático recusou a escrita no GitHub; ficam para o financiador (os comandos em `PASSOS-DO-PUSH.txt`). Os 27 alertas vão para o bloco de higiene (§3 do mandato).
