import * as Const from "./const.js";
import Stone from "./stone.js";
import Field from "./field.js";
import Mancala from "./mancala.js";
import Point from "./point.js";

export default class Board {
  fields: Field[];
  mancalas: Mancala[];
  callBack: any;
  moving: boolean;

  constructor(callBack: any) {
    this.callBack = callBack;
    this.moving = false;
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
  }

  getFieldCount(field: number): number {
    return this.fields[field].count();
  }

  moveStones(field: number) {
    this.moving = true;
  }

  getField(pt: Point): number {
    for (let r of this.fields) {
      if (r.inBox(pt)) return r.index;
    }
    return null;
  }

  update(dt: number) {
    if (this.moving) {
      /*
        lots of stuff to come!
      */
      this.moving = false;
      this.callBack(true);
    }
  }
}