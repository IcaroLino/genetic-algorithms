export default function objectiveFn(x: number, y: number): number {
    const z = -x * Math.sin(Math.sqrt(Math.abs(x))) - y * Math.sin(Math.sqrt(Math.abs(y)));

    const xZsh = x / 50;
    const yZsh = y / 50;
    const xr = x / 250;
    const yr = y / 250;

    const r = 100 * Math.pow((yr - Math.pow(xr, 2)), 2) + Math.pow((1 - xr), 2);
    const r1 = Math.pow((yr - Math.pow(xr, 2)), 2) + Math.pow((1 - xr), 2);
    const x1 = 25 * xr;
    const x2 = 25 * yr;
    const a = 500;
    const b = 0.1;
    const c = 0.5 * Math.PI;
    const F10 = -a * Math.exp(-b * Math.sqrt((Math.pow(x1, 2) + Math.pow(x2, 2)) / 2))
                    - Math.exp((Math.cos(c * x1) + Math.cos(c * x2)) / 2) + Math.exp(1);

    const zsh = 0.5 - (Math.pow(Math.sin(Math.sqrt(Math.pow(xZsh, 2) + Math.pow(yZsh, 2))), 2) - 0.5)
                    / Math.pow((1 + 0.1 * (Math.pow(xZsh, 2) + Math.pow(yZsh, 2))), 2);

    const fObj = F10 * zsh;

    const w4 = Math.sqrt(Math.pow(r, 2) + Math.pow(z, 2)) + fObj;
    const w14 = z * Math.exp(Math.sin(r1));
    const w17 = -w14 + w4;

    return -w17;
}

// return x * Math.sin(10 * Math.PI * x) + 1;
// return Math.pow(x, 2) - 3 * x + 4;
