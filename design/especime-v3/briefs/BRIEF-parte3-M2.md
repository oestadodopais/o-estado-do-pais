# BRIEF · Parte 3, M2 · a medição cega das oito páginas de leitura

*Escrito a 24.08.2026 pelo lugar de direção (Claude Fable 5) para o medidor (Claude Sonnet). Corre depois da P4, sobre uma cópia congelada da construção do ramo `parte3-2026-08-24`. Sem travessões na prosa deste ficheiro.*

## 0 · O que é

A mesma medição da M1 (`BRIEF-parte3-M1.md`, que lês inteiro e segues), agora sobre **as oito** edições com registo, mais três medições novas. Código teu, do zero, ou o teu programa da M1 alargado (se foste tu quem o escreveu; se não, escreve o teu). Nada do sítio se importa. As regras da M1 valem todas: relatas discordâncias com os dois textos e a coordenada, incluindo as tuas falsas alarmes com a causa; nada é «ok» sem o número ao lado.

## 1 · As oito edições

| slug | lang | página |
|---|---|---|
| `avaliacao-economica-regional-de-portugal-2026` | pt | `estudos/<slug>/texto/index.html` |
| `evora-prometido-pago-auditado-2026` | pt, en | `estudos/<slug>/texto/` e `en/studies/<slug>/text/` |
| `evora-economia-investidores-portas-abertas-2026` | pt | |
| `evora-orcamentado-pago-devido-2025` | pt, en | |
| `evora-quinze-anos-cinco-mandatos` | pt | |
| `evora-os-pelouros-quem-os-teve-o-que-fizeram` | pt | |

As doze medições da M1, por edição, com a tabela por edição e a soma das oito.

## 1b · Uma regra mudou depois da M1, e a medição 6 segue-a

Uma figura **sem** linha do sítio que está **dentro de uma ligação do próprio documento** já não fica sem porta própria: leva, **imediatamente depois da ligação**, uma âncora `<a class="texto-figura-porta-apos" href="#linha-<row>">` sem texto (o glifo é da folha), uma por figura sem linha do sítio que a ligação contém, pela ordem das figuras. Uma figura **com** linha do sítio dentro de uma ligação leva o selo depois da ligação, como antes. Na medição 6, «figura sem linha com porta» passa a exigir uma destas duas formas: a própria figura é a âncora (fora de ligações), ou a âncora vem a seguir à ligação que a contém; a forma antiga (só a entrada em «As linhas deste documento») conta como **sem porta** e é discordância.

## 2 · As três medições novas

13. **A prova do sítio:** `dist/prova.json` (na cópia congelada) tem as oito chaves `registos_*`; compara cada uma com a tua própria soma sobre as oito edições: `registos_edicoes` (páginas de leitura que existem), `registos_blocos` (blocos), `registos_algarismos` (figuras), `registos_resolvidos` (figuras com `row` não vazia e com selo ou porta ou entrada), `registos_por_resolver` (as outras; tem de ser 0), `registos_com_linha_do_sitio` (figuras com selo certo), `registos_com_resumo_de_origem` (figuras cujo `source_sha256` tem 64 hexadecimais), `registos_sem_resumo_de_origem` (as outras, com motivo).
14. **`dist/cadeia.json`:** os totais por edição desse ficheiro contra os teus.
15. **As ligações do documento:** para cada `links[]` do registo (39 no âmbito: 7 no 03 pt, 16 em cada edição do 04, 0 nas outras; o brief dizia 46, que é a conta do motor sobre os doze registos, e a M2 apanhou-o), a página tem um `<a href="…">` com esse endereço exato e a etiqueta `text[start:end]`; no 03 pt, as etiquetas que são o próprio URL (até 283 caracteres) estão inteiras no texto rendido.

## 3 · O relatório

`design/especime-v3/medicoes/parte3-M2-sonnet.md` e o programa ao lado (`parte3-M2-sonnet.mjs` ou `.py`), na forma da M1: a tabela das quinze medições por edição, a soma, as discordâncias com coordenada e textos, as falsas alarmes com a causa, o custo em símbolos. Não corriges nada; não commitas; não tocas em nada fora de `medicoes/`.
