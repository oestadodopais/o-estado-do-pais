/** RP4-n-e: uma definição é da fonte da medida, ou de uma segunda fonte declarada com recibo. */
const ALIASES = new Map([
 ['Instituto Nacional de Estatística','INE'],
 ['Instituto de Emprego da Madeira','Instituto de Emprego da Madeira, IP-RAM (IEM)'],
]);
const publicador = x => ALIASES.get(x) ?? x;
/** @param {any} origem @param {any} linha @param {Map<string, any>} linhas @param {Set<string>} [vistos] */
export function conferirPublicador(origem, linha, linhas, vistos = new Set()) {
 if (!linha || vistos.has(linha.id)) return 'a origem tem outro publicador e não está declarada como segunda fonte com recibo';
 vistos.add(linha.id);
 if (publicador(origem.publicador) === publicador(linha.source)) return null;
 const selo=origem.selo ?? origem.alojada;
 if (selo && /^[a-f0-9]{64}$/.test(selo.sha256 ?? '') && selo.motor && selo.cliente && selo.hora
   && (linha.definition_sources ?? []).some(s=>s.publisher===origem.publicador && s.url===origem.url && s.receipt?.sha256===selo.sha256 && s.receipt?.motor===selo.motor && s.receipt?.hora===selo.hora && s.receipt?.cliente===selo.cliente)) return null;
 if ((linha.derived_from ?? []).some(id=>conferirPublicador(origem,linhas.get(id),linhas,new Set(vistos))===null)) return null;
 return 'a origem tem outro publicador e não está declarada como segunda fonte com recibo';
}
