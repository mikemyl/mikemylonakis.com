---
title:  "Major scale patterns: Na and position"
permalink: /tools/major-scale-patterns/
excerpt: "Guitar cheatsheet: the 3-notes-per-string (Na) fingering next to the 7 position patterns, with scale degrees"
classes: wide
comments: false
share: false
last_modified_at: 2026-11-20T12:00:00+02:00
---
<style>
  .nsp {
    --ink: #17211c; --muted: #5d6b63; --line: #d3dad4; --surface: #ffffff;
    --board: #e7ebe5; --wire: #a3aea7; --string: #6f7c74;
    --dot: #17211c; --dot-ink: #ffffff;
    --root: #b3243f; --root-ink: #ffffff;
    --na: #1b6a86; --na-fill: #dcecf1;
    --pos: #9a5b00; --pos-fill: #f6e7c8;
    color: var(--ink); display: flex; flex-direction: column; gap: 1.75rem;
  }
  .nsp h2 { margin: 0; padding: 0; border: 0; font-size: 1.15em; }
  .nsp p { margin: 0; max-width: 65ch; }
  .nsp .lede { color: var(--muted); }
  .nsp section { display: flex; flex-direction: column; gap: 0.75rem; }
  .nsp ul, .nsp ol { margin: 0; }
  .nsp li { margin: 0; }

  .nsp .controls { display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; align-items: flex-end; }
  .nsp .field { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; }
  .nsp .label { margin: 0; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .nsp select {
    display: block; width: auto; margin: 0; font: inherit; font-size: 0.85rem; color: inherit; box-shadow: none;
    background: var(--surface); border: 1px solid var(--line); border-radius: 6px;
    padding: 0.4rem 0.6rem; height: auto; min-height: 2.6rem;
  }
  .nsp .seg { display: flex; border: 1px solid var(--line); border-radius: 6px; overflow: hidden; background: var(--surface); }
  .nsp .seg button {
    font: inherit; font-size: 0.85rem; color: inherit; margin: 0;
    background: none; border: 0; border-left: 1px solid var(--line); cursor: pointer;
    padding: 0.35rem 0.7rem; min-height: 2.6rem; min-width: 2.6rem;
    display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.1;
  }
  .nsp .seg button:first-child { border-left: 0; }
  .nsp .seg button b { font-weight: 600; font-size: 1.05rem; }
  .nsp .seg button small { font-size: 0.62rem; color: var(--muted); font-variant-numeric: tabular-nums; }
  .nsp .seg button[aria-pressed="true"] { background: var(--ink); color: var(--surface); }
  .nsp .seg button[aria-pressed="true"] small { color: inherit; opacity: 0.75; }
  .nsp .patterns { flex: 1 1 100%; }
  .nsp .patterns .seg button { flex: 1 1 0; padding-left: 0.2rem; padding-right: 0.2rem; }
  .nsp .check { display: flex; align-items: center; gap: 0.5rem; margin: 0; min-height: 2.6rem; font-size: 0.85rem; cursor: pointer; }
  .nsp .check input { width: 1.1rem; height: 1.1rem; margin: 0; accent-color: var(--root); }
  .nsp :focus-visible { outline: 2px solid var(--na); outline-offset: 2px; }

  .nsp .fig { display: flex; flex-direction: column; gap: 0.75rem; }
  .nsp .board { background: var(--board); border-radius: 10px; padding: 0.5rem; overflow-x: auto; }
  .nsp .board svg { display: block; width: 100%; height: auto; }
  .nsp .board text { font-variant-numeric: tabular-nums; text-anchor: middle; dominant-baseline: central; }
  .nsp .wire { stroke: var(--wire); }
  .nsp .str { stroke: var(--string); }
  .nsp .sname { fill: var(--muted); font-size: 13px; font-weight: 600; }
  .nsp .fnum { fill: var(--muted); font-size: 12px; }
  .nsp .fnum.mark { fill: var(--ink); font-weight: 700; }
  .nsp .ghost circle { fill: var(--board); }
  .nsp .ghost text { fill: var(--muted); font-size: 11px; }
  .nsp .link { stroke: var(--muted); stroke-width: 1.5; stroke-dasharray: 2 4; fill: none; }
  .nsp .dot circle { fill: var(--dot); stroke: var(--dot); stroke-width: 2; }
  .nsp .dot text { fill: var(--dot-ink); font-size: 14px; font-weight: 600; }
  .nsp .dot.root circle { fill: var(--root); stroke: var(--root); }
  .nsp .dot.root text { fill: var(--root-ink); }
  .nsp .dot.na circle { fill: var(--na-fill); stroke: var(--na); stroke-dasharray: 4 3; }
  .nsp .dot.na text { fill: var(--na); }
  .nsp .dot.pos circle { fill: var(--pos-fill); stroke: var(--pos); }
  .nsp .dot.pos text { fill: var(--pos); }
  .nsp .dim { opacity: 0.25; }
  .nsp .stack .dim { opacity: 0.45; }

  .nsp .legend { display: flex; flex-wrap: wrap; gap: 0.4rem 1.1rem; font-size: 0.8rem; color: var(--muted); list-style: none; padding: 0; }
  .nsp .legend li { display: flex; align-items: center; gap: 0.4rem; }
  .nsp .legend li[hidden] { display: none; }
  .nsp .sw { width: 0.95rem; height: 0.95rem; border-radius: 50%; border: 2px solid var(--dot); background: var(--dot); flex: none; box-sizing: border-box; }
  .nsp .sw.root { background: var(--root); border-color: var(--root); }
  .nsp .sw.na { background: var(--na-fill); border: 2px dashed var(--na); }
  .nsp .sw.pos { background: var(--pos-fill); border-color: var(--pos); }
  .nsp .sw.ghost { background: none; border: 0; font-size: 0.7rem; font-weight: 600; color: var(--muted); display: grid; place-items: center; }

  .nsp .facts { padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem; }
  .nsp .facts li { padding-left: 0.9rem; border-left: 2px solid var(--line); }
  .nsp .facts li.move { border-left-color: var(--pos); }
  .nsp .rules { padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem; max-width: 65ch; }
  .nsp .scroll { overflow-x: auto; }
  .nsp table { display: table; width: 100%; margin: 0; font-size: 0.85rem; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  .nsp thead { background: none; border: 0; }
  .nsp th, .nsp td { text-align: left; padding: 0.45rem 0.75rem 0.45rem 0; border: 0; border-bottom: 1px solid var(--line); background: none; white-space: nowrap; }
  .nsp th { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
  .nsp tr.current td { font-weight: 700; }
  .nsp tr.current td:first-child::before { content: "▸ "; color: var(--root); }
  .nsp .stack { max-width: 26rem; }
  .nsp .stack svg { display: block; width: 100%; height: auto; }
  .nsp .stack text { text-anchor: middle; dominant-baseline: central; font-variant-numeric: tabular-nums; }
  .nsp .sdeg { fill: var(--ink); font-size: 18px; font-weight: 700; }
  .nsp .sdeg.one { fill: var(--root); }
  .nsp .sdot { fill: var(--pos); }
  .nsp .unused { fill: var(--muted); font-size: 11px; }
  .nsp .note { color: var(--muted); font-size: 0.85rem; }
  .nsp .shift { fill: var(--na); font-size: 12px; font-weight: 600; }
  .nsp .shapes { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: 0.75rem 1.5rem; }
  .nsp .shape { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
  .nsp .shape b { font-size: 1.25rem; font-weight: 600; letter-spacing: 0.04em; }
  .nsp .shape span { color: var(--muted); font-size: 0.85rem; }
  .nsp .mono { font-variant-numeric: tabular-nums; }
</style>

<div class="nsp">
<p class="lede">Major scale patterns vs Na. Na has three notes on each string. The position pattern has two notes on one string, so the hand stays in one place. The numbers are scale degrees.</p>

  <div class="controls">
    <div class="field">
      <label class="label" for="key">Key</label>
      <select id="key"></select>
    </div>
    <div class="field">
      <span class="label" id="view-label">Show</span>
      <div class="seg" id="view" role="group" aria-labelledby="view-label">
        <button type="button" id="view-both" data-view="both">Both</button>
        <button type="button" id="view-na" data-view="na">Na</button>
        <button type="button" id="view-position" data-view="position">Position</button>
      </div>
    </div>
    <label class="check" for="chord"><input type="checkbox" id="chord"> Only 1, 3, 5</label>
    <div class="field patterns">
      <span class="label" id="pattern-label">Pattern</span>
      <div class="seg" id="pattern" role="group" aria-labelledby="pattern-label"></div>
    </div>
  </div>

  <div class="fig">
    <div class="board" id="board"></div>
    <ul class="legend">
      <li><span class="sw root"></span>Degree 1</li>
      <li id="lg-both"><span class="sw"></span>In the two fingerings</li>
      <li id="lg-na"><span class="sw na"></span>Na only</li>
      <li id="lg-pos"><span class="sw pos"></span>Position only</li>
      <li><span class="sw ghost">5</span>Scale note outside the pattern</li>
    </ul>
    <ul class="facts" id="facts" aria-live="polite"></ul>
  </div>

  <section>
    <h2 id="na-shapes">Na shapes for pattern <span id="stack-n"></span></h2>
    <div class="stack" id="stack"></div>
    <ul class="facts">
      <li>Law 1: a string that starts on this degree has this shape. Wide for 4, 1, 5. Tone and semitone for 2, 6. Semitone and tone for 3, 7.</li>
      <li>A row is a string. The row above is the next higher string. After the top row, continue from the bottom row.</li>
      <li>Law 2: on the B and e strings, move the shape one fret up the neck.</li>
      <li>The letters on the left are the strings of the selected pattern. There are seven rows and six strings, so each pattern leaves one row out. Select a different pattern and the letters move.</li>
    </ul>
  </section>

  <section>
    <h2 id="the-connection">The connection</h2>
    <ol class="rules">
      <li>Pattern <i>n</i> starts on degree <i>n</i> on the low E string. The two fingerings then play the same notes in the same order.</li>
      <li>Na changes string after each three notes. The hand moves up the neck.</li>
      <li>The position pattern changes string one note early, one time. It does this on the G string if the G string starts on degree 1, 4 or 5 (the wide shape). If not, it does this on the B string.</li>
      <li>The note that Na has as the third note goes to the next string: 4 frets lower from G to B, 5 frets lower from B to e. It is the same pitch.</li>
      <li>Result: the high e string has the same frets as the low E string, and Na has one more note at the top.</li>
    </ol>
  </section>

  <section>
    <h2 id="seven-patterns">Seven patterns in <span id="key-name"></span> major</h2>
    <div class="scroll">
      <table>
        <thead><tr><th>Pattern</th><th>Mode name</th><th>Low E fret</th><th>String with 2 notes</th><th>Notes that move</th><th>Na string starts</th></tr></thead>
        <tbody id="rows"></tbody>
      </table>
    </div>
    <p class="note">The mode name is a label for the pattern: it tells you the degree on which the pattern starts. It does not change the sound. Each pattern over a C major chord sounds as C major. The sound of a mode comes from the note that is home, not from the fingering.</p>
  </section>

  <section>
    <h2 id="how-to-practise">How to practise</h2>
    <ol class="rules">
      <li><b>One pattern, with the numbers.</b> Play it up and down slowly. Say the degree aloud on each note. Use "Na" first if the shapes help, then "Position".</li>
      <li><b>Find the 1s.</b> Play only degree 1 in the pattern, then only 1, 3, 5. These are the notes where a phrase can stop.</li>
      <li><b>Chain the patterns</b> (down one pattern, up the next). When you come down, the last three notes on the low E string are degrees <i>n</i>+2, <i>n</i>+1, <i>n</i>. The next pattern starts on <i>n</i>+1, the middle note. Move the first finger to it. Its Na row gives the shape on the low E string. Then go up the rows. <span id="change"></span></li>
      <li><b>The same change at the top.</b> The high e string has the same frets as the low E string. When you go up, the first finger moves to the second note on the e string, and you come down the next pattern.</li>
      <li><b>On a backing track.</b> Set "Only 1, 3, 5". Use two adjacent strings. Play short phrases with rests, and stop each phrase on 1, 3 or 5. Then add 2 and 6.</li>
      <li><b>Sing, then find.</b> Sing a short phrase. Find it in the pattern. Say its degrees.</li>
    </ol>
    <p>Five minutes are sufficient. The patterns are the map. The phrases come from the songs that you transcribe.</p>
  </section>
</div>

<script type="text/javascript" src="{{site.baseurl}}/assets/js/mike/scale-patterns.js"></script>
<script type="text/javascript" src="{{site.baseurl}}/assets/js/mike/scale-patterns-page.js"></script>
