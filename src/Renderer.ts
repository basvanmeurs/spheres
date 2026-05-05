import { World } from './World';

export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D canvas context');
    this.ctx = ctx;
  }

  render(world: World, fps: number): void {
    const { ctx, canvas } = this;
    const { width, height } = canvas;

    // Clear with dark background.
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    // Draw each body.
    for (const body of world.bodies) {
      ctx.beginPath();
      ctx.arc(body.position.x, body.position.y, body.radius, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();
      // Subtle highlight rim.
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Debug overlay.
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(8, 8, 180, 66);
    ctx.fillStyle = '#ddd';
    ctx.font = '13px monospace';
    ctx.fillText(`FPS:     ${fps.toFixed(1)}`, 16, 26);
    ctx.fillText(`Bodies:  ${world.bodies.length}`, 16, 44);
    ctx.fillText(`Gravity: ${world.gravity} px/s²`, 16, 62);
  }
}
