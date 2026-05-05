import { World } from './World';
import { Body } from './Body';
import { Vector2 } from './Vector2';

/** Rotating palette – one colour per spawned body, cycling back to start. */
const COLORS = [
  '#e74c3c',
  '#e67e22',
  '#f1c40f',
  '#2ecc71',
  '#1abc9c',
  '#3498db',
  '#9b59b6',
  '#e91e63',
];

let colorIndex = 0;

function nextColor(): string {
  return COLORS[colorIndex++ % COLORS.length];
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export class MouseInput {
  private draggedBody: Body | null = null;
  private dragOffset: Vector2 = Vector2.zero();

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly world: World,
  ) {
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('mousemove', this.onMouseMove);
    canvas.addEventListener('mouseup', this.onMouseUp);
    canvas.addEventListener('touchstart', this.onTouchStart, { passive: true });
    canvas.addEventListener('touchend', this.onTouchEnd, { passive: true });
  }

  destroy(): void {
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('touchstart', this.onTouchStart);
    this.canvas.removeEventListener('touchend', this.onTouchEnd);
  }

  private canvasPos(clientX: number, clientY: number): Vector2 {
    const rect = this.canvas.getBoundingClientRect();
    // Scale from CSS pixels to canvas pixels.
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return new Vector2((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
  }

  private hitTest(pos: Vector2): Body | null {
    for (let i = this.world.bodies.length - 1; i >= 0; i--) {
      const body = this.world.bodies[i];
      if (body.position.sub(pos).length() <= body.radius) {
        return body;
      }
    }
    return null;
  }

  private spawnAt(pos: Vector2): void {
    const radius = randomBetween(12, 30);
    const mass = radius; // mass proportional to radius for simplicity
    const restitution = randomBetween(0.4, 0.85);
    const vx = randomBetween(-200, 200);
    const vy = randomBetween(-300, 0);
    this.world.addBody(new Body(radius, mass, restitution, nextColor(), pos, new Vector2(vx, vy)));
  }

  private readonly onMouseDown = (e: MouseEvent): void => {
    const pos = this.canvasPos(e.clientX, e.clientY);
    const hit = this.hitTest(pos);
    if (hit) {
      this.draggedBody = hit;
      this.dragOffset = pos.sub(hit.position);
    } else {
      this.spawnAt(pos);
    }
  };

  private readonly onMouseMove = (e: MouseEvent): void => {
    if (!this.draggedBody) return;
    const pos = this.canvasPos(e.clientX, e.clientY);
    this.draggedBody.velocity = Vector2.zero();
    this.draggedBody.position = pos.sub(this.dragOffset);
  };

  private readonly onMouseUp = (): void => {
    this.draggedBody = null;
  };

  private readonly onTouchStart = (e: TouchEvent): void => {
    const touch = e.touches[0];
    if (!touch) return;
    const pos = this.canvasPos(touch.clientX, touch.clientY);
    const hit = this.hitTest(pos);
    if (hit) {
      this.draggedBody = hit;
      this.dragOffset = pos.sub(hit.position);
    } else {
      this.spawnAt(pos);
    }
  };

  private readonly onTouchEnd = (): void => {
    this.draggedBody = null;
  };
}
