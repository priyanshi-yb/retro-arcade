# Retro Arcade: a Meko team-memory demo

Two developers each build one game for the same arcade cabinet with Claude Code: **Developer A builds Snake** and **Developer B builds Breakout**. They share one Meko datapack.

The demo shows how knowledge moves through the team:

```
 learn something ──► PRIVATE memory ──► promote ──► SHARED with the team ──► teammate's Claude uses it
 (only my Claude)                                   (everyone's Claude)
```

| Layer | Example in this demo | Who sees it |
|---|---|---|
| **Knowledge base** | The arcade style guide: what the team **planned** | Everyone, from the start |
| **Private memory** | "Explain things with analogies"; a bug fix A hasn't shared yet | Only its owner |
| **Promoted memory** | A's canvas fixes, B's input fix: what the team **learned** | Everyone, after promotion |

**Summary for the audience:** *"The knowledge base is what we knew before we started. Promoted memories are what we learned while building. Private memories are personal to each of us."*

```
meko-retro-arcade/
├── README.md                 ← this facilitator guide (not part of the game repo)
├── kb/arcade-style-guide.md  ← upload to Meko. NOT part of the game repo
└── arcade/                   ← the git repo both developers work in
```

---

## Facilitator secret: three bugs built into the starter

The starter cabinet (`arcade/src/arcade.js`) contains three realistic bugs. Each developer will run into them while building. **Don't tell the developers in advance**: they're what makes the private-then-promote moments happen naturally.

| Bug | Where | When you'll see it | The fix Claude will find |
|---|---|---|---|
| **Blurry graphics** | Canvas size isn't scaled for Retina screens | Any MacBook: edges and text look soft | Scale the canvas by `window.devicePixelRatio`, then `ctx.scale(dpr, dpr)` |
| **Speed depends on the screen** | `loop()` calls `update()` once per frame | A ProMotion (120 Hz) MacBook runs the game twice as fast as a 60 Hz monitor | Pass the elapsed time to `update(dt)` and move by speed × time |
| **The page scrolls while playing** | Key handling doesn't call `preventDefault()` | Arrow keys and Space scroll the page, and the game jumps away | Call `preventDefault()` for game keys while a game is running |

If a developer doesn't notice a bug on their own, prompt it, for example *"the snake looks blurry on my Mac"*.

---

## Setup (facilitator, about 15 minutes)

### 1. Datapack and knowledge base
1. In the Meko Cloud console, create a datapack named **`retro-arcade`** and set up its knowledge base.
2. Upload `kb/arcade-style-guide.md` and wait until it's indexed.
3. Invite Developer B as a **maintainer**. Both developers need to be owners or maintainers to promote.

### 2. Game repo
```bash
cd arcade
git init && git add . && git commit -m "Retro Arcade starter"
gh repo create retro-arcade --private --source . --push   # or any git host
```
Don't commit `kb/` or this README.

### 3. Each developer
1. Clone the repo and open Claude Code inside it. Check that `/mcp` shows `meko` connected.
2. Pin the datapack: `switch datapack to retro-arcade`, then **start a new session**.
3. Create a branch: A runs `git checkout -b feature/snake`, B runs `git checkout -b feature/breakout`.

**Doing it alone?** Use a second Meko account and a second Claude Code profile: `CLAUDE_CONFIG_DIR=~/.claude-devB claude`.

### 4. Keep A's chat out of search until Act 3
Meko captures each Claude Code session and **teammates can search captured conversations**. Only *memories* are private, not chats. So that B doesn't find A's fixes through A's chat before A promotes them, start A's Claude Code with capture delayed:
```bash
MEKO_CHECKPOINT_INTERVAL=3600 claude    # Developer A: capture at most hourly, or on /exit
```
Act 4 explains this to the audience as a feature.

---

## Act 1: Developer A works alone (private memories)

**A1. A personal preference (stays private)**
> I'm new to game development. When you explain things, use simple analogies and keep code short with lots of comments.

**A2. Build Snake**
> Build Snake for our arcade, following our team's arcade style guide.

Point out: Claude searches Meko first and applies the knowledge base: `SCORE 000000` in cyan, pink snake head, yellow food, the blinking title screen, `P` to pause, the game-over shake with `INSERT COIN`, and a 2-second combo.

**A3. A runs into the bugs**
Play it, then:
> The snake looks blurry on my MacBook, it moves way faster on my laptop screen than on my external monitor, and the page scrolls when I press the arrow keys.

Claude fixes all three, explaining with analogies because of A1.


