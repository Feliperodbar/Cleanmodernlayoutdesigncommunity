## Objetivo

Este arquivo dá contexto prático para agentes de codificação (Copilot / bots) trabalharem rapidamente neste repositório React + Vite + TypeScript.

## Visão geral do projeto (big picture)

- Projeto: SPA React usando Vite + plugin `@vitejs/plugin-react-swc` e TypeScript (`src/`).
- Estrutura principal: `src/App.tsx` controla a navegação por estado entre `SearchPage`, `RegisterCustomerPage` e `CustomerServiceLayout`.
- UI: componentes reutilizáveis em `src/components/ui/*` (botões, inputs, cards etc.) usando Radix UI, `class-variance-authority` e utilitário `cn` (`src/components/ui/utils.ts`).
- Dados: mock + persistência local em `src/data/*` — `customers.ts` (dados estáticos e funções de busca) e `db.ts` (persistência em localStorage).

## Comandos essenciais

- Instalar dependências: `npm i`
- Desenvolvimento: `npm run dev` (Vite; servidor roda na porta 3000 por `vite.config.ts`)
- Build de produção: `npm run build` (saida em `build/`)

## Convenções e padrões específicos do repositório

- Imports com sufixo de versão: vários componentes importam pacotes com um sufixo de versão no nome do import (ex: `import { Slot } from "@radix-ui/react-slot@1.1.2"`).
  - O `vite.config.ts` contém aliases que mapearam essas importações (ex.: `'@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot'`).
  - Ao editar ou adicionar imports, preserve esse padrão ou atualize os aliases em `vite.config.ts` para evitar que o build quebre.

- Alias de caminho: `@` aponta para `src` (definido em `vite.config.ts`). Use `@/components/...` quando fizer novos imports se preferir.

- Estilo de componentes: preferir criar primitives em `src/components/ui` e expor variantes via `cva` (veja `button.tsx`) e usar `cn(...)` para combinar classes.

- Estado / navegação: não há roteador. A navegação é controlada por estado em `App.tsx`. Ao adicionar páginas, atualize esse arquivo ou introduza um router conscientemente.

## Integrações e pontos de atenção

- Radix UI e várias bibliotecas UI são usadas extensivamente (veja `package.json` e `vite.config.ts`). Ao atualizar versões, atualize também os aliases no `vite.config.ts`.
- Persistência: `src/data/db.ts` usa `localStorage`. Testes locais simples podem ser feitos manipulando esse armazenamento.

## Exemplos rápidos (onde olhar)

- Padrão de botão: `src/components/ui/button.tsx` — uso de `cva`, `VariantProps` e `cn`.
- Persistência e busca: `src/data/customers.ts` e `src/data/db.ts` — lógica de merge entre dados estáticos e persistidos.
- Entrada do app: `src/main.tsx`, ponto de boot e inclusão de `index.css` e `styles/globals.css`.

## Regras práticas para agentes

1. Preservar imports com sufixo de versão ou, se alterados, sincronizar `vite.config.ts` aliases.
2. Manter padrões de UI: componentes pequenos e reutilizáveis em `src/components/ui` usando `cva` + `cn`.
3. Evitar introduzir roteador sem consenso — a navegação atual é intencionalmente simples (estado em `App.tsx`).
4. Para alterações de dados, respeitar `db.ts` (localStorage) e as formas de `Customer` em `src/data/customers.ts`.

## Caso precise alterar build/dev

- Se alterar aliases ou dependências, execute `npm i` e `npm run dev` para validar localmente. O build alvo é ESNext e a saída fica em `build/`.

Se algo não estiver claro ou você quiser que eu inclua snippets ou regras adicionais (por exemplo guidelines de commit, testes ou fluxo CI), diga o que prefere e eu atualizo.
