# COR3: onde o bloco parou a 13.11.2026, e o que falta para aterrar

*Escrito pelo lugar de direção (Claude Fable 5.2) às 12:30 UTC de 13.11.2026. O bloco não aterrou: os três estudos estão no ar com o texto de antes das correções. Nada do que aqui está chegou a `main`.*

## O que está feito e conferido

- As 41 correções das três folhas decididas estão instaladas no motor e atravessadas para o sítio; a prova de igualdade dá todos os trechos conformes dos dois lados.
- O portão inteiro do motor passou numa árvore limpa na cabeça `5760676` (13.11.2026, 10:19 a 10:40 UTC).
- O `build` inteiro do sítio deu código 0 na cabeça `952e3807e`.
- A lista inteira do `verify` correu nessa cabeça (11:34 a 12:23 UTC): 71 passos, 68 a zero, três vermelhos (abaixo).
- A leitura a frio (Claude Opus 5.5, `xhigh`, cinco plantas em cinco) confirmou as frases corrigidas nas páginas construídas e os números revistos contra os corpos das fontes; achou um Major verdadeiro (abaixo) e sete Minor.

## O que falta, pela ordem

1. **O Major da leitura a frio.** As linhas do rácio preço-rendimento em índice de ano base (as sete novas com 2025 igual a cem, e as quatro antigas com 2015 igual a cem) citam no recibo a descrição inteira do conjunto do Eurostat, cuja frase sobre o valor cem só vale para a unidade relativa à média de longo prazo. Passam a citar só a parte da mesma descrição que diz como se mede o rendimento. Este lugar tem o guião escrito e por aplicar (fora do repositório).
2. **`check:incorporar`.** Em `tests/incorporar/conferir.mjs`, a planta que troca o país de uma célula de um pedido com vários países já não faz `lugarDaIncorporacao` recusar. A derivação do lugar das células relidas mudou na adenda A do sítio; é preciso saber se a guarda ficou mais fraca e repô-la.
3. **`check:eo1`.** Em `tests/eo1/documento.mjs`, a conferência de um nome novo do Orçamento passa sem linhas de prova; a guarda tem de voltar a recusar.
4. **`check:frases-reais`.** Cinco entradas não retiradas da lista VOZ-2B já não estão nas páginas declaradas, porque as correções mudaram as suas frases; saltam com a razão, e as contagens fixadas acompanham.
5. Depois: a lista inteira outra vez; uma leitura curta do diff destes quatro pontos por outra família, com cinco plantas; as capturas; os registos; o motor aterra e a seguir o sítio.

## Os Minor da leitura a frio (para o bloco de higiene)

O cartão da reforma imprime a data em algarismos e a folha decidia-a por extenso; as duas linhas do sítio relidas estão registadas de maneiras diferentes (a dos inquilinos sem a história do acesso e do excerto); o teste da marca de língua das entradas inglesas do registo ficou limitado a um caso; o teste da contagem fixa que a razão traz a data; o cartão da habitação imprime a sobrecarga de um conjunto e o estudo a de outro, e só a secção do estudo o explica; os cartões ingleses imprimem os números com a vírgula portuguesa; a página do documento da reforma não entrou nas páginas construídas da leitura.
