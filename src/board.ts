import * as Const from "./const.js";
import Stone from "./stone.js";
import Field from "./field.js";
import Mancala from "./mancala.js";
import Point from "./point.js";

export default class Board {
  fields: Field[];
  lastStones: Stone[];
  stone: Stone;
  callBack: Function;
  movingField: number;
  movingCount: number;
  movingTo: number;
  state: number;
  lastStone: boolean;
  player: boolean;

  constructor(callBack: Function) {
    this.callBack = callBack;
    this.state = Const.NONE;
    this.lastStone;
    this.lastStones;
    this.player;
    this.stone;
    this.movingTo;
    this.movingField;
    this.movingCount;
    this.fields = [];

    const step = Const.GAP + Const.FIELD_SZ;
    let fpx = Const.GAP + Const.GAP + Const.MANC_WID,
      fpy = Const.HEIGHT - Const.GAP - Const.FIELD_SZ,
      idx = 0;
    for (let g = 0; g < 2; g++) {
      for (let f = 0; f < 6; f++) {
        const fld = new Field(new Point(fpx, fpy), idx++, g === 0);
        for (let s = 0; s < 1; s++) {
          const stn = new Stone();
          fld.addStone(stn);
        }
        this.fields.push(fld);
        fpx += g < 1 ? step : -step;
      }
      fpy = Const.GAP;
      fpx -= step;
      if (g === 0) {
        this.fields.push(new Mancala(new Point(Const.WIDTH - Const.MANC_WID - Const.GAP, Const.GAP + Const.FIELD_SZ), true));
        idx++
      } else {
        this.fields.push(new Mancala(new Point(Const.GAP, Const.GAP + Const.FIELD_SZ), false));
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.fields.forEach(f => f.draw(ctx));
    if (this.stone) {
      this.stone.draw(ctx);
    } else if (this.state === Const.MOVE_ALL) {
      for (const s of this.lastStones) {
        s.draw(ctx);
      }
    }
  }

  moveStones(field: number, player: boolean) {
    this.movingField = field;
    this.movingCount = 1;
    this.state = Const.RETRIEVING;
    this.player = player;
  }

  getField(pt: Point, pl: boolean): number {
    for (let r of this.fields) {
      if (!(r instanceof Mancala) && r.inBox(pt)) {
        return (r.count() && r.player === pl) ? r.index : null;
      }
    }
    return null;
  }

  update(dt: number) {
    switch (this.state) {
      case Const.RETRIEVING:
        this.stone = this.fields[this.movingField].removeStone();
        this.lastStone = this.fields[this.movingField].lastStone;
        const pt = new Point();
        /* --------------- TO DO ---------------
         * do not retrieve if movingTo === movieng field
         * same field stone should not move !!!!
        ------------------------------------- */
        this.movingTo = this.movingField + this.movingCount;
        /* --------------- TO DO ---------------
         * if stones goe two times around
         * this does not work !!!!
        ------------------------------------- */
        this.movingTo = this.movingTo > 13 ? this.movingTo - 14 : this.movingTo;
        if (this.fields[this.movingTo] instanceof Mancala) {
          if (this.fields[this.movingTo].player === this.player) {
            this.fields[this.movingTo].makePosition(pt);
          } else {
            this.movingCount++;
            this.movingTo = this.movingField + this.movingCount;
            this.movingTo = this.movingTo > 13 ? this.movingTo - 14 : this.movingTo;
            this.fields[this.movingTo].makePosition(pt);
          }
        } else {
          this.fields[this.movingTo].makePosition(pt);
        }
        this.stone.setTarget(pt);
        this.state = Const.MOVING;
        break;
      case Const.MOVING:
        this.state = this.stone.move(dt) ? Const.SETTING : Const.MOVING;
        break;
      case Const.SETTING:
        this.fields[this.movingTo].addStone(this.stone);
        this.state = Const.NONE;
        this.stone = null
        if (this.lastStone) {
          const res = this.checkRules();
          if (res & Const.GAME_OVER) {
            this.state = Const.COLLECT_STONES;
          } else if (res & Const.EMPTY) {
            //
          } else if (res & Const.MANCALA) {
            this.callBack(Const.SAME_PLAYER);
            return;
          }
          this.callBack(Const.NEXT_PLAYER);
        } else {
          this.state = Const.RETRIEVING;
          this.movingCount++;
        }
        break;
      case Const.COLLECT_STONES:
        let p = this.player ? 7 : 0;
        const mancala = this.player ? this.fields[13] : this.fields[6];
        const np = new Point();
        this.lastStones = [];
        for (let s = 0; s < 6; s++) {
          let st: Stone;
          do {
            st = this.fields[s + p].removeStone();
            if (st) {
              mancala.makePosition(np);
              st.setTarget(np);
              this.lastStones.push(st);
            }
          } while (st);
        }
        this.state = Const.MOVE_ALL;
        break;
      case Const.MOVE_ALL:
        const mncl = this.player ? this.fields[13] : this.fields[6];
        for (let l = this.lastStones.length - 1, s = l; s > -1; s--) {
          const stn = this.lastStones[s];
          if (stn.move(dt)) {
            mncl.addStone(stn);
            this.lastStones.splice(s, 1);
          }
        }
        if (this.lastStones.length < 1) {
          const a = this.fields[6].count(), b = this.fields[13].count();
          this.callBack(a > b ? 1 : b > a ? 2 : 3);
          this.state = Const.NONE;
        }
        break;
    }
  }

  checkRules(): number {
    let res = 0, c = 0, p = this.player ? 0 : 7;
    // is mancala
    res += this.fields[this.movingTo] instanceof Mancala ? Const.MANCALA : 0;
    // landed is empty
    res += !(this.fields[this.movingTo] instanceof Mancala) && this.fields[this.movingTo].count() === 0 ? Const.EMPTY : 0;
    // is game over
    for (let s = 0; s < 6; s++) {
      c += this.fields[s + p].count();
    }
    res += !c ? Const.GAME_OVER : 0;
    return res;
  }
}