import { Text, Scene, GameObject, Pool, Quadtree, getWorldRect, degToRad, getPointer, angleToTarget, on } from 'kontra';
import { Ship, Boss, BossModule, Bullet } from '../entities';

export default (props) => {
  const ship = new Ship();
  const boss = new Boss({x: 650});
  const bossBullets = [];
  const quadtree = Quadtree();
  const quadtreeShip = Quadtree();

  boss.addModule(new BossModule({type: 0}));
  boss.addModule(new BossModule({type: 0}));
  boss.addModule(new BossModule({type: 1}));
  boss.addModule(new BossModule({type: 1}));
  boss.addModule(new BossModule({type: 2}));
  boss.addModule(new BossModule({type: 2}));

  boss.addStatusBar();

  const livesText = Text({
    font: '18px Monospace',
    color: 'white',
    x: 20,
    y: 20,
    anchor: {x: 0, y: 0},
    text: 'LIVES:' + ship.lives,
  });

  function collides(obj1, obj2) {
    // @ifdef GAMEOBJECT_SCALE||GAMEOBJECT_ANCHOR
    // destructure results to obj1 and obj2
    [obj1, obj2] = [obj1, obj2].map(obj => getWorldRect(obj));
    // @endif

    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }

  function checkCollisions(source, targets) {
    targets.forEach(target => {
      if (target.entityType == 'bullet' && collides(target, source)) {
        console.log('hit');
        target.ttl = 0;
        source.hit && source.hit();
      }
    });
  }

  const scene = Scene({...props,
    id: 'game',
    children: [
      ship,
      boss,
      livesText,
      // bossBullets,
    ],

    update(dt) {
      this.children = this.children.filter(obj => obj.isAlive());

      livesText.text = 'LIVES:' + ship.lives;

      if (boss.isAlive()) {
        quadtree.clear();
        quadtree.add(boss, boss.children, ship.bullets);
        checkCollisions(boss, quadtree.get(boss));
  
        quadtree.clear();
        quadtree.add(boss.children, ship.bullets);
        boss.children.forEach(module => {
          checkCollisions(module, quadtree.get(module));
        })
      }

      quadtreeShip.clear();
      quadtreeShip.add(ship, this.children.filter(o => { return o.id == 'bullet'}));
      checkCollisions(ship, quadtreeShip.get(ship));
    },
  });

  on('fire', (x, y, rotation, max) => {
    for (let i = 0; i < max; i++) {
      let bullet = new Bullet({
        x,
        y,
        dx: Math.cos(rotation + degToRad(i * (360 / max))) * 100,
        dy: Math.sin(rotation + degToRad(i * (360 / max))) * 100,
        rotation,
        ttl: 2000,
        type: 1,
      });
      // bossBullets.push(bullet);
      scene.addChild(bullet);
    }
  });

  return scene;
}