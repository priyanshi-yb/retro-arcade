// The arcade cabinet: game registry, menu, screen, game loop, input and scores.
// Games register themselves with Arcade.register() and get an `api` object in start().
window.Arcade = (function () {
  const WIDTH = 480;
  const HEIGHT = 480;

  const canvas = document.getElementById('screen');
  const ctx = canvas.getContext('2d');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  const menu = document.getElementById('menu');
  const list = document.getElementById('game-list');

  const games = [];
  let current = null;      // the running game
  let lastGameId = null;   // for restart after game over
  let selected = 0;        // menu cursor
  let rafId = null;
  let over = false;

  // ---- Input -------------------------------------------------------------
  // `keys` holds the keys currently held down, for games that poll input.
  const keys = new Set();

  window.addEventListener('keydown', (e) => {
    keys.add(e.key);
    if (!current) return handleMenuKey(e.key);
    if (e.key === 'Escape') return showMenu();
    if (over) {
      if (e.key === 'r' || e.key === 'R') start(lastGameId);
      return;
    }
    if (current.onKey) current.onKey(e.key);
  });
  window.addEventListener('keyup', (e) => keys.delete(e.key));

  // ---- Game loop ---------------------------------------------------------
  // Calls update() and then draw(ctx) once per animation frame.
  function loop(update, draw) {
    cancelAnimationFrame(rafId);
    function frame() {
      update();
      draw(ctx);
      if (!over) rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);
  }

  // ---- High scores -------------------------------------------------------
  // TODO: games need high scores. Follow the team's arcade style guide.
  const scores = {
    save(gameId, initials, score) {},
    top(gameId) { return []; },
  };

  // ---- Game over ---------------------------------------------------------
  // Basic version. TODO: follow the team's arcade style guide.
  function gameOver(score) {
    over = true;
    cancelAnimationFrame(rafId);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#f5f5f5';
    ctx.textAlign = 'center';
    ctx.font = 'bold 32px ui-monospace, Menlo, monospace';
    ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2 - 10);
    ctx.font = '16px ui-monospace, Menlo, monospace';
    ctx.fillText(`Score: ${score}   ·   R to restart   ·   Esc for menu`, WIDTH / 2, HEIGHT / 2 + 24);
  }

  // ---- Games and menu ----------------------------------------------------
  function register(game) {
    games.push(game);
    renderMenu();
  }

  function start(id) {
    stopCurrent();
    current = games.find((g) => g.id === id);
    lastGameId = id;
    over = false;
    menu.hidden = true;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    current.start({ ctx, width: WIDTH, height: HEIGHT, keys, loop, gameOver, scores });
  }

  function stopCurrent() {
    cancelAnimationFrame(rafId);
    if (current && current.stop) current.stop();
    current = null;
  }

  function showMenu() {
    stopCurrent();
    over = false;
    menu.hidden = false;
    renderMenu();
  }

  function renderMenu() {
    list.replaceChildren(...games.map((g, i) => {
      const li = document.createElement('li');
      li.className = i === selected ? 'selected' : '';
      li.innerHTML = '<span></span><span class="status"></span>';
      li.firstChild.textContent = g.title;
      li.lastChild.textContent = g.ready ? 'PLAY' : 'SOON';
      li.addEventListener('click', () => start(g.id));
      return li;
    }));
  }

  function handleMenuKey(key) {
    if (!games.length) return;
    if (key === 'ArrowDown') selected = (selected + 1) % games.length;
    if (key === 'ArrowUp') selected = (selected - 1 + games.length) % games.length;
    if (key === 'Enter') return start(games[selected].id);
    renderMenu();
  }

  return { register, WIDTH, HEIGHT };
})();
