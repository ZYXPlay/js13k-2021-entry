import { init, initPointer, initKeys, GameLoop, Pool, Text, on } from 'kontra';
import { initGameScene, initMenuScene } from './scenes';
import { ExplosionParticle } from './entities';

(async () => {
  const { canvas, context: ctx } = init('c');
  let gameScene = initGameScene();
  const menuScene = initMenuScene();
  const explosionPool = Pool({
    maxSize: 300,
    create: (props) => new ExplosionParticle(props),
  });
  let score = 0;
  let currentScene = menuScene;

  const scoreText = Text({
    x: 600,
    y: 20,
    text: 'SCORE:' + score,
    font: '18px Monospace',
    color: 'white',
  });

  ctx.imageSmoothingEnabled= false;

  initKeys();

  let loop = GameLoop({
    update: function(dt) {
      currentScene.update(dt);
      explosionPool.update(dt);
      scoreText.text = 'SCORE:' + score;
      scoreText.update(dt);
    },
    render: function() {
      // gameScene.render();
      currentScene.children.forEach(el => {
        el.render();
      });

      explosionPool.render();
      scoreText.render();
    }
  });

  loop.start();

  on('explode', (x, y, volume = 50, magnitude = 3) => {
    for (let i = 0; i < volume; i++) {
      explosionPool.get({x, y, magnitude});
    }
  });

  on('gameover', () => {
    currentScene = menuScene;
  });

  on('startgame', () => {
    gameScene = initGameScene();
    currentScene = gameScene;
  });

  on('score', points => {
    score += points;
  });

})();