export default class Point {
  x: number;
  y: number;
  constructor(x = 0, y = 0) {
    this.x;
    this.y;
    this.set(x, y);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(pt: Point) {
    return pt.x === this.x && pt.y === this.y;
  }

  dist(pt: Point) {
    let a = pt.x - this.x,
      b = pt.y - this.y;
    return Math.sqrt(a * a + b * b);
  }

  copy() {
    return new Point(this.x, this.y);
  }
}