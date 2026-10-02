/**
 * O TEMA, NUMA FONTE SÓ PARA AS PÁGINAS (bloco P4, 02.10.2026, item 00 do brief
 * `design/observatorio/BRIEF-P4-os-pequenos-do-sitio.md`; Emenda 12 de 21.08.2026, `DECISIONS.md` §1.52).
 *
 * O sítio é claro para toda a gente, com ou sem guião, em qualquer aparelho. O escuro é uma escolha do leitor, feita
 * no comando do cabeçalho (`src/components/ControloDeTema.astro`), guardada no aparelho dele na chave `tema` com a
 * cadeia `dark`, e aplicada pela raiz do documento, `data-theme="dark"`, que é o único caminho para a paleta escura
 * de `src/styles/tokens.css`.
 *
 * A GUARDA CONTRA O PISCA é o corpo do `<script>` bloqueante que `Base.astro` põe no `<head>`: lê a chave antes da
 * primeira pintura e, só quando ela diz `dark`, põe o atributo. `public/js/tema.js`, adiado, trata do clique, mostra
 * o comando e troca a cor da mobília do navegador; lê a mesma chave e compara-a com a mesma cadeia.
 *
 * A N3 do `check:pais` não importa esta cadeia: tem a sua cópia, e exige-a carácter a carácter em cada página, para
 * que uma mudança aqui não se confirme a si própria.
 */
export const CHAVE_DO_TEMA = 'tema';
export const TEMA_ESCURO = 'dark';
export const GUARDA_DO_TEMA = `(function(){try{if(localStorage.getItem('${CHAVE_DO_TEMA}')==='${TEMA_ESCURO}'){document.documentElement.setAttribute('data-theme','${TEMA_ESCURO}')}}catch(e){}})()`;
