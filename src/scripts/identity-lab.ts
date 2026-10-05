// Controles de la hoja de identidad. El estado vive en <html data-*> y en la URL
// para poder compartir o capturar una combinación concreta (?cal=2&open=b).
type Choice = 'cal' | 'open' | 'dot';

const root = document.documentElement;
const options: Record<Choice, string[]> = { cal: ['1', '2', '3'], open: ['a', 'b'], dot: ['ink', 'canary'] };
const names: Record<Choice, Record<string, string>> = {
  cal: { '1': 'C1, punto original', '2': 'C2, círculo óptico', '3': 'C3, círculo de señal' },
  open: { a: 'Apertura A, solo wordmark', b: 'Apertura B, con metadata' },
  dot: { ink: 'Signal Dot en tinta sobre warm white', canary: 'Signal Dot canary sobre warm white' },
};

const params = new URLSearchParams(location.search);
const pick = (key: Choice) => {
  const value = params.get(key);
  return value && options[key].includes(value) ? value : root.dataset[key] ?? options[key][0];
};
const state = { cal: pick('cal'), open: pick('open'), dot: pick('dot'), grid: params.get('grid') === '1', clean: params.get('clean') === '1' };

const panel = document.querySelector<HTMLDetailsElement>('#lab-panel');
const summary = document.querySelector<HTMLElement>('[data-lab-state]');
const live = document.querySelector<HTMLElement>('[data-lab-live]');
const restore = document.querySelector<HTMLButtonElement>('[data-lab-restore]');

function render(message?: string) {
  root.dataset.cal = state.cal;
  root.dataset.open = state.open;
  root.dataset.dot = state.dot;
  root.toggleAttribute('data-grid', state.grid);
  root.toggleAttribute('data-clean', state.clean);
  panel?.querySelectorAll<HTMLInputElement>('input').forEach(input => {
    input.checked = input.type === 'checkbox' ? state.grid : state[input.name as Choice] === input.value;
  });
  document.querySelectorAll<HTMLButtonElement>('[data-set-cal]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.setCal === state.cal));
  });
  if (summary) summary.textContent = `C${state.cal} · Apertura ${state.open.toUpperCase()}`;
  const query = new URLSearchParams({ cal: state.cal, open: state.open, dot: state.dot });
  if (state.grid) query.set('grid', '1');
  if (state.clean) query.set('clean', '1');
  history.replaceState(null, '', `${location.pathname}?${query}${location.hash}`);
  if (message && live) live.textContent = message;
}

function choose(key: Choice, value: string) {
  if (!options[key].includes(value) || state[key] === value) return;
  state[key] = value;
  render(names[key][value]);
}

function setGrid(visible: boolean) {
  state.grid = visible;
  render(visible ? 'Columnas visibles' : 'Columnas ocultas');
}

function setClean(clean: boolean) {
  const focusInside = panel?.contains(document.activeElement);
  state.clean = clean;
  render(clean ? 'Interfaz de revisión oculta. Pulsa H para mostrarla.' : 'Interfaz de revisión visible');
  if (clean && focusInside) restore?.focus();
  if (!clean && document.activeElement === restore) panel?.querySelector('summary')?.focus();
}

panel?.addEventListener('change', event => {
  const input = event.target as HTMLInputElement;
  if (input.type === 'checkbox') setGrid(input.checked);
  else choose(input.name as Choice, input.value);
});
document.querySelectorAll<HTMLButtonElement>('[data-set-cal]').forEach(button => {
  button.addEventListener('click', () => choose('cal', button.dataset.setCal ?? ''));
});
restore?.addEventListener('click', () => setClean(false));

addEventListener('keydown', event => {
  if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return;
  const key = event.key.toLowerCase();
  if (options.cal.includes(key)) choose('cal', key);
  else if (key === 'a' || key === 'b') choose('open', key);
  else if (key === 'g') setGrid(!state.grid);
  else if (key === 'h') setClean(!state.clean);
});

render();
