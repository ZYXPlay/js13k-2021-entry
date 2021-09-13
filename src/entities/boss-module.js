import { GameObject, degToRad, emit  } from 'kontra';

export default class BossModule extends GameObject.class {
  constructor(props) {
    super(props);
    this.type = props.type || 0;
    this.anchor = {x: 0.5, y: 0.5};
    this.width = 64;
    this.height = 64;
    this.dt = 0;
    this.hitted = false;
    this.hitDt = 0;
    this.energy = 200;
    this.fireStatus = 0;
    this.fireT = 0;
    this.maxBullets = props.type == 1 ? 18 : 36;
  }

  hit(damage) {
    this.hitted = true;
    this.hitDt = 0;
    this.energy -= damage || 10;
    this.parent.hit(1);

    emit('score', 1);

    if (this.energy < 0) {
      // this.explode();
      emit('score', 100);
      emit('explode', this.parent.x + this.x, this.parent.y + this.y);
      this.ttl = 0;
    }
  }

  update(dt) {
    super.update(dt);
    this.dt += dt;

    if (this.hitted) {
      this.hitDt++;

      if (this.hitDt > 10) {
        this.hitted = false; 
      }
    }

    if (this.type !== 2) {

      this.fireT += dt;

      if (this.fireT > 3 + (Math.random() * 40) && this.fireStatus === 0) {
        this.fireStatus = 1;
        this.fireT = 0;
      }

      if (this.fireT > 1 + (Math.random() * 1) && this.fireStatus === 2) {
        this.fireStatus = 0;
        this.fireT = 0;
      }

      if (this.fireT > 1 + (Math.random() * 1) && this.fireStatus === 1) {
        this.fireStatus = 2;
        this.fireT = 0;
        emit('fire',
          this.parent.x + this.x,
          this.parent.y + this.y,
          this.rotation,
          this.maxBullets
        );
      }
      
    }

    if (this.fireStatus === 0) {
      this.rotation = degToRad((this.dt * 100) % 360);
    }

    if (this.exploding) {
      this.explodingT += dt;
    }

    this.advance();
  }

  draw() {
    const { context: ctx} = this;
    let offsetX = Math.random() * 4 - 2;
    let offsetY = Math.random() * 4 - 2;

    this.hitted && (ctx.translate(offsetX, offsetY));

    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.beginPath();
    ctx.fillStyle = '#990';
    this.hitted && (ctx.fillStyle = 'rgba(255,255,255,0.5)');
    ctx.arc(32, 32, 32, 0, (Math.PI/180)*360);
    ctx.fill();

    ctx.fillStyle = '#fff';
    var p = new Path2D("M30 0v4h1v12.03c-2.188.136-4.257.71-6.12 1.638L18.866 7.25l.866-.5-2-3.464-3.464 2 2 3.464.866-.5 6.015 10.418a16.087 16.087 0 0 0-4.48 4.48L8.251 17.134l.5-.866-3.464-2-2 3.464 3.464 2 .5-.866 10.417 6.014A15.906 15.906 0 0 0 16.03 31H4v-1H0v4h4v-1h12.03c.136 2.188.71 4.257 1.638 6.12L7.25 45.134l-.5-.866-3.464 2 2 3.464 3.464-2-.5-.866 10.418-6.015a16.087 16.087 0 0 0 4.48 4.48l-6.015 10.418-.866-.5-2 3.464 3.464 2 2-3.464-.866-.5 6.014-10.417A15.908 15.908 0 0 0 31 47.97V60h-1v4h4v-4h-1V47.97a15.907 15.907 0 0 0 6.12-1.638l6.014 10.417-.866.5 2 3.464 3.464-2-2-3.464-.866.5-6.015-10.418a16.086 16.086 0 0 0 4.48-4.48l10.418 6.015-.5.866 3.464 2 2-3.464-3.464-2-.5.866-10.417-6.014A15.906 15.906 0 0 0 47.97 33H60v1h4v-4h-4v1H47.97a15.906 15.906 0 0 0-1.638-6.12l10.417-6.014.5.866 3.464-2-2-3.464-3.464 2 .5.866-10.418 6.015a16.086 16.086 0 0 0-4.48-4.48l6.015-10.418.866.5 2-3.464-3.464-2-2 3.464.866.5-6.014 10.417A15.908 15.908 0 0 0 33 16.03V4h1V0h-4Z");
    ctx.fill(p);
    ctx.restore();
  }

  render() {
    super.render();
  }
}