// Major scale fingerings: Na (3 notes on each string) and the 7 position patterns.
// Tests: _tests/scale-patterns.test.mjs (just test).
const Patterns = (() => {
  const STEPS = [0, 2, 4, 5, 7, 9, 11];      // major scale, semitones above the tonic
  const OPEN = [40, 45, 50, 55, 59, 64];     // E2 A2 D3 G3 B3 E4; string 0 is the low E

  // Fret of degree n on the low E string. Fret 0 becomes fret 12.
  const startFret = (tonic, n) => ((tonic + STEPS[n - 1] - 4 + 24) % 12) || 12;

  // The position pattern has 2 notes on the G string (3) if G starts on 1, 4 or 5; if not, on the B string (4).
  const shortString = (n) => ([1, 4, 5].includes(((n + 1) % 7) + 1) ? 3 : 4);

  const counts = (n, system) =>
    OPEN.map((_, s) => (system === 'position' && s === shortString(n) ? 2 : 3));

  // Consecutive scale notes from degree n on the low E string, put on the strings by `counts`.
  const layout = (tonic, n, system) => {
    const base = OPEN[0] + startFret(tonic, n) - STEPS[n - 1];
    const notes = [];
    counts(n, system).forEach((count, string) => {
      for (let i = 0; i < count; i++) {
        const index = notes.length;
        const d = n - 1 + index;
        const midi = base + STEPS[d % 7] + 12 * Math.floor(d / 7);
        notes.push({ index, string, fret: midi - OPEN[string], degree: (d % 7) + 1 });
      }
    });
    return notes;
  };

  const difference = (tonic, n) => {
    const na = layout(tonic, n, 'na');
    const moved = layout(tonic, n, 'position')
      .filter((p) => na[p.index].string !== p.string)
      .map((p) => ({
        degree: p.degree,
        from: { string: na[p.index].string, fret: na[p.index].fret },
        to: { string: p.string, fret: p.fret },
      }));
    const top = na[na.length - 1];
    return { moved, extra: { degree: top.degree, string: top.string, fret: top.fret }, shortString: shortString(n) };
  };

  // All scale notes between two frets (inclusive).
  const scaleNotes = (tonic, lo, hi) => {
    const out = [];
    OPEN.forEach((open, string) => {
      for (let fret = lo; fret <= hi; fret++) {
        const degree = STEPS.indexOf((open + fret - tonic + 120) % 12) + 1;
        if (degree) out.push({ string, fret, degree });
      }
    });
    return out;
  };

  // First degree of each Na string of pattern n, from low E to high e: each string starts 3 degrees higher.
  const stringStarts = (n) => OPEN.map((_, s) => ((n - 1 + 3 * s) % 7) + 1);

  // Pattern n + 1 starts on the second note that pattern n has on the low E string.
  const change = (tonic, n) => {
    const fromFret = startFret(tonic, n);
    const step = (STEPS[n % 7] - STEPS[n - 1] + 12) % 12;
    return { next: (n % 7) + 1, fromFret, toFret: fromFret + step };
  };

  return { startFret, shortString, layout, difference, scaleNotes, stringStarts, change };
})();
