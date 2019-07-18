import * as Const from "./const.js";
import Point from "./point.js";
import Stone from "./stone.js";

export default class Field {
  pos: Point;
  stones: Stone[];
  width: number;
  height: number;

  constructor(pos: Point) {
    this.pos = pos.copy();
    this.width = Const.FIELD_SZ;
    this.height = Const.FIELD_SZ;
    this.stones = [];
  }

  addStone(stn: Stone) {
    const w = this.width >> 1,
      h = this.height >> 1,
      c = (Math.random() < .5 ? -(Math.random() * (w - 25) + 5) : Math.random() * (w - 25) + 5),
      r = (Math.random() < .5 ? -(Math.random() * (h - 25) + 5) : Math.random() * (h - 25) + 5);
    stn.pos.set(this.pos.x + w + c, this.pos.y + h + r)
    this.stones.push(stn);
  }

  removeStone(): Stone {
    return this.stones.shift();
  }

  count(): number {
    return this.stones.length;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#333";
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

    ctx.beginPath();
    ctx.rect(this.pos.x, this.pos.y, this.width, this.height);
    ctx.stroke();

    ctx.strokeStyle = "#222";
    this.stones.forEach(s => s.draw(ctx));
    ctx.strokeStyle = "#ddd";

    const str = `${this.count()}`,
      ty = this.pos.y > Const.GAP ? this.pos.y - 5 : this.pos.y + 5 + this.height + 26;
    ctx.fillStyle = "#bbb";
    ctx.fillText(str, this.pos.x + (this.width >> 1) - (ctx.measureText(str).width >> 1), ty);
  }
}