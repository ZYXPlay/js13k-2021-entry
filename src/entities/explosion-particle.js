import { GameObject, degToRad } from 'kontra';

export default class Particle extends GameObject.class {
  constructor(props) {
    super(props);
    // this.magnitude = props.magnitude || 2;
  }
  init(props) {
    super.init(props);
    let angle = Math.random() * 360;
    let maxMagnitude = props && props.magnitude || 2;
    let magnitude = Math.random() * maxMagnitude + maxMagnitude;
    this.dx = Math.cos(degToRad(angle)) * magnitude;
    this.dy = Math.sin(degToRad(angle)) * magnitude;
    this.width = 4;
    this.height = 4;
    this.anchor = {x: 0.5, y: 0.5};
    this.ttl = 30 * maxMagnitude;
    this.maxTTL = 30 * maxMagnitude;
    this.dt = 0;
  }

  update(dt) {
    this.dt += dt;
    this.advance();
  }

  draw() {
    const { context: ctx } = this;

    let frames = this.dt * 60;
    let alpha = 1 - frames / this.maxTTL;
    
    ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
    ctx.fillRect(0, 0, 4, 4);
  }
}
