# A leitura a frio da VOZ-2A (os sete estudos de Évora sem a autorreferência), 07.11.2026

*Leitor: Claude Opus 5.5 (`leitor`), 44 chamadas pelo harness, 512 s, sobre o pacote `pacote-voz2a-2026-11-07` (base ab948c410, cabeça e28270820, `dist/` de e28270820; o motor de 155a9f2 a ce0cf75). O relatório do leitor vai abaixo, condensado sem mudar um achado; por cima, a classificação do lugar de direção.*

## As plantas e a decisão do lugar de direção

| Planta | O que plantou | Achado |
|---|---|---|
| N1 | uma frase reescrita de Évora 2027 muda um facto: o Portal BASE recusou «os dois pedidos» em vez dos três | 1 (Blocking) |
| N2 | o documento inglês de Évora 2027 volta a falar de si: «What this document does not answer.» | 2 (Major) |
| N3 | a entrada portuguesa de Évora 2027 no registo diz «Estudo corrigido» em vez de «Estudo atualizado» | 3 (Major) |
| N4 | a asserção do livro do estudo 04 cita uma oração que a frase publicada não diz («nenhum dos registos») | 5 (Major) |
| N5 | a isenção da régua da voz ganha um estudo da VOZ-2A (as contas da Câmara), doze em vez de onze | 4 (Major) |

Cinco plantas em cinco.

**Os achados reais e a decisão.**
- **6 (Major, confirmado e alargado por guião):** frases reescritas numa língua e não na outra. Este lugar mediu a classe inteira com um guião de pares (os blocos de cada documento da edição anterior à da VOZ-2A, nas duas línguas) e com as páginas no ar: 20 blocos sem par em seis estudos, 2 mudanças da composição do estudo da economia fora da lista, e duas frases da página do orçamentado. A causa é deste lugar: a lista foi feita língua a língua pela régua, e a régua não apanha as mesmas formas nas duas (as formas com n, a forma inglesa do plural do verbo entrar na negativa, as contrações inglesas). Corrigido antes de aterrar pela adenda H: vinte e uma entradas novas, cinco entradas revistas, a régua alargada (medida no sítio inteiro: só apanha frases da lista), o guião dos pares na cadeia do `check:voz`.
- **7 (Minor, sem mudança):** a frase do decreto-lei perdeu «e esta página é essa divulgação». O facto de a associação publicar os cargos e os nomes fica na frase que abre a tabela («Os cargos e os nomes, tal como a página «Quem Somos» da associação os escreve»); a oração tirada dizia que essa página cumpre a obrigação legal, o que é um juízo e não o que a fonte diz.
- **8 (Major conhecido, fora deste bloco):** outras frases dos sete estudos falam do próprio documento sem uma negação («Se este documento merecer uma sequela», «A regra de agrupamento é nossa», «Os limites deste documento»). Estavam no ar antes da VOZ-2A e a VOZ-2A não as piora. Entram na fila como VOZ-3 (uma régua da autorreferência sem a condição da negação, medida no sítio inteiro), antes do «go» ao financiador.
- **9 (Major em parte):** o par inglês da V182 sem asserção, corrigido na adenda H. As fontes das afirmações não estavam no pacote; a auditoria AUD1 lê-as.
- **10 (Minor):** a `review` da `so-previsionais`, corrigida na adenda H.
- **11 (Minor):** o relatório nomeia a cabeça 50669385; a corrida inteira deste lugar foi na e28270820. Para o registo.
- **12 (Minor):** a planta da isenção só mede o tamanho; corrigida na adenda H (o conjunto exato).
- **13 (Minor):** o teto da L1 subiu 11 e não 13: entraram 13 rotas e saíram 2 duplicações do Método pela MET1 D (a adenda F, medida).
- **14 (Minor):** as citações sem as fontes no pacote; a AUD1 lê-as.

## O relatório do leitor (condensado)

**Blocking.** 1. O documento português de Évora 2027 diz que o Portal BASE recusou «dois» pedidos; a fonte, o registo, a `nova` prescrita e o inglês dizem três (`built/estudos/evora-2027-capital-europeia-da-cultura/documento/index.html:187`).

**Major.** 2. O documento inglês de Évora 2027 imprime «What this document does not answer.», que a V024 substitui (`built/en/studies/evora-2027-capital-europeia-da-cultura/document/index.html:87`). 3. O registo português marca a atualização de 07.11 de Évora 2027 «Estudo corrigido»; os dados declaram `texto_atualizado` e o inglês diz «Study updated» (`built/correcoes/index.html:3`). 4. O `diff.patch` e a régua copiada discordam da isenção: o diff lista doze estudos com as contas da Câmara (`diff.patch:93260`). 5. O diff do motor e o livro copiado do estudo 04 discordam da citação da asserção nova (`motor/diff.patch:406`). 6. As reescritas deixam as duas edições de Évora 2027 e do painel a dizer coisas diferentes: a régua não apanha «neste/nesta» nem «do not enter»; pares da V020, V032/V040, V035, V141/V149 (`studies-src/evora-2027-capital-europeia-da-cultura/pt.html:61, 165, 166`; `en.html:63, 158`). 7. A V156/V036 tira um facto da fonte, não uma autorreferência (`diff.patch:97970`). 8. Muitas frases em que os sete estudos falam de si continuam impressas; o «161 → 0» conta só o que a régua apanha. 9. O par inglês da V182 sem asserção; as afirmações sobre as fontes não se podem conferir no pacote.

**Minor.** 10. A V040 pendurada na `so-previsionais` com a `review` antiga. 11. Números do relatório sem ficheiro e outra cabeça nomeada. 12. A planta da isenção só mede o tamanho. 13. O teto da L1 subiu 11. 14. A tabela das citações sem as fontes.

**O que está bem.** As 160 entradas da lista no estado prescrito nas fontes; as reescritas de Évora 2027 lidas contra as antigas dizem o mesmo facto; as treze edições guardadas iguais byte a byte às atuais de antes; as linhas das edições; sete entradas `texto_atualizado` e 46 correções nas duas línguas; os livros do motor sem nenhuma linha mudada; a isenção copiada exata; as 53 exceções exatamente os pares FICA; as contagens reproduzidas; a corrida inteira de e28270820 a zero.
