# B1, primeira peça: passagem de correção em verificação

Este commit acrescenta os reprodutores e a prova pedida pelo achado 18. O relatório final será reescrito pelo gerador depois dos três portões, das plantas e das vinte capturas na cabeça final. Esta versão não declara essa corrida final concluída.

Cabeça consultada para esta prova do histórico: `ae2017f73cd0b25c5b65a5cb735609b49fb1cecb`. Base do B1: `2bf8b238b912fcb89da74096281305c75f0a3b3c`.

As correções 6, 7, 9, 10, 11/15/16, 12, 13, 14, 17 e 19 estão separadas nos commits abaixo. Os achados 1, 2, 3, 5 e 8 eram plantas nas cópias; o 4 era efeito do pacote, conforme a triagem recebida.

Tabela TEMA_DO_ESTUDO copiada de `design/especime-v3/maquetas/b1/fazer.py` e comparada com WORKS:

| Estudo | fazer.py | studies.mjs | Igual |
|---|---|---|---|
| evora-2027-prometido-painel-dinheiro | cultura | cultura | sim |
| evora-prometido-pago-auditado-2026 | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| evora-quinze-anos-cinco-mandatos | governo-e-democracia | governo-e-democracia | sim |
| evora-economia-investidores-portas-abertas-2026 | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| evora-orcamentado-pago-devido-2025 | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| evora-os-pelouros-quem-os-teve-o-que-fizeram | governo-e-democracia | governo-e-democracia | sim |
| penalizacoes-por-reforma-antecipada-2026 | seguranca-social-e-pensoes | seguranca-social-e-pensoes | sim |
| onde-esta-a-agua | agua | agua | sim |
| agua-nao-faturada | agua | agua | sim |
| avaliacao-economica-regional-de-portugal-2026 | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| which-door-is-yours | investimento | investimento | sim |
| alentejo-algarve | economia-e-financas-publicas | economia-e-financas-publicas | sim |
| evolucao-de-portugal-desde-1981 | populacao | populacao | sim |


Saída de `git log --format='%h %s%n%(trailers)' 2bf8b238b912fcb89da74096281305c75f0a3b3c..HEAD`:

```text
ae2017f7 B1: limita a exclusão da L1 ao estudo e regista o teto medido
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

4b2bfe1e B1: os valores selados conservam os milhares na mesma linha
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

db054276 B1: só a transcrição fica fora das palavras proibidas
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

a7252d7e B1: a lista de títulos aprovada define a fronteira da leitura
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

96db6564 B1: a voz conta os temas distintos conferidos
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

894ec78d B1: reconta os estudos na página de cada língua e recusa ausências
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

8541b934 B1: as dez rotas antigas redirecionam no servidor com 301
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

1613032d B1: repõe a divulgação de IA no topo de cada estudo
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

0056c6a7 B1: fontes e verificação mostram apenas recibos do sítio
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

38e0c86e B1: a marca da língua acompanha a edição nas duas listas
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

3e80034a A leitura a frio da peça 1 (Claude Opus, 5 de 5 plantas apanhadas, 34 achados), filada com o bloco
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

3da02ca5 O relatório e as quarenta capturas da peça 1 do B1, tal como o construtor os deixou
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

dd33e1ef O diagnóstico do título distingue os redirecionamentos válidos
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

fadc289d A edição fixada tem uma porta de leitura e a planta da voz segue o corpo
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

779906dd A porta da edição fixada é conferida contra a nova rota do estudo
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

64fbdeda Os portões conferem a forma B1 e a voz fica presa à lista fechada
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

9bb41e7e As portas existentes abrem o estudo e a componente de edições sai
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

5dcbc538 O estudo abre no texto e a lista separa o país dos lugares
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub

fb701acc Os estudos distinguem o tema do lugar e transcrevem a abertura da água
Co-Authored-By: Codex gpt-6-astra <noreply@openai.com>
Claude-Session: https://claude.ai/code/session_01PLc5X7FKC4VzUqmHuus2Ub
```

Reprodutores: [relatório](relatar-correcao-peca1.mjs), [plantas](provar-correcao-peca1.mjs), [navegação](navegar-correcao-peca1.mjs) e [capturas](captar-peca1.mjs).
