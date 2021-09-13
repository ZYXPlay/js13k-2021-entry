import { GameObject, keyPressed, emit  } from 'kontra';
import { Bullet } from '.';

export default class Ship extends GameObject.class {
  constructor(props) {
    super(props);
    this.anchor = {x: 0.5, y: 0.5};
    this.x = 150;
    this.y = 250;
    this.width = 32;
    this.height = 26;
    this.dx = 0;
    this.dy = 0;
    this.bullets = [];
    this.dt = 0;
    this.hitted = false;
    this.hitDt = 0;
    this.lives = 3;
    this.power = 1;

    this.spawning = false;
    this.spawningT = 0;

    this.spawn();
  }

  hit() {
    if (this.spawning) {
      return;
    }

    this.hitted = true;
    this.hitDt = 0;
    this.lives -= 1;

    this.lives == 0 && emit('gameover');
    emit('explode', this.x, this.y, 70, 4);

    this.spawn();
  }

  spawn() {
    this.spawning = true;
    this.spawningT = 0;
    this.x = 16;
    this.y = this.context.canvas.height / 2 - 16;
    this.dy = 0;
    this.dx = 1;
    this.ddx = 0;
    this.ddy = 0;
    this.rotation = 0;
  }

  fire() {
    this.dt = 0;
    this.bullets.push(new Bullet({
      x: this.x + 16,
      y: this.y + 8,
      dx: 10,
      dy: Math.random() - 0.5,
      rotation: this.rotation,
    }));
  }

  update(dt) {
    super.update(dt);
    const { context: ctx } = this;

    this.spawning && (this.spawningT++);
    this.spawningT > 100 && (this.spawning = false);

    if (this.spawning) {
      this.advance();
      this.bullets = this.bullets.filter(sprite => sprite.isAlive());
      this.bullets.forEach(bullet => bullet.update());
      return;
    }

    // const cos = Math.cos(this.rotation);
    // const sin = Math.sin(this.rotation);
    const friction = 0.05;
    const threshold = 0.05;

    this.dt += 1/60;

    this.ddx = 0;
    this.ddy = 0;

    keyPressed('left') && this.dx > -3 && (this.ddx = -0.2);
    keyPressed('right') && this.dx < 3 && (this.ddx = 0.2);
    keyPressed('up') && this.dy > -3 && (this.ddy = -0.2);
    keyPressed('down') && this.dy < 3 && (this.ddy = 0.2);
    keyPressed('space') && this.dt > 0.05 && this.fire();


    if (this.dx > 0) {
      this.dx -= friction;
      if(this.dx < threshold){
        this.dx = 0;
      }
    } else if (this.dx < 0) {
      this.dx += friction;
      if(this.dx > threshold){
        this.dx = 0;
      }
    }

    if (this.dy > 0) {
      this.dy -= friction;
      if(this.dy < threshold){
        this.dy = 0;
      }
    } else if (this.dy < 0) {
      this.dy += friction;
      if(this.dy > threshold){
        this.dy = 0;
      }
    }

    this.x < 0 && (this.x = 0, this.dx = 0);
    this.x > ctx.canvas.width && (this.x = ctx.canvas.width, this.dx = 0);
    this.y < 0 && (this.y = 0, this.dy = 0);
    this.y > ctx.canvas.height && (this.y = ctx.canvas.height, this.dy = 0);

    this.advance();

    this.bullets = this.bullets.filter(sprite => sprite.isAlive());
    this.bullets.forEach(bullet => bullet.update());
  }

  draw() {
    const { context: ctx} = this;

    function path(ctx, path, fill, stroke) {
      const p = new Path2D(path);
      fill && (ctx.fillStyle = fill);
      stroke && (ctx.strokeStyle = stroke);
      ctx.fill(p);
      ctx.stroke(p);

      return;
    }

    function circle(ctx, x, y, r, fill, stroke) {
      ctx.beginPath();
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.arc(x, y, r, 0, (Math.PI/180)*360);
      fill && ctx.fill();
      stroke && ctx.stroke();
    }

    function rect(ctx, x, y, w, h, fill, stroke) {
      fill && (ctx.fillStyle = fill);
      stroke && (ctx.strokeStyle = stroke);
      ctx.rect(x, y, w, h);
      fill && ctx.fill();
      stroke && ctx.stroke();
    }

    if (this.spawning && this.spawningT % 5) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 0, 0.25)';
      ctx.arc(16, 16, 32, 0, (Math.PI/180)*360);
      ctx.fill();
    }

    ctx.save();
    // ctx.translate(-10, -12);
    ctx.scale(0.5, 0.5);

    ctx.globalAlpha = 0.3;
    path(ctx, 'm59 34-2 10c-1 2-3 3-6 4H12l-5-4c-2-2-2-5-2-10C5 16 17 1 32 1s27 15 27 33Z', '#3FAEFF', '#000');
    ctx.globalAlpha = 1;

    path(ctx, 'm51 34-5 2 1-3 4 1ZM53 31l-6-4 1 5 5-1Z', '#FFA63D', '#000');
    path(ctx, 'm33 13-2-5 5 5 2 3-6-1-5-4 4 2-2-3c1-1 4 3 4 3Z', '#000', '#000');
    path(ctx, 'M44 19c-4-6-24-4-29 0-4 5-3 15 0 18 4 4 25 3 29 0s4-12 0-18Z', '#3FAEFF', '#000');

    circle(ctx, 37.9, 27.4, 5.6, '#fff', '#000');
    circle(ctx, 39.4, 27.4, 2.3, '#000');
    circle(ctx, 40, 26.6, 0.8, '#fff');

    path(ctx, 'M32 34c-4-2-19-4-19-4l1 4 3 4 8 1h11s1-3-4-5Z', '#fff');
    path(ctx, 'm40 20-6-1-1 2h7v-1Z', '#000');
    ctx.globalAlpha = 0.3;
    path(ctx, 'm59 34-2 10c-1 2-3 3-6 4H12l-5-4c-2-2-2-5-2-10C5 16 17 1 32 1s27 15 27 33Z', '#3FAEFF', '#000');
    ctx.globalAlpha = 1;

    rect(ctx, 0.5, 34.6, 63, 15.9, '#FFA63D', '#000');

    ctx.restore();

    // ctx.strokeStyle = '#fff';
    // ctx.strokeRect(0, 0, this.width, this.height);
  }

  render() {
    super.render();
    this.bullets.forEach(bullet => bullet.render());
    // this.debug.render();
  }
  // render() {
  //   super.render();
  //   this.draw();
  //   this.context.strokeStyle = 'yellow';
  //   this.context.lineWidth = 2;
  //   this.context.strokeRect(0, 0, this.width, this.height);
  // }
}