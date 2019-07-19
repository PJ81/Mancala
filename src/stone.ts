import * as Const from "./const.js";
import Point from "./point.js";

export default class Stone {
  pos: Point;
  color: string;
  rad: number;
  target: Point;

  constructor() {
    this.rad = 16;
    this.target = new Point();
    this.pos = new Point();
    this.color = Const.COLORS[Math.floor(Math.random() * Const.COLORS.length)];
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.rad, 0, Const.TWO_PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}