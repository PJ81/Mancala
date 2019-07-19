import * as Const from "./const.js";
import Point from "./point.js";

export default class Stone {
  pos: Point;
  color: string;
  rad: number;
  target: Point;
  dir: Point;

  constructor() {
    this.rad = 16;
    this.dir = new Point();
    this.target = new Point();
    this.pos = new Point();
    this.color = Const.COLORS[Math.floor(Math.random() * Const.COLORS.length)];
  }

  setTarget(tg: Point) {
    this.target.set(tg.x, tg.y);
    this.dir = this.pos.heading(tg);
  }

  move(dt: number): boolean {
    const dist = this.pos.dist(this.target);
    if (dist < 1) {
      this.pos.set(this.target.x, this.target.y);
      return true;
    } else {
      this.pos.x += this.dir.x * dt * dist * 10;
      this.pos.y += this.dir.y * dt * dist * 10;
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.rad, 0, Const.TWO_PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.stroke();
  }
}