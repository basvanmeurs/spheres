import { Body } from './Body';
import { Vector2 } from './Vector2';

/** Pixels per second squared – roughly Earth gravity scaled to screen space. */
const GRAVITY = 980;

/** Linear velocity damping applied each frame to simulate air resistance / friction. */
const DAMPING = 0.995;

export class World {
  readonly bodies: Body[] = [];

  /** Width and height of the simulation boundary (canvas dimensions). */
  private width = 0;
  private height = 0;

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  addBody(body: Body): void {
    this.bodies.push(body);
  }

  /**
   * Advance the simulation by `dt` seconds.
   * Uses semi-implicit Euler: velocity is updated before position.
   */
  update(dt: number): void {
    for (const body of this.bodies) {
      // Apply gravity.
      body.acceleration = body.acceleration.add(new Vector2(0, GRAVITY));

      // Semi-implicit Euler integration.
      body.velocity = body.velocity.add(body.acceleration.scale(dt));
      body.velocity = body.velocity.scale(DAMPING);
      body.position = body.position.add(body.velocity.scale(dt));

      // Reset acceleration for next frame.
      body.acceleration = Vector2.zero();

      // Boundary collisions.
      this.resolveWalls(body);
    }
  }

  /** Correct position and invert velocity component on boundary contact. */
  private resolveWalls(body: Body): void {
    const { radius, restitution } = body;

    // Left wall.
    if (body.position.x - radius < 0) {
      body.position = new Vector2(radius, body.position.y);
      if (body.velocity.x < 0) {
        body.velocity = new Vector2(-body.velocity.x * restitution, body.velocity.y);
      }
    }

    // Right wall.
    if (body.position.x + radius > this.width) {
      body.position = new Vector2(this.width - radius, body.position.y);
      if (body.velocity.x > 0) {
        body.velocity = new Vector2(-body.velocity.x * restitution, body.velocity.y);
      }
    }

    // Ceiling.
    if (body.position.y - radius < 0) {
      body.position = new Vector2(body.position.x, radius);
      if (body.velocity.y < 0) {
        body.velocity = new Vector2(body.velocity.x, -body.velocity.y * restitution);
      }
    }

    // Floor.
    if (body.position.y + radius > this.height) {
      body.position = new Vector2(body.position.x, this.height - radius);
      if (body.velocity.y > 0) {
        body.velocity = new Vector2(body.velocity.x, -body.velocity.y * restitution);
      }
    }
  }

  get gravity(): number {
    return GRAVITY;
  }
}
