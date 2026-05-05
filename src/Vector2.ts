/** Immutable 2-component vector with common math helpers. */
export class Vector2 {
  constructor(
    public readonly x: number,
    public readonly y: number,
  ) {}

  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  scale(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }
}
