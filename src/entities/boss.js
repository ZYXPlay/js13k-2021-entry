import { GameObject, Text, emit, Sprite  } from 'kontra';

export default class Boss extends GameObject.class {
  constructor(props) {
    super(props);
    this.anchor = {x: 0.5, y: 0.5};
    this.x = props.x || 650;
    this.y = props.y || 100;
    this.dir = props.dir || 1;
    this.dx = 0;
    this.dy = 0;
    this.bullets = [];
    this.dt = 0;
    this.dt2 = 0;
    this.width = 64;
    this.height = 64;
    this.fired = false;
    this.hitted = false;
    this.hitDt = 0;
    this.damage = 0;
    this.energy = 1000;
    this.slots = [
      { x: 0, y: -64 },
      { x: 0, y: -128 },
      { x: -64, y: 16 },
      { x: 64, y: 16 },
      { x: -32, y: 64 },
      { x: 32, y: 64 },
      { x: -160, y: 128 },
      { x: 160, y: 128 },
    ];
    this.modulesLength = 0;
    this.statusBar = null;

    this.debug = Text({
      text: 'Hello World!\nI can even be multiline!',
      font: '18px Monospace',
      color: 'white',
      x: 20,
      y: 40,
      anchor: {x: 0, y: 0},
    });
  }

  addStatusBar() {
    const statusBar = Sprite({
      energy: 0,
      total: 0,
      updateBar(current, total) {
        this.energy = current;
        this.total = total;
      },
      render() {
        const { context: ctx} = this;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.strokeRect(-48, -64, 96, 10);
    
        ctx.fillStyle = this.energy < (this.total / 3) ? 'red' : 'green';
        ctx.fillRect(-46, -62, 92 * this.energy / this.total, 6);
      }
    });

    this.addChild(statusBar);
    this.statusBar = statusBar;
  }

  addModule(object) {
    this.addChild(object);
    this.modulesLength++;
    object.slot = this.modulesLength;
    object.x = this.slots[object.slot - 1].x;
    object.y = this.slots[object.slot - 1].y;
    object.sx = this.slots[object.slot - 1].x;
    object.sy = this.slots[object.slot - 1].y;
  }

  hit(damage) {
    this.hitted = true;
    this.hitDt = 0;
    this.damage++;
    this.energy -= damage || 10;

    emit('score', 2);

    if (this.energy < 0) {
      emit('score', 2000);
      emit('explode', this.x, this.y, 100, 5);
      this.children.map(o => {
        o.slot && emit('explode', this.x + o.x, this.y + o.y);
      });
      this.ttl = 1;
    }
  }

  update(dt) {
    super.update(dt);
    this.rotation = 0;

    this.statusBar && this.statusBar.updateBar(this.energy, 1000);
    this.energy <= 0 && (this.ttl = 0);

    const cos = Math.cos(this.rotation);
    const sin = Math.sin(this.rotation);
    const friction = 0.05;
    const threshold = 0.05;

    this.dt += dt;
    this.dt2 += dt;

    this.dx = (Math.cos(this.dt2)) * this.dir;
    this.dy = (Math.sin(this.dt2 / 2)) * this.dir;

    (this.x < 40 || this.x > this.context.canvas.width - 40) && (this.dx = 0);
    (this.y < 40 || this.y > this.context.canvas.height - 40) && (this.dy = 0);

    if (this.dt > 1.5 + Math.random()) {
      this.dt = 0;
      this.fired = false;
    }

    if (this.hitted) {
      this.hitDt += 1;

      if (this.hitDt > 4) {
        this.hitted = false;
      }
    }

    this.advance();

    // this.bullets = this.bullets.filter(sprite => sprite.isAlive());
    // this.bullets.forEach(bullet => bullet.update());

    let removeNext = false;
    let odd = true;
    this.children.forEach(module => {
      if (!module.isAlive() && module.slot) {
        odd = module.slot % 2 === 1;
        removeNext = true;
        console.log(module.slot, odd, removeNext);
      }

      if (removeNext && module.slot && (module.slot % 2 === 1) === odd) {
        module.ttl = 0;       
      }
    });
    this.children = this.children.filter(obj => obj.isAlive());
  }

  draw() {
    const { context: ctx} = this;
    let offsetX = Math.random() * 4 - 2;
    let offsetY = Math.random() * 4 - 2;

    ctx.save();

    this.hitted && (ctx.translate(offsetX, offsetY));

    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    this.hitted && (ctx.fillStyle = 'rgba(255, 255, 255, 0.5)')
    ctx.arc(32, 32, 32, 0, (Math.PI/180)*360);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'red';
    this.hitted && (ctx.fillStyle = 'white')
    ctx.arc(32, 32, 16, 0, (Math.PI/180)*360);
    ctx.fill();

    ctx.restore();
  }

  render() {
    super.render();
    // this.bullets.forEach(bullet => bullet.render());
  }
}