Claude saves three **private** memories, without promoting them. Commit, but **don't** `/exit` yet.

---

## Act 2: Developer B hits the same bugs

**B1. A personal preference (the opposite style)**
> I'm an experienced developer. Keep answers short — no explanations unless I ask.

**B2. Build Breakout**
> Build Breakout for our arcade, following our team's arcade style guide.

Point out:
- The knowledge base works: the same score format, title screen, pause, game over and colors as Snake.
- But B's Breakout has the **same three bugs**: blurry, fast on 120 Hz, and Space scrolls the page.

**This is the key moment.** Ask the audience: *"A fixed exactly this ten minutes ago. Why didn't B's Claude know?"* Because A's fixes are only in A's **private** memory.

Ask B's Claude to check:
> Has anyone on the team already solved blurry canvas or speed problems?

`memory_search` finds nothing shared, so Claude says there are no team lessons yet.

---

## Act 3: Developer A promotes

**A5.**
> The three fixes I saved — make them team knowledge. Don't share my explanation preference.

Claude shows the three memories, calls `memory_promote`, and leaves the "analogies" preference private. Then `/exit`.

Point out: in the Meko console's **Learnings** tab, the three fixes now appear for the whole datapack.

---

## Act 4: Developer B benefits

**B3.** In a **new** Claude Code session:
> Breakout looks blurry and runs too fast on my laptop, and Space scrolls the page. Check whether the team already knows how to fix this.

Point out:
- `memory_search` returns A's three fixes in the `promoted` list, and Claude applies them right away, matching A's approach.
- Claude's reply is **short**: B's own preference (B1). A's "analogies" preference never reached B.

**B4.** Ask about the captured chat:
> What has my teammate been working on?

`context_search` now returns A's **captured conversation** from Snake. Explain: *"Memories are private until promoted, but sessions in a shared datapack are visible to the team. Treat the datapack like a team room."*

---

## Act 5: It works both ways

**B5. B makes a decision and promotes it**
> Players keep hitting the ball into the same spot. New team rule: whenever anything bounces, add a random angle change of up to ±5°, so the game never gets stuck in a loop. Save it and make it team knowledge.

Claude implements it in Breakout, then saves and promotes it. `/exit`.

**A6. A benefits**, in a new session:
> Check for any new team rules and apply whatever fits Snake.

A's Claude finds B's rule. Snake has no bounce, so a good answer explains that it doesn't apply to Snake. If you add a bouncing bonus item to Snake, it will use the ±5° rule.

---

## Finale: merge and play
```bash
git checkout main
git merge feature/snake
git merge feature/breakout
```
Both games are now in one cabinet: same title screens, pause, game over shake, `INSERT COIN`, high-score tables, and both are sharp and run at the right speed.

Both branches probably fixed `src/arcade.js` in slightly different ways. If they conflict, ask Claude: *"Resolve the conflict in src/arcade.js, keeping one implementation of each team fix."*

---

## What each act shows

| Act | Point |
|---|---|
| 1 | The knowledge base guides the code; private memories help only their owner |
| 2 | Without sharing, a teammate repeats the same work and bugs |
| 3 | Promoting turns a personal lesson into team knowledge, and personal preferences stay private |
| 4 | Teammates benefit right away; captured sessions are team-visible |
| 5 | Knowledge flows both ways and builds up over time |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Claude doesn't search Meko first | Make sure `CLAUDE.md` is in the repo root, or say "check our style guide and team lessons in Meko first" |
| Knowledge base results are `null` or empty | The guide isn't indexed yet, or the datapack isn't pinned. Ask `which datapack am I on`, then start a new session |
| B already sees A's fixes in Act 2 | A's session was captured (more than 10 minutes, or A ran `/exit`). Use `MEKO_CHECKPOINT_INTERVAL=3600` for A and run Act 2 promptly |
| B doesn't see the promoted fixes in Act 4 | Start a **new** B session, and check that A's promote call succeeded |
| `memory_promote` returns 403 | That developer needs the owner or maintainer role |
| No speed difference is visible | You need a 120 Hz screen. Otherwise, describe the bug instead of showing it |
| Claude promotes the personal preference | Point it out; it's a good discussion moment. Because promotion is one-way, reset with a new datapack before the real demo |

## Resetting for another run
- Reset the repo to the starter commit and delete the feature branches.
- Create a **new datapack** and upload the style guide again. Promoted memories can't be removed through Meko tools, so a fresh datapack is the clean way to start over.
