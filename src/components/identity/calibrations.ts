// Calibraciones ópticas del wordmark. Unidades em; geometría medida en
// public/fonts/cabinet-grotesk.woff2 (UPM 1000) con fontTools en cada peso.
export type CalibrationId = '1' | '2' | '3';

interface Box {
  width: number;
  height: number;
  /** Centro horizontal desde el origen de la ı. */
  x: number;
  /** Borde inferior sobre la línea base. */
  bottom: number;
}

export interface Calibration {
  id: CalibrationId;
  name: string;
  intent: string;
  weight: number;
  studiosWeight: number;
  tracking: number;
  space: number;
  shape: 'tittle' | 'circle';
  dot: Box;
  /** Punto original de Cabinet en el mismo peso, como referencia. */
  tittle: Box;
}

const xHeight = 0.485;
const tittle600: Box = { width: 0.0996, height: 0.1105, x: 0.1122, bottom: 0.5595 };
const tittle620: Box = { width: 0.1022, height: 0.1111, x: 0.1127, bottom: 0.5589 };

export const calibrations: Calibration[] = [
  {
    id: '1',
    name: 'Punto original',
    intent: 'El punto de Cabinet, solo cambia de color. La referencia más fiel a la tipografía.',
    weight: 600,
    studiosWeight: 600,
    tracking: -0.04,
    space: 0.2,
    shape: 'tittle',
    dot: tittle600,
    tittle: tittle600,
  },
  {
    id: '2',
    name: 'Círculo óptico',
    intent: 'Círculo con la misma área que el punto original y el mismo centro. studios baja a 520.',
    weight: 600,
    studiosWeight: 520,
    tracking: -0.04,
    space: 0.2,
    shape: 'circle',
    dot: { width: 0.1184, height: 0.1184, x: 0.1122, bottom: 0.5556 },
    tittle: tittle600,
  },
  {
    id: '3',
    name: 'Círculo de señal',
    intent: 'Círculo un 11 % mayor y 0.01 em más alto; canario a 620, studios a 480, tracking más abierto.',
    weight: 620,
    studiosWeight: 480,
    tracking: -0.035,
    space: 0.22,
    shape: 'circle',
    dot: { width: 0.132, height: 0.132, x: 0.1127, bottom: 0.5585 },
    tittle: tittle620,
  },
];

export const defaultCalibration: CalibrationId = '2';

const em = (value: number) => `${value}em`;

export function calibrationCss(): string {
  return calibrations
    .map(({ id, weight, studiosWeight, tracking, space, shape, dot, tittle }) =>
      `[data-cal="${id}"]{--wm-w1:${weight};--wm-w2:${studiosWeight};--wm-track:${em(tracking)};--wm-space:${em(space)};` +
      `--wm-dot-w:${em(dot.width)};--wm-dot-h:${em(dot.height)};--wm-dot-x:${em(dot.x)};--wm-dot-y:${em(dot.bottom)};` +
      `--wm-dot-r:${shape === 'circle' ? '50%' : '0'};--wm-tit-w:${em(tittle.width)};--wm-tit-h:${em(tittle.height)};` +
      `--wm-tit-x:${em(tittle.x)};--wm-tit-y:${em(tittle.bottom)}}`)
    .join('\n');
}

const num = (value: number, digits = 3) => value.toFixed(digits).replace('-', '−');

/** Ficha legible de cada calibración. */
export function calibrationSpec(calibration: Calibration): [string, string][] {
  const { weight, studiosWeight, tracking, space, shape, dot, tittle } = calibration;
  const size = shape === 'circle' ? `Ø ${num(dot.width)} em` : `${num(dot.width)} × ${num(dot.height)} em`;
  const centre = dot.bottom + dot.height / 2;
  const originalCentre = tittle.bottom + tittle.height / 2;
  const lift = centre - originalCentre;
  return [
    ['Peso', `canario ${weight} · studios ${studiosWeight}`],
    ['Tracking', `${num(tracking)} em`],
    ['Espacio', `${num(space, 2)} em`],
    ['Punto', `${shape === 'circle' ? 'Círculo' : 'Original'} · ${size}`],
    ['Punto / asta', `${(dot.width / tittle.width).toFixed(2)}×`],
    ['Posición', Math.abs(lift) < 0.0005 ? 'Centro original' : `Centro ${lift > 0 ? '+' : '−'}${Math.abs(lift).toFixed(3)} em`],
    ['Aire sobre x', `${num(dot.bottom - xHeight)} em`],
  ];
}
