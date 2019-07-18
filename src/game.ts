import * as Const from "./const.js";

export default class Game {
  loop: (time?: number) => void;
  draw() {
    throw new Error("Method not implemented.");
  }
  update(arg0: number) {
    throw new Error("Method not implemented.");
  }
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  //res: Resource;
  lastTime: number;
  accumulator: number;
  deltaTime: number;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = "main";
    this.canvas.width = Const.WIDTH * Const.SCALE;
    this.canvas.height = Const.HEIGHT * Const.SCALE;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(Const.SCALE, Const.SCALE);
    document.getElementById("board").appendChild(this.canvas);
    //this.res = new Resource();
    this.lastTime = 0;
    this.accumulator = 0;
    this.deltaTime = 1 / 500;
    this.loop = (time = 0) => {
      this.accumulator += (time - this.lastTime) / 1000;
      while (this.accumulator > this.deltaTime) {
        this.accumulator -= this.deltaTime;
        this.update(Math.min(this.deltaTime, .5));
      }
      this.lastTime = time;
      this.ctx.clearRect(0, 0, Const.WIDTH, Const.HEIGHT);
      this.draw();
      requestAnimationFrame(this.loop);
    }
  }
}

/*class Resource {
  images: any;
  constructor() {
    this.images;
  }

  loadImages(path: string[], callback: any) {
    let idx = 0;
    const promises = [];
    this.images = new Array(path.length);
    path.forEach(f => promises.push(this.loadImage(`../img/${f}`)));
    Promise.all(promises).then((res) => {
      res.forEach(img => this.images[Const.N01 + idx++] = img);
    }).then(() => callback());
  }

  loadImage(url: string) {
    return new Promise((resolve) => {
      const img: HTMLImageElement = new Image();
      img.src = url;
      img.onload = () => resolve(img);
    });
  }
}*/