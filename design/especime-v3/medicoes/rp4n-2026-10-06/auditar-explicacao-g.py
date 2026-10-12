"""Troca só os apoios que a derivação antiga dos ministérios deixou de provar."""
from pathlib import Path
import json
p=Path('tests/cartao/leituras-provadas.json');j=json.loads(p.read_text())
a=next(x for x in j['explicacoes'] if x['slug']=='dinheiro-do-estado-2026')
f=next(x for x in a['folhas'] if x['caminho']=='seccoes[1].conteudo[2].paragrafo[0]')
o={'origem':'rp4n-mapa-ministerios','campo':'excerto','literal':'Mapa relativo à classificação orgânica das despesas do subsetor da Administração Central'}
f['partes'][0]['apoios']=[o,{'origem':'dados-gov-oe-despesa-funcional','campo':'excerto','literal':'Esta classificação especifica os fins e atividades típicos do Estado'}]
parte=next(x for x in f['partes'] if x['pt']=='a conta por ministério é o orçamento de cada ministério')
parte['apoios']=[o,{'linha':'oe-2026-despesa-ministerio-financas','campo':'document.locator','literal':'POR MINISTÉRIOS'}]
a['origens']=sorted(set(a['origens'])|{o['origem']})
a['emenda_rp4ng']={'quem':'Codex gpt-6-astra','quando':'2026-10-12','o_que':'Os apoios da comparação entre a classificação funcional e a orgânica passam às palavras das fontes. O texto da explicação não mudou. A leitura cruzada desta emenda fica pendente.'}
p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n')
