import { Vector2 } from './Vector2';

/** A circular physics body. */
export class Body {
  position: Vector2;
  velocity: Vector2;
  /** Accumulated acceleration for the current frame (reset after integration). */
  acceleration: Vector2;

  constructor(
    public readonly radius: number,
    public readonly mass: number,
    /** Coefficient of restitution (bounciness), 0–1. */
    public readonly restitution: number,
    public readonly color: string,
    initialPosition: Vector2,
    initialVelocity: Vector2,
  ) {
    this.position = initialPosition;
    this.velocity = initialVelocity;
    this.acceleration = Vector2.zero();
  }
}
