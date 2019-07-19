import * as Const from "./const.js";
import Stone from "./stone.js";
import Field from "./field.js";
import Mancala from "./mancala.js";
import Point from "./point.js";

export default class Board {
  fields: Field[];
  mancalas: Mancala[];
  callBack: any;
  movingField: number;
  movingCount: number;
  state: number;
  stone: Stone;

  constructor(callBack: any) {
    this.callBack = callBack;
    this.state = Const.NONE;
    this.stone;
    this.movingField;
    this.movingCount;
    this.fields = [];
    this.mancalas = [
      new Mancala(new Point(Const.WIDTH - Const.MANC_WID - Const.GAP, Const.GAP + Const.FIELD_SZ)),
      new Mancala(new Point(Const.GAP, Const.GAP + Const.FIELD_SZ))
    ];

    const step = Const.GAP + Const.FIELD_SZ;
    let fpx = Const.GAP + Const.GAP + Const.MANC_WID,
      fpy = Const.HEIGHT - Const.GAP - Const.FIELD_SZ,
      idx = 0;
    for (let g = 0; g < 2; g++) {
      for (let f = 0; f < 6; f++) {
        const fld = new Field(new Point(fpx, fpy), idx++);
        for (let s = 0; s < 4; s++) {
          const stn = new Stone();
          fld.addStone(stn);
        }
        this.fields.push(fld);
        fpx += g < 1 ? step : -step;
      }
      fpy = Const.GAP;
      fpx -= step;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.mancalas.forEach(m => m.draw(ctx));
    this.fields.forEach(f => f.draw(ctx));
    if (this.stone) {
      this.stone.draw(ctx);
    }
  }

  moveStones(field: number) {
    this.movingField = field;
    this.movingCount = 1;
    this.state = Const.RETRIEVING;
  }

  getField(pt: Point): number {
    for (let r of this.fields) {
      if (r.inBox(pt)) {
        return r.count() ? r.index : null;
      }
    }
    return null;
  }

  update(dt: number) {
    switch (this.state) {
      case Const.RETRIEVING:
        this.stone = this.fields[this.movingField].removeStone();
        if (this.stone) {
          this.fields[this.movingField + this.movingCount].makePosition(this.stone.target);
          this.state = Const.MOVING;
        } else {
          this.state = Const.NONE;
          this.callBack(true);
        }
        break;
      case Const.MOVING:
        const dist = this.stone.pos.dist(this.stone.target);
        if (dist > 120) {
          this.stone.pos.x += 30 * dt * dist;
          this.stone.pos.y += 30 * dt * dist;
        } else {
          this.stone.pos = this.stone.target;
          this.state = Const.SETTING;
        }
        break;
      case Const.SETTING:
        this.fields[this.movingField + this.movingCount].addStone(this.stone);
        this.stone = null;
        this.state = Const.RETRIEVING;
        this.movingCount++;
        break;
    }
  }
}