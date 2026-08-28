# front-tenteador

Versão **web** do [app-tenteador](https://github.com/glener10/app-tenteador) — app de pontuação de **Truco Gaudério**. Mesma lógica e conteúdo, adaptada para o navegador (Vite + React 19 + TypeScript, empacotado com Bun, SPA no Cloudflare Pages).

## Commands

```bash
bun install
bun run dev          # vite dev server, http://localhost:5173
bun run typecheck    # tsc --noEmit
bun run build        # vite build → dist/
bun run deploy       # build + wrangler pages deploy dist --project-name=front-tenteador
```

## Stack / estrutura

Espelha o `front-admin` e a árvore de `src/` do app original para facilitar sync:

- `src/screens/` — `HomeScreen`, `ScoreScreen` (lógica de pontos truco/envido/flor)
- `src/components/` — Header, modals (Histórico, Nome, Regras, Doação), Confetti
- `src/services/matchHistory.ts` — mesma lógica do app, com `localStorage` no lugar de `AsyncStorage`
- `src/theme.tsx` — tema claro/escuro (preto + dourado) via `data-theme` + CSS vars, persistido em `localStorage["t-theme"]`

Sem lint nem testes configurados; o gate é `typecheck` + `build`.
