import Game from "./game.js";
import Board from "./board.js";

class GoM extends Game {
  board: Board;
  constructor() {
    super();
    this.ctx.font = '30px Montserrat';

    this.board = new Board();
    this.draw = () => this.board.draw(this.ctx);
    this.update = (dt: number) => this.board.update(dt);

    this.board.mancalas[1].addStone(this.board.fields[0].removeStone())

    this.loop();
  }
}

new GoM();