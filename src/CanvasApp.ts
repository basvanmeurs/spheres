import { World } from './World';
import { Renderer } from './Renderer';
import { MouseInput } from './MouseInput';

/** Maximum delta time in seconds (prevents large jumps after tab switching). */
const MAX_DT = 0.05;

export class CanvasApp {
  private readonly canvas: HTMLCanvasElement;
  private readonly world: World;
  private readonly renderer: Renderer;
  private readonly mouseInput: MouseInput;

  private rafId = 0;
  private lastTime = 0;

  // Rolling FPS average.
  private fpsAccum = 0;
  private fpsFrames = 0;
  private fps = 0;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    if (!canvas) throw new Error(`Canvas element #${canvasId} not found`);
    this.canvas = canvas;

    this.world = new World();
    this.renderer = new Renderer(canvas);
    this.mouseInput = new MouseInput(canvas, this.world);

    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  start(): void {
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.mouseInput.destroy();
  }

  private readonly onResize = (): void => {
    // Match canvas pixel dimensions to the CSS layout size (device pixel ratio aware).
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(window.innerWidth * dpr);
    this.canvas.height = Math.round(window.innerHeight * dpr);
    this.world.resize(this.canvas.width, this.canvas.height);
  };

  private readonly loop = (now: number): void => {
    const rawDt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Clamp to avoid physics explosions after tab is hidden.
    const dt = Math.min(rawDt, MAX_DT);

    // Update rolling FPS.
    this.fpsAccum += rawDt;
    this.fpsFrames++;
    if (this.fpsAccum >= 0.25) {
      this.fps = this.fpsFrames / this.fpsAccum;
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }

    this.world.update(dt);
    this.renderer.render(this.world, this.fps);

    this.rafId = requestAnimationFrame(this.loop);
  };
}
