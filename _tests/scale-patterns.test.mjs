// Run: just test
// Oracles: Korey Hicks's seven C major position tabs (TGIAY weeks 31, 32, 38), the standard
// 3-notes-per-string fingering, and the major scale step formula. None comes from the page code.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL("../assets/js/mike/scale-patterns.js", import.meta.url), "utf8");
const P = new Function(`${src}; return Patterns;`)();

const C = 0, A = 9;
// Strings in the order low E, A, D, G, B, high e.
const frets = (tonic, n, system) => {
  const rows = [[], [], [], [], [], []];
  for (const note of P.layout(tonic, n, system)) rows[note.string].push(note.fret);
  return rows;
};

const KOREY_C = {
  1: [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12], [8, 10, 12]],
  2: [[10, 12, 13], [10, 12, 14], [10, 12, 14], [10, 12], [10, 12, 13], [10, 12, 13]],
  3: [[12, 13, 15], [12, 14, 15], [12, 14, 15], [12, 14], [12, 13, 15], [12, 13, 15]],
  4: [[1, 3, 5], [2, 3, 5], [2, 3, 5], [2, 4, 5], [3, 5], [1, 3, 5]],
  5: [[3, 5, 7], [3, 5, 7], [3, 5, 7], [4, 5, 7], [5, 6], [3, 5, 7]],
  6: [[5, 7, 8], [5, 7, 8], [5, 7, 9], [5, 7], [5, 6, 8], [5, 7, 8]],
  7: [[7, 8, 10], [7, 8, 10], [7, 9, 10], [7, 9, 10], [8, 10], [7, 8, 10]],
};

for (const [n, tab] of Object.entries(KOREY_C)) {
  test(`position pattern ${n} in C is Korey's tab`, () => {
    assert.deepEqual(frets(C, Number(n), 'position'), tab);
  });
}

test('position pattern 1 in A is at fret 5', () => {
  assert.deepEqual(frets(A, 1, 'position'),
    [[5, 7, 9], [5, 7, 9], [6, 7, 9], [6, 7, 9], [7, 9], [5, 7, 9]]);
});

test('Na pattern 1 in C is the standard 3-notes-per-string fingering', () => {
  assert.deepEqual(frets(C, 1, 'na'),
    [[8, 10, 12], [8, 10, 12], [9, 10, 12], [9, 10, 12], [10, 12, 13], [10, 12, 13]]);
});

test('Na: each string has the shape of its first degree, in each key', () => {
  const shape = { 1: [2, 2], 4: [2, 2], 5: [2, 2], 2: [2, 1], 6: [2, 1], 3: [1, 2], 7: [1, 2] };
  for (let tonic = 0; tonic < 12; tonic++) {
    for (let n = 1; n <= 7; n++) {
      const notes = P.layout(tonic, n, 'na');
      assert.equal(notes.length, 18);
      for (let s = 0; s < 6; s++) {
        const [a, b, c] = notes.filter((x) => x.string === s);
        assert.deepEqual([b.fret - a.fret, c.fret - b.fret], shape[a.degree]);
      }
    }
  }
});

test('each note is in the scale and has the correct degree, in each key', () => {
  const open = [40, 45, 50, 55, 59, 64];
  const steps = [0, 2, 4, 5, 7, 9, 11];
  for (let tonic = 0; tonic < 12; tonic++) {
    for (let n = 1; n <= 7; n++) {
      for (const system of ['na', 'position']) {
        const notes = P.layout(tonic, n, system);
        assert.equal(notes[0].degree, n);
        for (const x of notes) {
          assert.equal((open[x.string] + x.fret - tonic) % 12, steps[x.degree - 1]);
          assert.ok(x.fret >= 1 && x.fret <= 19);
        }
      }
    }
  }
});

test('position pattern: 17 notes, the high e string is equal to the low E string', () => {
  for (let n = 1; n <= 7; n++) {
    const rows = frets(C, n, 'position');
    assert.equal(rows.flat().length, 17);
    assert.deepEqual(rows[5], rows[0]);
  }
});

test('difference, pattern 1 in C: degree 1 moves from B fret 13 to e fret 8', () => {
  const d = P.difference(C, 1);
  assert.deepEqual(d.moved, [{ degree: 1, from: { string: 4, fret: 13 }, to: { string: 5, fret: 8 } }]);
  assert.deepEqual(d.extra, { degree: 4, string: 5, fret: 13 });
  assert.equal(d.shortString, 4);
});

test('difference, pattern 2 in C: two notes move down one string', () => {
  const d = P.difference(C, 2);
  assert.deepEqual(d.moved, [
    { degree: 6, from: { string: 3, fret: 14 }, to: { string: 4, fret: 10 } },
    { degree: 2, from: { string: 4, fret: 15 }, to: { string: 5, fret: 10 } },
  ]);
  assert.equal(d.shortString, 3);
});

test('a moved note keeps its pitch', () => {
  const open = [40, 45, 50, 55, 59, 64];
  for (let tonic = 0; tonic < 12; tonic++) {
    for (let n = 1; n <= 7; n++) {
      for (const m of P.difference(tonic, n).moved) {
        assert.equal(open[m.from.string] + m.from.fret, open[m.to.string] + m.to.fret);
      }
    }
  }
});

// Oracle: the low E frets of Korey's tabs (pattern 2 at fret 10, pattern 1 at 8, pattern 4 at 1 = 13 - 12).
test('change to the next pattern: the first finger goes to the second note on the low E string', () => {
  assert.deepEqual(P.change(C, 1), { next: 2, fromFret: 8, toFret: 10 });
  assert.deepEqual(P.change(C, 3), { next: 4, fromFret: 12, toFret: 13 });
  assert.deepEqual(P.change(C, 7), { next: 1, fromFret: 7, toFret: 8 });
});

// Oracle: the Na diagram (rows 4 1 5 2 6 3 7 from the top; a row is a string, the row above is the next higher string).
test('Na string starts: pattern 1 uses the rows 1 4 7 3 6 2 from low E to high e', () => {
  assert.deepEqual(P.stringStarts(1), [1, 4, 7, 3, 6, 2]);
  assert.deepEqual(P.stringStarts(7), [7, 3, 6, 2, 5, 1]);
});
