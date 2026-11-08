# COR-AGUA, adenda D: paragem no §1.5

Nada mudou para o leitor. O motor ficou intacto e a lista foi guardada, mas não aplicada.

A planta `reference-code` da adenda B exige código 0 para:

```html
<p>A APA publicou o plano da RH8.</p><div>08</div><h2>Relatório do INE</h2>
```

A linha `reference-eight` tem valor 8 e declara DGADR. A frase e o bloco de `08` não nomeiam nenhuma entidade. A janela de 160 caracteres através dos blocos, exigida pelo §1.5, encontra APA e INE e dá código 1. A versão `cf5bd5b` também dá 1; a cabeça dá 0. A mesma procura recupera as recusas da frase anterior do INE e da legenda «Fonte: INE» pedidas nesta adenda.

A prova lê as doze plantas existentes sem as alterar e executa a variante em memória, sem editar a conferência. Só `reference-code` contraria o resultado esperado. Conservar o seu código 0 requer mudar a condição da procura ou introduzir uma distinção para este tipo de bloco numérico. Não tomei essa decisão porque o §1.5 manda parar quando um caso antigo e uma planta da adenda B não cabem juntos.

Códigos: reprodução exploratória 0; `core.attributions_test` da cabeça 0; prova reproduzível 0. O último zero confirma a reprodução do conflito, não o fecho do mandato. O build, as restantes conferências e o pacote não correram devido à paragem. Não houve alterações no motor nem commit nesse repositório.

Três corridas de conferências, sem ajudantes. A medição regista dez chamadas até à sua recolha; a resposta final dá a contagem com o commit e a verificação. Os resultados e os passos ainda por fazer estão em `medidas-adenda-d-coragua.json`.
