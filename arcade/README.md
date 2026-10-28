# Retro Arcade

A browser arcade cabinet with small games, built by a team.

## Play
Open `index.html` in a browser. Choose a game from the menu; Esc always returns to the menu.

## Games
| Game | File | Owner | Status |
|---|---|---|---|
| Snake | `games/snake.js` | Developer A | Coming soon |
| Breakout | `games/breakout.js` | Developer B | Coming soon |

The cabinet (`src/arcade.js`) provides the menu, the screen, a game loop, input, and stubs for high scores and the game over screen. Each game plugs in with `Arcade.register(...)`. See `CLAUDE.md` for the API.

The team's style guide is in the shared Meko knowledge base.
