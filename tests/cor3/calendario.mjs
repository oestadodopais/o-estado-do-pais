import assert from 'node:assert/strict';import {dataDeCalendarioConferida} from '../../src/lib/historia-do-valor.mjs';
const row={unit:'data',value:'18 a 20 de novembro',reference_date:'2026-11-20',excerpt:'Debate: 18 a 20 de novembro.'};assert(dataDeCalendarioConferida(row));
for(const muda of [{reference_date:'2026-11-23'},{value:'21 a 20 de novembro'},{value:'0 a 20 de novembro'},{reference_date:'2026-11-31'},{excerpt:'Data ausente'}])assert(!dataDeCalendarioConferida({...row,...muda}));
assert(dataDeCalendarioConferida({...row,value:'20 de novembro'}));console.log('COR3 calendário: data simples e intervalo válidos; referência, ordem, dia e excerto adulterados recusados.');
