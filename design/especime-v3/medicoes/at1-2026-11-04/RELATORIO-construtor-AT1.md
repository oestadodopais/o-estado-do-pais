Parei pela condição do §3: falta documentação para empacotar a função existente na Build Output API v3.

O sítio tem **uma função**, `api/sugestoes.js`, com entradas `GET` e `POST` e importações de dois módulos locais. A documentação disponível confirma o envio e a promoção, mas não estabelece como preparar esta função: configuração `.vc-config.json`, ponto de entrada, adaptação dos pedidos e inclusão das dependências. Copiar apenas `dist/` deixaria a caixa de sugestões sem funcionar.

O lugar de direção precisa de confirmar esse formato, incluindo a preservação da região `dub1` e das variáveis de ambiente. Não concluí que a função dependa obrigatoriamente de uma construção pela Vercel.

Li o recibo `ev3-aterragem-2026-11-03-b`:

- Retoma concluída com código **0**, em **46 min 30 s**.
- Entre o fim do envio de `main` e a Vercel pronta: **38 min 54 s**.
- `verify:deploy`: **9 s**, código **0**.

**Nenhum ficheiro alterado, nenhum commit ou envio.** A implementação e as provas da AT1 ficaram por fazer.

Consumo: **6 chamadas de orquestração, 12 comandos executados; 0 corridas de conferências.**