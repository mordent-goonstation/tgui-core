const EPSILON = 0.0001;

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r = 0, g = 0, b = 0, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toString(): string {
    // Alpha component needs to permit fractional values, so cannot use |
    let alpha = this.a;
    if (typeof alpha === 'string') {
      alpha = Number.parseFloat(this.a as any);
    }
    if (Number.isNaN(alpha)) {
      alpha = 1;
    }
    return `rgba(${this.r | 0}, ${this.g | 0}, ${this.b | 0}, ${alpha})`;
  }

  /**  Darkens a color by a given percent. Returns a color, which can have toString called to get it's rgba() css value. */
  darken(percent: number): Color {
    const scaled = percent / 100;

    return new Color(
      this.r - this.r * scaled,
      this.g - this.g * scaled,
      this.b - this.b * scaled,
      this.a,
    );
  }

  /** Brightens a color by a given percent. Returns a color, which can have toString called to get it's rgba() css value. */
  lighten(percent: number): Color {
    // No point in rewriting code we already have.
    return this.darken(-percent);
  }

  /**
   * Creates a color from the CSS hex color notation.
   */
  static fromHex(hex: string): Color {
    if (hex.length === 7) {
      return new Color(
        Number.parseInt(hex.slice(1, 3), 16),
        Number.parseInt(hex.slice(3, 5), 16),
        Number.parseInt(hex.slice(5, 7), 16),
      );
    }
    if (hex.length === 9) {
      return new Color(
        Number.parseInt(hex.slice(1, 3), 16),
        Number.parseInt(hex.slice(3, 5), 16),
        Number.parseInt(hex.slice(5, 7), 16),
        Number.parseInt(hex.slice(7, 9), 16) / 256,
      );
    }
    throw new Error('Invalid hex color format. Expected #RRGGBB or #RRGGBBAA.');
  }

  /**
   * Linear interpolation of two colors.
   */
  static lerp(c1: Color, c2: Color, n: number): Color {
    return new Color(
      (c2.r - c1.r) * n + c1.r,
      (c2.g - c1.g) * n + c1.g,
      (c2.b - c1.b) * n + c1.b,
      (c2.a - c1.a) * n + c1.a,
    );
  }

  /**
   * Loops up the color in the provided list of colors
   * with linear interpolation.
   */
  static lookup(value: number, colors: Color[]): Color {
    const len = colors.length;
    if (len < 2) {
      throw new Error('Needs at least two colors!');
    }
    const scaled = value * (len - 1);
    if (value < EPSILON) {
      return colors[0];
    }
    if (value >= 1 - EPSILON) {
      return colors[len - 1];
    }
    const ratio = scaled % 1;
    const index = scaled | 0;
    return Color.lerp(colors[index], colors[index + 1], ratio);
  }
}
