import * as Const from "./const.js";
import Field from "./field.js";
import Point from "./point.js";

export default class Mancala extends Field {
  constructor(pos: Point, pl: boolean) {
    super(pos, 0, pl);
    this.width = Const.MANC_WID;
    this.height = Const.HEIGHT - 2 * Const.GAP - 2 * Const.FIELD_SZ;
  }
}