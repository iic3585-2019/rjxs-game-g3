export class Point2D {
  add(other) {
    return new Point2D(this.x + other.x, this.y + other.y);
  }

  min(other) {
    return new Point2D(this.x - other.x, this.y - other.y);
  }

  rotate(angle: number, origin: Point2D = null) {
    const b = origin == null ? this : this.min(origin);
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const p = new Point2D(b.x * c - b.y * s, b.x * s + b.y * c);
    return origin == null ? p : origin.add(p);
  }

  size(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  times(mult: number): Point2D {
    return new Point2D(this.x * mult, this.y * mult);
  }

  toString(): string {
    return `(${this.x},${this.y})`;
  }

  map(fx: number => number, fy: number => number) {
    return new Point2D(fx(this.x), fy(this.y));
  }

  equals(other: Point2D) {
    return this.x === other.x && this.y === other.y;
  }
}

export class Line2D {
  a: number = 0;

  b: number = 0;

  constructor(_0: Point2D, _1: Point2D) {
    this.a = (_1.y - _0.y) / (_1.x - _0.x);
    this.b = _0.y - this.a * _0.x;
  }

  intersects(other: Line2D): Point2D[] {
    if (this.a === other.a) {
      return [];
    }
    if (!isFinite(this.a) || !isFinite(other.a)) {
      // non-finite a:
      // - other crosses x position
      // - other crosses x position between y0 and y1
      const inf: Point2D[] = [[this, other], [other, this]]
        .filter(ls => !isFinite(ls[0].a))
        .reduce((thruth: Point2D[], ls) => {
          const oy = ls[1].a * ls[0]._0.x + ls[1].b;
          return (
            (thruth.length && thruth)
            // ls[1] crosses 90-degree segment's x position:
            || (Line2D.surround(ls[0]._0.x, ls[1]._0.x, ls[1]._1.x)
              // Between y range of 90-degree segment:
              && Line2D.surround(oy, ls[0]._0.y, ls[0]._1.y) && [new Point2D(ls[0]._0.x, oy)])
          );
        }, []);
      return inf;
    }
    const x = (this.b - other.b) / (other.a - this.a);
    const i = Line2D.getLineIntersection(
      this._0.x,
      this._0.y,
      this._1.x,
      this._1.y,
      other._0.x,
      other._0.y,
      other._1.x,
      other._1.y,
    );
    return (i && [new Point2D(x, x * this.a + this.b)]) || [];
  }

  static surround(val: number, a: number, b: number) {
    return val < Math.max(a, b) && val > Math.min(a, b);
  }

  draw(ctx: CanvasRenderingContext2D, debug: boolean = false) {
    ctx.beginPath();
    ctx.moveTo(this._0.x, ctx.canvas.height - this._0.y);
    ctx.lineTo(this._1.x, ctx.canvas.height - this._1.y);
    ctx.stroke();
  }

  extended(x1: number, x2: number) {
    return new Line2D(new Point2D(x1, this.a * x1 + this.b), new Point2D(x2, this.a * x2 + this.b));
  }

  // @see: http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect#comment19248344_1968345
  static getLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    let s1_x;
    let s1_y;
    let s2_x;
    let s2_y;

    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;

    let s;
    let t;

    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      // Collision detected
      const intX = p0_x + t * s1_x;
      const intY = p0_y + t * s1_y;
      return [intX, intY];
    }
    return null; // No collision
  }

  size() {
    return Math.sqrt(Math.pow(this._1.x - this._0.x, 2) + Math.pow(this._1.y - this._0.y, 2));
  }
}

class Form {
  constructor(centre: Point2D, points: Point2D[]) {}

  rotate(angle: number) {
    return new Form(this.centre, this.points.map(p => p.rotate(angle, this.centre)));
  }

  move(dist: Point2D) {
    return new Form(this.centre.add(dist), this.points.map(p => p.add(dist)));
  }
}

export class Box extends Form implements Drawable {
  rotation: number = 0;

  constructor(centre: Point2D, width: number, height: number, points: Point2D[] = []) {
    super(centre, points);
    this.points = (points.length && points)
      || [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].map(c => centre.add(new Point2D(c[0] * width, c[1] * height)));
  }

  move(dist: Point2D) {
    return new Box(
      this.centre.add(dist),
      this.width,
      this.height,
      this.points.map(p => p.add(dist)),
    );
  }

  rotate(angle: number): Box {
    const b = new Box(this.centre, this.width, this.height);
    b.rotation = this.rotation + angle;
    b.points = super.rotate(angle).points;
    return b;
  }

  draw(ctx: CanvasRenderingContext2D, debug: boolean = false, flip: boolean = true) {
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, flip ? ctx.canvas.height - this.points[0].y : this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, flip ? ctx.canvas.height - this.points[i].y : this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();

    if (debug) {
      const c = ctx.strokeStyle;
      ctx.strokeStyle = 'red';
      this.lines().forEach(l => l.draw(ctx));
      ctx.strokeStyle = c;
    }
  }

  map(fx: number => number, fy: number => number) {
    const b = new Box(this.centre.map(fx, fy), 0, 0);
    b.points = this.points.map(p => p.map(fx, fy));
    return b;
  }

  clearRadius(): number {
    return Math.max(this.width, this.height);
  }

  intersects(other: Box) {
    return this.centre.min(other.centre).size() < Math.min(this.clearRadius(), other.clearRadius());
  }
}
