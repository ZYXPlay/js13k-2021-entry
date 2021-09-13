import { Scene, Text, keyPressed, emit } from 'kontra';

export default (props) => {
  const startText = Text({
    x: 20,
    y: 200,
    text: 'Press Enter to start game',
    font: '18px monospace',
    color: 'white',
  });

  const instructionsText = Text({
    x: 20,
    y: 100,
    text: 'Use arrow keys to move Barry\'s ship and space to shoot.\nGame by Marco Fernandes',
    font: '18px monospace',
    color: 'white',
  });

  const titleText = Text({
    x: 20,
    y: 20,
    text: 'Barry In Space',
    font: '32px monospace',
    color: 'yellow',
  });

  const scene = Scene({...props,
    id: 'menu',
    children: [
      titleText,
      instructionsText,
      startText
    ],

    update(dt) {
      this.children = this.children.filter(obj => obj.isAlive());
      keyPressed('enter') && emit('startgame');
    },
  });

  return scene;
}