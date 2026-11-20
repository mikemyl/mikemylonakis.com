(() => {
  const KEYS = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
  const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e'];
  const MARKS = [3, 5, 7, 9, 12, 15, 17, 19];
  const CHORD = [1, 3, 5];
  const MODES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
  const $ = (id) => document.getElementById(id);

  const state = { key: 0, n: 1, view: 'both', chord: false };
  try { Object.assign(state, JSON.parse(localStorage.getItem('na-position') || '{}')); } catch (e) { /* no storage */ }
  const save = () => { try { localStorage.setItem('na-position', JSON.stringify(state)); } catch (e) { /* no storage */ } };

  const CW = 54, SG = 36, X0 = 30, Y0 = 26, R = 13;

  function drawBoard() {
    const na = Patterns.layout(state.key, state.n, 'na');
    const pos = Patterns.layout(state.key, state.n, 'position');
    const all = [...na, ...pos].map((x) => x.fret);
    const lo = Math.max(0, Math.min(...all) - 1), hi = Math.max(...all) + 1;
    const cols = hi - lo + 1;
    const W = X0 + cols * CW + 8, H = Y0 + 5 * SG + 44;
    const cx = (fret) => X0 + (fret - lo + 0.5) * CW;
    const cy = (string) => Y0 + (5 - string) * SG;
    const id = (x) => `${x.string}:${x.fret}`;
    const inNa = new Set(na.map(id)), inPos = new Set(pos.map(id));

    let shown;
    if (state.view === 'na') shown = na.map((x) => ({ ...x, kind: 'both' }));
    else if (state.view === 'position') shown = pos.map((x) => ({ ...x, kind: 'both' }));
    else shown = [
      ...na.map((x) => ({ ...x, kind: inPos.has(id(x)) ? 'both' : 'na' })),
      ...pos.filter((x) => !inNa.has(id(x))).map((x) => ({ ...x, kind: 'pos' })),
    ];
    const shownIds = new Set(shown.map(id));
    const dim = (degree) => (state.chord && !CHORD.includes(degree) ? ' dim' : '');

    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fretboard, pattern ${state.n} in ${KEYS[state.key]} major">`;
    for (let c = 0; c <= cols; c++) {
      const x = X0 + c * CW, nut = lo === 0 && c === 1;
      s += `<line class="wire" x1="${x}" x2="${x}" y1="${Y0}" y2="${Y0 + 5 * SG}" stroke-width="${nut ? 5 : 2}"/>`;
    }
    for (let st = 0; st < 6; st++) {
      s += `<line class="str" x1="${X0}" x2="${W - 8}" y1="${cy(st)}" y2="${cy(st)}" stroke-width="${2.6 - st * 0.32}"/>`;
      s += `<text class="sname" x="13" y="${cy(st)}">${STRINGS[st]}</text>`;
    }
    for (let f = lo; f <= hi; f++) {
      s += `<text class="fnum${MARKS.includes(f) ? ' mark' : ''}" x="${cx(f)}" y="${Y0 + 5 * SG + 28}">${f}</text>`;
    }
    for (const g of Patterns.scaleNotes(state.key, lo, hi)) {
      if (shownIds.has(id(g))) continue;
      s += `<g class="ghost${dim(g.degree)}"><circle cx="${cx(g.fret)}" cy="${cy(g.string)}" r="8"/><text x="${cx(g.fret)}" y="${cy(g.string)}">${g.degree}</text></g>`;
    }
    if (state.view === 'both') {
      for (const m of Patterns.difference(state.key, state.n).moved) {
        s += `<line class="link" x1="${cx(m.from.fret)}" y1="${cy(m.from.string)}" x2="${cx(m.to.fret)}" y2="${cy(m.to.string)}"/>`;
      }
    }
    for (const d of shown) {
      const cls = d.kind === 'both' ? (d.degree === 1 ? 'root' : '') : d.kind;
      s += `<g class="dot ${cls}${dim(d.degree)}"><circle cx="${cx(d.fret)}" cy="${cy(d.string)}" r="${R}"/><text x="${cx(d.fret)}" y="${cy(d.string)}">${d.degree}</text></g>`;
    }
    $('board').innerHTML = s + '</svg>';
  }

  function drawFacts() {
    const d = Patterns.difference(state.key, state.n);
    const at = (p) => `${STRINGS[p.string]} string, fret ${p.fret}`;
    const items = [
      `<li>Pattern ${state.n} starts on degree ${state.n}: low E string, fret ${Patterns.startFret(state.key, state.n)}. The position pattern has two notes on the ${STRINGS[d.shortString]} string.</li>`,
      ...d.moved.map((m) => `<li class="move">Degree ${m.degree}: Na has it on the ${at(m.from)}. The position pattern has it on the ${at(m.to)}. Same pitch.</li>`),
      `<li>Na has one more note at the top: degree ${d.extra.degree}, ${at(d.extra)}.</li>`,
    ];
    $('facts').innerHTML = items.join('');
  }

  function drawTable() {
    $('key-name').textContent = KEYS[state.key];
    $('rows').innerHTML = [1, 2, 3, 4, 5, 6, 7].map((n) => {
      const d = Patterns.difference(state.key, n);
      const starts = Patterns.layout(state.key, n, 'na').filter((x) => x.index % 3 === 0).map((x) => x.degree).join(' ');
      return `<tr class="${n === state.n ? 'current' : ''}"><td>${n}</td><td>${MODES[n - 1]}</td><td>${Patterns.startFret(state.key, n)}</td><td>${STRINGS[d.shortString]}</td><td>${d.moved.map((m) => m.degree).join(', ')}</td><td class="mono">${starts}</td></tr>`;
    }).join('');
  }

  // The Na diagram: one row for each first degree, the row above is the next higher string.
  const STACK = [4, 1, 5, 2, 6, 3, 7];
  const SHAPE = { 1: [0, 2, 4], 4: [0, 2, 4], 5: [0, 2, 4], 2: [0, 2, 3], 6: [0, 2, 3], 3: [0, 1, 3], 7: [0, 1, 3] };

  function drawStack() {
    const starts = Patterns.stringStarts(state.n);
    const RH = 34, W = 400, H = STACK.length * RH + 8;
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Na shapes, with the strings of pattern ${state.n}">`;
    STACK.forEach((degree, row) => {
      const y = 4 + RH * (row + 0.5), string = starts.indexOf(degree);
      s += `<g class="${string < 0 ? 'dim' : ''}">`;
      s += `<text class="sname" x="16" y="${y}">${string < 0 ? '' : STRINGS[string]}</text>`;
      s += `<text class="sdeg${degree === 1 ? ' one' : ''}" x="56" y="${y}">${degree}</text>`;
      s += `<line class="str" x1="84" x2="300" y1="${y}" y2="${y}" stroke-width="1.5"/>`;
      for (const off of SHAPE[degree]) s += `<circle class="sdot" cx="${104 + off * 44}" cy="${y}" r="8"/>`;
      if (string >= 4) s += `<text class="shift" x="350" y="${y}">→ 1 fret</text>`;
      if (string < 0) s += `<text class="unused" x="350" y="${y}">not in pattern ${state.n}</text>`;
      s += '</g>';
    });
    $('stack').innerHTML = s + '</svg>';
    $('stack-n').textContent = state.n;
  }

  function drawPractice() {
    const c = Patterns.change(state.key, state.n);
    const lower = c.toFret > 12 ? ` (or fret ${c.toFret - 12}, one octave lower)` : '';
    $('change').textContent = `Now: pattern ${state.n} to pattern ${c.next} in ${KEYS[state.key]} major. `
      + `The first finger goes from fret ${c.fromFret} to fret ${c.toFret}${lower}, on degree ${c.next}.`;
  }

  function drawControls() {
    $('key').value = String(state.key);
    $('chord').checked = state.chord;
    $('pattern').innerHTML = [1, 2, 3, 4, 5, 6, 7].map((n) =>
      `<button type="button" id="pattern-${n}" data-n="${n}" aria-pressed="${n === state.n}"><b>${n}</b><small>fret ${Patterns.startFret(state.key, n)}</small></button>`).join('');
    for (const b of $('view').children) b.setAttribute('aria-pressed', String(b.dataset.view === state.view));
    $('lg-both').hidden = state.view !== 'both';
    $('lg-na').hidden = state.view !== 'both';
    $('lg-pos').hidden = state.view !== 'both';
  }

  function render() { drawControls(); drawBoard(); drawFacts(); drawTable(); drawStack(); drawPractice(); save(); }

  $('key').innerHTML = KEYS.map((k, i) => `<option value="${i}">${k} major</option>`).join('');
  $('key').addEventListener('change', (e) => { state.key = Number(e.target.value); render(); });
  $('chord').addEventListener('change', (e) => { state.chord = e.target.checked; render(); });
  $('pattern').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    state.n = Number(b.dataset.n); render(); $(`pattern-${state.n}`).focus();
  });
  $('view').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    state.view = b.dataset.view; render();
  });
  render();
})();
