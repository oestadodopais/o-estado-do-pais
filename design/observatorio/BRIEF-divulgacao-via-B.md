# Brief pequeno · a divulgação pela via B em «Sobre», em `/metodo` e em todas as páginas (01.09.2026)

*Escrito a 01.09.2026 pelo lugar de direção (Claude Fable 5) para o Opus construir quando houver folga; decisão 4 do diretor de 30.08.2026 (a via B), registada em `POLITICA-DA-AUTONOMIA.md` §2. Sem travessões na prosa.*

## 1 · O que a lei pede, lido na fonte (`DILIGENCIA-LEGAL.md` §4)

O artigo 50.º, n.º 4, segundo parágrafo, do Regulamento (UE) 2024/1689 (aplicável desde 2 de agosto de 2026): quem implanta um sistema de IA que gera texto publicado para informar o público sobre matérias de interesse público divulga que o texto foi gerado ou manipulado artificialmente, salvo revisão humana ou controlo editorial com uma pessoa singular ou coletiva a deter a responsabilidade editorial. O n.º 5: a informação é dada «de forma clara e percetível, o mais tardar no momento da primeira interação ou exposição», e cumpre os requisitos de acessibilidade aplicáveis. A casa escolheu a via B (rotular tudo), por isso o rótulo tem de estar em cada página à primeira exposição, e não só em «Sobre».

## 2 · O que se constrói

1. **O texto da política em «Sobre» e em `/metodo`**, nas duas edições, tal como aprovado:
   - pt: «Escrito, conferido e atualizado por sistemas de IA sob uma política publicada; nenhum humano revê cada peça antes de sair; uma pessoa com nome detém a responsabilidade editorial, define as regras e as recusas, e responde.»
   - en: a tradução fiel, aprovada pelo diretor antes da fusão (proposta do lugar de direção: «Written, checked and updated by AI systems under a published policy; no human reviews each piece before it goes out; a named person holds editorial responsibility, sets the rules and the refusals, and answers for it.»).
   - Com ligação à política publicada (uma página `/metodo` ou uma secção dela que reproduza `POLITICA-DA-AUTONOMIA.md` §2 a §4 e §6 na voz do sítio) e o nome do responsável editorial, que já está em `/metodo`.
2. **O rótulo em todas as páginas**, à primeira exposição: uma linha no rodapé de cada página (e no cabeçalho das páginas de leitura dos estudos, que são texto longo), nas duas edições, na forma «Texto gerado por IA sob a política da casa · responsável editorial: <nome>» (en: «AI-generated text under the house policy · editorial responsibility: <name>»), com a ligação à política; sem adjetivos, sem justificação (Emenda 18: a página diz o que a coisa é). Os documentos originais dos estudos (as dezasseis rotas `documento`, nas quais nada se injeta, §1.19) levam o rótulo na página que os embrulha, não dentro do documento.
3. **Os dados estruturados**: o JSON-LD `Article` já leva `creativeWorkStatus`; acrescenta-se o que o esquema permitir para dizer a geração por IA sem inventar propriedades (o construtor confirma no vocabulário do schema.org, lido na fonte, o que existe; se não existir, nada se acrescenta e fica dito).

## 3 · As medidas de aceitação

- O rótulo rende nas 6 606 páginas construídas (o número de hoje; medido antes e depois), nas duas edições, e o portão `gate:html` ganha uma regra que fecha a construção a uma página sem ele, provada num estrago plantado.
- Cada cadeia nova entra no inventário da voz (`check:voz`) e na tabela da língua (`check:lingua`); a marca de língua certa nas duas edições.
- Contraste do rótulo a 4,5:1 no mínimo nos dois temas; o corpo não desce abaixo do mínimo da casa.
- `build`, `verify`, `typecheck` a 0; leitura do Codex com plantas antes da fusão (há prosa nova); medição cega do Sonnet se a folga o permitir, e senão fica dito.
- Nenhum número novo.

## 4 · Estimativa e modelo

Construtor Claude Opus 5, um bloco pequeno (da ordem de 150 a 250 mil símbolos pelos blocos de correções pequenas de 29.08); leitura Codex da ordem de 100 mil. A tradução inglesa e a frase do rótulo são aprovadas pelo diretor antes da fusão.
