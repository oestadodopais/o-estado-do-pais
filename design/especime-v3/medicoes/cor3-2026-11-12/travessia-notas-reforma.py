"""COR3: copiar as duas notas decididas do livro do motor para as linhas manuais."""
import argparse,json,re
from pathlib import Path
import yaml
p=argparse.ArgumentParser();p.add_argument('motor',type=Path);a=p.parse_args()
book={r['id']:r for r in json.loads((a.motor/'content/11 Seguranca Social/ledger.json').read_text())['claims']}
for suffix,rid,start,end in [('sem-factor','fig81-penalizacao-legal','Redução acumulada da pensão',' O localizador'),('com-factor','fig81-legal-com-fs-1a','A regra está escrita',' Aritmética conferida')]:
 path=Path('ledger/claims')/f'penalizacao-antecipacao-um-ano-{suffix}-2026.yml';text=path.read_text();row=yaml.safe_load(text);note=book[rid]['note'];part=note[note.index(start):]
 old=row['note'];i=old.index(start);j=old.index(end);new=old[:i]+part+old[j:]
 result=re.sub(r'^note: .*$',lambda _: 'note: '+json.dumps(new,ensure_ascii=False),text,flags=re.M)
 expected=dict(row,note=new);assert yaml.safe_load(result)==expected
 path.write_text(result)
 print(path.name,': nota copiada do motor; restantes campos conservados')
