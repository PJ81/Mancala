import * as Const from "./const.js";
import Game from "./game.js";
import Board from "./board.js";
import Point from "./point.js";

class GoM extends Game {
  board: Board;
  player: boolean;
  state: number;

  constructor() {
    super();
    this.state = Const.WAIT;
    this.player = true;
    this.board = new Board((change: boolean) => {
      this.state = Const.WAIT;
      if (change) this.player = !this.player;
    });
    this.draw = () => {
      const pl = this.player ? "Player 1" : "Player 2";
      this.ctx.font = '80px Montserrat';
      this.ctx.fillStyle = "#888";
      this.ctx.fillText(pl, (Const.WIDTH >> 1) - (this.ctx.measureText(pl).width >> 1), (Const.HEIGHT >> 1) + 20);
      this.ctx.font = '30px Montserrat';
      this.board.draw(this.ctx);
    }
    this.canvas.addEventListener("click", (me: MouseEvent) => this.onClick(me, null));
    this.canvas.addEventListener("touchstart", (te: TouchEvent) => this.onClick(null, te));
    this.update = (dt: number) => this.board.update(dt);
    this.board.mancalas[1].addStone(this.board.fields[0].removeStone())
    this.loop();
  }

  onClick(me: MouseEvent, te: TouchEvent) {
    if (this.state !== Const.WAIT) return;

    const pt = new Point();
    if (me) {
      pt.x = me.clientX - (me.srcElement as HTMLCanvasElement).offsetLeft;
      pt.y = me.clientY - (me.srcElement as HTMLCanvasElement).offsetTop;
    } else {
      pt.x = te.touches[0].clientX - (te.srcElement as HTMLCanvasElement).offsetLeft;
      pt.y = te.touches[0].clientY - (te.srcElement as HTMLCanvasElement).offsetTop;
    }
    const field = this.board.getField(pt);
    if (field !== null && this.board.getFieldCount(field) > 0) {
      this.state = Const.PERFORM;
      this.board.moveStones(field);
    }
  }
}

new GoM();