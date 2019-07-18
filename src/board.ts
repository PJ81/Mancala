import * as Const from "./const.js";
import Stone from "./stone.js";
import Field from "./field.js";
import Mancala from "./mancala.js";
import Point from "./point.js";

export default class Board {
  fields: Field[];
  mancalas: Mancala[];

  constructor() {
    this.fields = [];
    this.mancalas = [
      new Mancala(new Point(Const.WIDTH - Const.MANC_WID - Const.GAP, Const.GAP + Const.FIELD_SZ)),
      new Mancala(new Point(Const.GAP, Const.GAP + Const.FIELD_SZ))
    ];

    let fpx, fpy = Const.GAP;
    for (let g = 0; g < 2; g++) {
      fpx = fpx = Const.GAP + Const.GAP + Const.MANC_WID;
      for (let f = 0; f < 6; f++) {
        const fld = new Field(new Point(fpx, fpy));
        for (let s = 0; s < 4; s++) {
          const stn = new Stone();
          fld.addStone(stn);
        }
        this.fields.push(fld);
        fpx += Const.GAP + Const.FIELD_SZ;
      }
      fpy = Const.HEIGHT - Const.GAP - Const.FIELD_SZ;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.mancalas.forEach(m => m.draw(ctx));
    this.fields.forEach(f => f.draw(ctx));
  }

  update(dt) { }
}