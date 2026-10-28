# Retro Arcade

A browser arcade with several small games in plain HTML, CSS and JavaScript. No build step, no frameworks. Each game is built by a different developer, but they must all feel like one cabinet.

## Team knowledge is in Meko (datapack: retro-arcade)
- **Knowledge base**: the arcade style guide (palette, screens, controls, scoring, high scores, difficulty). It is **not** in this repo.
- **Promoted memories**: lessons and decisions teammates chose to share. They override the style guide when the two conflict.
- **Private memories**: what you (this developer) asked to remember. Only your own Claude sees them.

## Before building a feature or fixing a bug
1. `context_search` with a query about the task (for example "high score format game over screen" or "canvas blurry speed refresh rate"). Use the `knowledge_base` results.
2. `memory_search` with the same query. Check both `results` (private) and the `promoted` list (team).
3. Say briefly which style rules and team lessons you'll apply. Never invent colors, sizes, keys or score rules the guide defines.

## Saving memories: private first, team only when asked
- **"Remember this" / "save this"** → `memory_add` only. It stays **private**. Don't promote it.
- **"Make this team knowledge" / "share with the team" / "promote it"** → find the memory id with `memory_search`, then `memory_promote`. If it isn't saved yet, `memory_add` it first.
- **Personal preferences** (how the developer likes explanations, code style they personally prefer) are never promoted, even if asked to share "everything".
- Write each memory as one specific sentence with the concrete fix, for example "Canvas: scale the backing store by devicePixelRatio and call ctx.scale(dpr, dpr), or it renders blurry on Retina screens".
- Promoting is one-way and can't be edited through Meko tools afterwards. Before promoting, show the user the exact text.

## Code layout
| File | Owner | What it does |
|---|---|---|
| `src/arcade.js` | shared | Cabinet: menu, canvas, game loop, input, `scores`, `gameOver` |
| `games/snake.js` | Developer A | Snake |
| `games/breakout.js` | Developer B | Breakout |

A game registers with `Arcade.register({ id, title, ready, start(api), stop(), onKey(key) })`. `start` receives
`api = { ctx, width, height, keys, loop(update, draw), gameOver(score), scores }`. Set `ready: true` when the game is playable.

Keep changes inside your own game file. If a fix belongs in `src/arcade.js`, make it there and keep it small.

## Run
Open `index.html` in a browser. Reload after each change.
