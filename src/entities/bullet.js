import { GameObject } from 'kontra';

export default class Bullet extends GameObject.class {
  constructor(props) {
    super(props);
    this.id = 'bullet',
    this.ttl = props.ttl || 1000;
    this.type = props.type || 0;
    this.entityType = 'bullet';
    this.radius = 2;
    this.width = 2;
    this.height = 2;
  }

  update(dt) {
    super.update(dt);

    (
      this.x < 0 || 
      this.x > this.context.canvas.width ||
      this.y < 0 ||
      this.y > this.context.canvas.height
    ) && (
      this.ttl = 0
    );
  }

  draw() {
    const { context: ctx, type } = this;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    if (type == 0) {
      ctx.fillStyle = 'white';
      ctx.fillRect(-2, -2, 4, 4);      
      ctx.fillStyle = 'yellow';
      ctx.fillRect(-6, -2, 4, 4);
      ctx.fillStyle = 'red';
      ctx.fillRect(-8, -2, 4, 4);
    } else if(type == 1) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.arc(0, 0, 4, 0, (Math.PI/180)*360);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(0, 0, 2, 0, (Math.PI/180)*360);
      ctx.fill();
    }

    ctx.restore();
  }
}