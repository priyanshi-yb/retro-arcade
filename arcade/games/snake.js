// Snake. Owned by Developer A.
// TODO: build the game. Follow the team's arcade style guide.
Arcade.register({
  id: 'snake',
  title: 'Snake',
  ready: false,

  start(api) {
    const { ctx, width, height } = api;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#05d9e8';
    ctx.textAlign = 'center';
    ctx.font = 'bold 28px ui-monospace, Menlo, monospace';
    ctx.fillText('SNAKE', width / 2, height / 2 - 10);
    ctx.font = '14px ui-monospace, Menlo, monospace';
    ctx.fillText('Coming soon · Esc for menu', width / 2, height / 2 + 20);
  },

  stop() {},
});
