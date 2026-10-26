# OG1: ficha de factos da pesquisa

Gerada por `python3 -m publisher.oe2027_generalidade_report --site <worktree>`.

Cabeça do motor: `74bbcedfa29438065faa87de0fda2dc7490ba93f`.

Entrega: `content/30 Orcamento 2027 Generalidade/LEIA-ME.md`. Sem exportação de conteúdo para o sítio.

| Medida | Contagem |
| --- | --- |
| linhas | 88 |
| numericas | 54 |
| textuais | 34 |
| pedidos | 36 |
| corpos_http_200 | 33 |
| pedidos_sem_sucesso | 3 |
| reutilizados | 6 |
| anfitrioes | 20 |
| ausencias | 9 |
| gemeos | 28 |
| derivadas | 0 |

Estado medido: `{"ensaio": "verde", "ensaio_checks": 78, "core_gate": "verde", "leitura_a_frio": "pendente; I237", "core_gate_codigo": 0, "core_gate_execucoes": 1, "corridas_de_conferencias": 2, "chamadas_ate_registo": 64, "core_gate_log_sha256": "9fe539699860cdb38a88f7370b11394c04eb86392f96ba704f4ae7e8a6c78cfe", "registos": "Registos de ensaio e core.gate em <temporario>; as contagens finais de chamadas constam da resposta e do lançador."}`.

Leitura a frio com os corpos pendente, conforme I237. A linha `oe-2027-calendario-generalidade` é citada, sem duplicação. O bloco CR2 trata a atualização do painel.

Ausências:
- chega-voto: Sentido de voto não estabelecido nesta pesquisa. As duas páginas do partido devolveram HTTP 403. Não se afirma que o partido não tenha anunciado voto noutro lugar.
- pcp-voto: O comunicado e a intervenção documentam oposição política, mas não contêm anúncio explícito de voto contra.
- il-voto: O extrato acessível da entrevista descreve prioridades fiscais; o restante corpo exige assinatura. Sentido de voto não estabelecido.
- be-documento: A página inicial e a pesquisa de esquerda.net não forneceram o anúncio de voto. A posição está selada pela notícia de Lusa no DN.
- governo-intervencao: Não foi localizado um texto oficial da intervenção de 23 de outubro na página de notícias do Governo consultada.
- audicao-registo: Vídeo ou Diário da audição de 23 de outubro não alojados. O índice oficial de reuniões da COFAP identifica a reunião n.º 122, no Plenário, em 23 de outubro, com hora 10:09 e ligação à ordem de trabalhos. As afirmações continuam atribuídas às notícias.
- voto-28: Registo de votação de 28 de outubro ainda futuro à data desta pesquisa.
- debate-dar: Afirmações do debate de 27 e 28 de outubro pelo Diário da Assembleia da República ainda futuras.
- hora-votacao: Hora própria da votação não indicada na ordem do dia alojada. Não se usa a hora de início da reunião como hora da votação.

Correções ao mandato: CSI na Tabela 9 da POE/2027, com referência de agosto na Tabela 8; 0,6% é limiar da regra da despesa líquida; o PDF da iniciativa inclui sumário executivo.

Não houve corrida dos portões do sítio nem capturas. Os registos de ensaio e do core.gate ficam no diretório temporário da passagem. O custo é escrito pelo lançador.

## Fecho depois do commit do motor

O estado medido acima foi gravado antes do commit. O commit do motor foi aceite pelo escrivão, com código 0. O hook voltou a executar `core.gate` e terminou com `GATE: PASS`: houve duas execuções de `core.gate` no total, uma explícita no fim da pesquisa e outra automática no commit, além da corrida autónoma do ensaio do gerador. São três corridas de conferências, com o ensaio do gerador também integrado no portão.

O pedido de commit foi iniciado com `OEDP_GATE=adiado`, mas `comitar.sh` não transmite a variável no pedido ao escrivão. A corrida adicional decorreu desse limite do mecanismo. Não se alterou o lançador nesta pesquisa.
