import * as Const from "./const.js";
import Game from "./game.js";
import Board from "./board.js";
import Point from "./point.js";

class GoM extends Game {
  board: Board;
  player: boolean;
  state: number;
  win: number;

  constructor() {
    super();
    this.win;
    this.state = Const.WAIT;
    this.player = true;
    this.board = new Board((res: number) => {
      this.state = Const.WAIT;
      switch (res) {
        case Const.NEXT_PLAYER: this.player = !this.player; break;
        case 1:
        case 2:
        case 3:
          this.win = res;
          this.state = Const.GAME_OVER;
          break;
      }
    });
    this.canvas.addEventListener("click", (me: MouseEvent) => this.onClick(me, null));
    this.canvas.addEventListener("touchstart", (te: TouchEvent) => this.onClick(null, te));
    this.update = (dt: number) => this.board.update(dt);
    this.loop();
  }

  draw() {
    this.ctx.font = '80px Montserrat';
    this.ctx.fillStyle = "#888";
    let pl: string;

    if (this.state !== Const.GAME_OVER) {
      pl = `Player ${this.player ? 1 : 2}`;
    } else {
      if (this.win === 3) {
        pl = "TIE GAME!";
      } else {
        pl = `PLAYER ${this.win} WINS!`;
      }
    }
    this.ctx.fillText(pl, (Const.WIDTH >> 1) - (this.ctx.measureText(pl).width >> 1), (Const.HEIGHT >> 1) + 20);

    this.ctx.font = '30px Montserrat';
    this.board.draw(this.ctx);
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
    const field = this.board.getField(pt, this.player);
    if (field !== null) {
      this.state = Const.PERFORM;
      this.board.moveStones(field, this.player);
    }
  }
}

new GoM();