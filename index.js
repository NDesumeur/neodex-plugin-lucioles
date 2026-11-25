// Lucioles : Un pré la nuit : toucher une luciole l'allume ou l'éteint, elle et ses quatre voisines. Allume-les toutes.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Lucioles</span><span class="hint">Clic sur une luciole</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="288" height="216" role="img" aria-label="Pré des lucioles"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="luPrev">◀</button><button class="btn" id="luNext">▶</button><button class="btn" id="gFs">PLEIN ÉCRAN</button></div>
      
      <div class="row"><button class="btn" id="luDaily">PRÉ DU JOUR</button><button class="btn" id="luMath">LA SOLUTION EXPLIQUÉE</button></div>
      <div class="hint luTip" id="luTip"></div>
      <div class="hint">Chaque touche inverse la luciole et celles juste au-dessus, au-dessous, à gauche et à droite.</div><div class="hint">Trois étoiles si tu finis en autant de coups que le jeu (ou moins).</div>
    </div></div>
</div>`;
const CSS = `.luTip{background:#0e1a24;color:#e8f0ff;border-left:4px solid #c8ff7a;padding:6px 10px}
.luTip:empty{display:none}
.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(300px,calc((100vh - 190px) * 288 / 216)));height:auto;aspect-ratio:288/216}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 288 / 216))}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "LUCIOLES", T: {"k": "#050c06", "k2": "#0c1a0e", "fill": "#142a18", "fillOn": "#1c3a22", "hl": "#24482a", "line": "#3a6a40", "acc": "#ffd84a", "accL": "#fff4b0", "accS": "#c49a1a", "accD": "#4a3a06", "rivet": "#fff4b0", "btn": "#24482a", "btnHi": "#5a9a5a", "btnLo": "#0c1a0e", "btnHov": "#2a5430", "btnHovHi": "#7aba7a", "text": "#f0fff0", "muted": "#b0d0a8", "acc2": "#c8ff7a", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#060e08", "bgDot": "#142a18", "bgDot2": "#0c1a0e", "spark": "#3a6a40", "spark2": "#c8ff7a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["..w.....w...", ".wmw...wmw..", "..wmw.wmw...", "....kkk.....", "...kbbbk....", "...kbbbk....", "...kgggk....", "..kgnnngk...", "..kgnnngk...", "...kgggk....", "....kkk.....", "............"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 288, H = 216, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
/* ---------- Lucioles : un pré la nuit ; toucher une luciole l'allume ou l'éteint, elle et ses quatre voisines. Il faut toutes les allumer. ---------- */
const LU = {N: 5, C: 36, X: 54, Y: 30};
// des lucioles plus grandes, de profil (un œil) : l'abdomen qui brille à gauche, la tête à droite, les ailes qui battent en trois temps
const LU_BODY = ['...kkkkkkkk....', '..kYYYkbbbbkk..', '.kYyyYkbbbbbek.', '.kYyyYkbbbbbbk.', '..kYYYkbbbbkk..', '...kkkkk.k.k...'];
const LU_WINGS = [['.....w...w.....', '....wWw.wWw....', '....wWWwWWw....', '.....wWWWw.....', '......wWw......', '.......k.......'],
  ['...............', '...............', '..wwww...wwww..', '.wWWWWw.wWWWWw.', '..wwwwWkWwwww..', '.......k.......'],
  ['...............', '...............', '...............', '...wwww.wwww...', '..wWWWWkWWWWw..', '...wwwwkwwww...']];
const LU_PAL = {k: '#05010b', w: '#e8f0ff', W: '#a8b8e0', b: '#3a2a20', e: '#e8f0ff', Y: '#ffd84a', y: '#fff4a0'};
const LU_ON = LU_WINGS.map(wg => spr([...wg, ...LU_BODY], LU_PAL));
const LU_OFF = spr(['...............', '...............', '...............', '...............', '...............', '....wwwwwww....', ...LU_BODY], {...LU_PAL, w: '#4a5468', Y: '#3a4a2e', y: '#4a5a3a', e: '#8a94a8'});  // posée, ailes repliées, éteinte
const lus = gstore('lucioles', {level: 1, top: 1, stars: 0, games: 0}); lus.daily ??= {last: '', streak: 0, best: 0};
const luDay = (k = 0) => { const d = new Date(Date.now() - k * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
// la solution par l'algèbre : toucher deux fois une case l'annule, donc seul compte « touchée ou pas » (0 ou 1, calcul modulo 2).
// Chaque luciole donne une équation : la somme des touches sur elle et ses voisines doit valoir 1 si elle est éteinte, 0 sinon.
// On résout ce système par élimination (comme au collège, avec 1 + 1 = 0), puis on garde la solution qui demande le moins de touches.
function luSolve(b) {
  const N = b.length, M = N * N, rows = [];
  for (let i = 0; i < M; i++) { const x = i % N, y = Math.floor(i / N), r = Array(M + 1).fill(0); for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, c = y + dy; if (a >= 0 && c >= 0 && a < N && c < N) r[c * N + a] = 1; } r[M] = b[y][x] ? 0 : 1; rows.push(r); }
  const piv = []; let rk = 0;
  for (let col = 0; col < M && rk < M; col++) { const p = rows.findIndex((r, k) => k >= rk && r[col]); if (p < 0) continue; [rows[rk], rows[p]] = [rows[p], rows[rk]];
    for (let k = 0; k < M; k++) if (k !== rk && rows[k][col]) for (let j = col; j <= M; j++) rows[k][j] ^= rows[rk][j]; piv.push(col); rk++; }
  if (rows.slice(rk).some(r => r[M])) return null;  // pas de solution (n'arrive pas : les prés partent d'un pré allumé)
  const free = [...Array(M).keys()].filter(c => !piv.includes(c)); let best = null;
  for (let m = 0; m < 1 << free.length; m++) { const s = Array(M).fill(0); free.forEach((c, k) => s[c] = m >> k & 1);
    piv.forEach((c, k) => { let v = rows[k][M]; for (const f of free) if (rows[k][f]) v ^= s[f]; s[c] = v; });
    if (!best || s.filter(Boolean).length < best.filter(Boolean).length) best = s; }
  return {press: best, eq: M, rank: rk, free: free.length};
}
const luToggle = (b, x, y) => { for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = x + dx, c = y + dy; if (a >= 0 && c >= 0 && a < LU.N && c < LU.N) b[c][a] = !b[c][a]; } };
let lu = null;
function luNew(level = lus.level, daily = false) {
  if (!daily) { lus.level = level; saveGames(); } $('luTip').textContent = ''; luShow = null;
  const b = [...Array(LU.N)].map(() => Array(LU.N).fill(true)), r = seeded(daily ? +luDay().replace(/-/g, '') : level * 7919), presses = new Set();
  while (presses.size < (daily ? 9 : Math.min(12, 2 + level))) presses.add(Math.floor(r() * 25));  // partir du pré tout allumé et toucher quelques lucioles : toujours faisable
  for (const p of presses) luToggle(b, p % 5, Math.floor(p / 5));
  if (b.every(r => r.every(v => v))) luToggle(b, 2, 2);
  lu = Object.assign(lu || {tick: 0, raf: 0}, {mode: 'play', b, par: presses.size, presses: [...presses], moves: 0, wonAt: 0, hover: null, sparks: [], lift: b.map(r => r.map(v => v ? 1 : 0)), daily});
  luInfo();
}
let luShow = null;  // les cases de la solution expliquée, montrées sur le pré
function luPress(x, y) {
  if (lu.mode !== 'play') return; if (luShow) { luShow = null; $('luTip').textContent = ''; } luToggle(lu.b, x, y); lu.moves++; beep(lu.b[y][x] ? 880 : 440, .08, 'triangle', lu.b[y][x] ? 1320 : 330, .06);
  if (lu.b.every(r => r.every(v => v))) {
    lu.mode = 'won'; lu.wonAt = lu.tick; const st = lu.moves <= lu.par ? 3 : lu.moves <= lu.par + 3 ? 2 : 1; lu.stars = st; lus.stars += st; lus.games++;
    if (lu.daily) { const d = lus.daily; if (d.last !== luDay()) { d.streak = d.last === luDay(1) ? d.streak + 1 : 1; d.best = Math.max(d.best, d.streak); d.last = luDay(); } }
    else { if (lus.level >= lus.top) lus.top = lus.level + 1; best('lucioles', lus.level); } saveGames(); luInfo();
    [659, 784, 988, 1319].forEach((f, k) => setTimeout(() => beep(f, .18, 'triangle'), k * 100));
  }
}
const LU_BG = cnv(W, H, b => {  // le ciel, la lune, les herbes hautes
  for (let y = 0; y < H; y++) { const c = y < 60 ? ['#0a0f26', '#0d1430', '#121c42'][Math.floor(y / 20)] : y < 190 ? '#0e1a24' : '#0a1418'; px(b, c, 0, y, W, 1); }
  for (let y = 0; y < 70; y++) for (let x = 0; x < W; x++) if ((x + y) % 2 === 0 && y % 20 > 16) px(b, '#121c42', x, y);
  const r = seeded(3); for (let i = 0; i < 40; i++) px(b, r() < .3 ? '#ffffff' : '#6a7ab0', Math.floor(r() * W), Math.floor(r() * 50));
  for (let y = -8; y <= 8; y++) for (let x = -8; x <= 8; x++) if (Math.hypot(x, y) <= 8) px(b, Math.hypot(x - 2, y + 2) < 2 ? '#e8e0c8' : '#fff4dc', 256 + x, 46 + y);
  for (let x = 0; x < W; x += 2) { const h = 6 + Math.floor(r() * 14); px(b, '#1a3a24', x, H - h, 1, h); px(b, '#2a5a34', x + 1, H - h + 3, 1, h - 3); }
  for (let x = 0; x < W; x += 3) { const h = 3 + Math.floor(r() * 10); px(b, '#12301c', x, 190 - h, 1, h); }
  px(b, '#05010b', LU.X - 5, LU.Y - 5, LU.N * LU.C + 10, LU.N * LU.C + 10); px(b, '#162a20', LU.X - 4, LU.Y - 4, LU.N * LU.C + 8, LU.N * LU.C + 8);
  for (let y = 0; y < LU.N; y++) for (let x = 0; x < LU.N; x++) { const cx = LU.X + x * LU.C, cy = LU.Y + y * LU.C; px(b, (x + y) % 2 ? '#1c3828' : '#1a3424', cx, cy, LU.C, LU.C); for (let k = 0; k < 6; k++) px(b, '#24482e', cx + 3 + k * 6, cy + LU.C - 3 - (k % 3), 1, 2 + (k % 3));
    px(b, '#2e5a34', cx + 17, cy + 26, 1, 9); px(b, '#3a6a3e', cx + 16, cy + 26, 3, 1); }  // la tige où la luciole se pose
});
function luDraw() {
  g.drawImage(LU_BG, 0, 0);
  const won = lu.mode === 'won' ? lu.tick - lu.wonAt : 0;
  for (let y = 0; y < LU.N; y++) for (let x = 0; x < LU.N; x++) {
    const on = lu.b[y][x], l = lu.lift[y][x] += ((on ? 1 : 0) - lu.lift[y][x]) * .12, ph = x * 1.7 + y * 2.3;  // l : 0 posée sur sa tige, 1 en vol (elle décolle ou se repose en douceur)
    const cx = Math.round(LU.X + x * LU.C + 10 + Math.sin(lu.tick / 23 + ph) * 3 * l), cy = Math.round(LU.Y + y * LU.C + 14 - l * 7 + Math.sin(lu.tick / 11 + ph) * 2 * l);  // elle volette en petites boucles
    if (l > .5) { const R = Math.round((10 + Math.sin(lu.tick / 9 + x + y * 2)) * l); for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) { const d = Math.hypot(dx, dy); if (d <= R && (dx + dy + lu.tick) % 2 === 0 && (d < R * .55 || (dx * 3 + dy) % 4 === 0)) px(g, d < R * .55 ? '#3a5a2a' : '#2a4a26', cx + 4 + dx, cy + 8 + dy); } }  // le halo, tramé, autour de l'abdomen
    g.drawImage(l > .5 ? LU_ON[[0, 1, 2, 1][Math.floor(lu.tick / 3 + x * 2 + y) % 4]] : LU_OFF, cx, cy);
    if (l > .5 && (lu.tick + x * 7 + y * 3) % 40 < 3) px(g, '#ffffff', cx + 3, cy + 8, 1, 1);  // l'abdomen scintille
    if (lu.hover && lu.mode === 'play' && Math.abs(lu.hover[0] - x) + Math.abs(lu.hover[1] - y) <= 1) { px(g, '#ffd84a', LU.X + x * LU.C, LU.Y + y * LU.C, LU.C, 1); px(g, '#ffd84a', LU.X + x * LU.C, LU.Y + y * LU.C + LU.C - 1, LU.C, 1); }
  }
  if (luShow && lu.mode === 'play') luShow.forEach((v, i) => { if (!v) return; const X = LU.X + (i % LU.N) * LU.C, Y = LU.Y + Math.floor(i / LU.N) * LU.C, c = (lu.tick >> 3) % 2 ? '#c8ff7a' : '#ffffff';
    px(g, c, X + 2, Y + 2, 6, 2); px(g, c, X + 2, Y + 2, 2, 6); px(g, c, X + LU.C - 8, Y + 2, 6, 2); px(g, c, X + LU.C - 4, Y + 2, 2, 6); px(g, c, X + 2, Y + LU.C - 4, 6, 2); px(g, c, X + 2, Y + LU.C - 8, 2, 6); px(g, c, X + LU.C - 8, Y + LU.C - 4, 6, 2); px(g, c, X + LU.C - 4, Y + LU.C - 8, 2, 6); });
  pxFont(g, lu.daily ? 'PRÉ DU JOUR' : 'PRÉ ' + lus.level, 8, 16, '#c8ff7a', 8); pxFont(g, lu.moves + ' / ' + lu.par + ' coups', W - 8, 16, '#a8b8e0', 6, 'right');
  if (won > 30) gameText(g, W, [['TOUTES ALLUMÉES !', '#c8ff7a', 10], [lu.stars + (lu.stars > 1 ? ' étoiles' : ' étoile') + ' sur 3 · ' + lu.moves + ' coups', '#ffd84a'], [lu.daily ? 'Clic : retour aux prés' : 'Clic : pré suivant', '#e8f0ff']], 100);
}
const luCell = (x, y) => { const cx = Math.floor((x - LU.X) / LU.C), cy = Math.floor((y - LU.Y) / LU.C); return cx >= 0 && cy >= 0 && cx < LU.N && cy < LU.N ? [cx, cy] : null; };
cv.onpointermove = e => { if (lu) lu.hover = luCell(...cpos(e)); };
cv.onpointerdown = e => { e.preventDefault(); if (!lu) return; if (lu.mode === 'won') { if (lu.tick - lu.wonAt > 30) luNew(lu.daily ? lus.level : lus.level + 1); return; } const c = luCell(...cpos(e)); if (c) luPress(...c); };
function luInfo() {
  setTimeout(luTrophies); const d = lus.daily; showStats([['Pré le plus loin', lus.top], ['Étoiles', lus.stars], ['Prés finis', lus.games], ['Pré du jour', d.last === luDay() ? 'fait ✓' : 'à faire'], ['Série de jours', (d.last === luDay() || d.last === luDay(1) ? d.streak : 0) + ' (record ' + d.best + ')']]); }
$('luDaily').onclick = () => { luNew(lus.level, true); $('luDaily').blur(); };
$('luMath').onclick = () => {
  $('luMath').blur(); if (!lu || lu.mode !== 'play') return; if (luShow) { luShow = null; $('luTip').textContent = ''; return; }
  const s = luSolve(lu.b); if (!s) return; luShow = s.press; const n = s.press.filter(Boolean).length;
  $('luTip').textContent = 'Toucher deux fois une luciole ne change rien : seul compte « touchée ou pas » (0 ou 1, avec 1 + 1 = 0). Chaque luciole donne une équation : ses touches et celles de ses voisines doivent l’inverser si elle est éteinte. Cela fait ' + s.eq + ' équations ; en les combinant (élimination, comme au collège), il en reste ' + s.rank + ' vraiment différentes, donc ' + (1 << s.free) + ' solutions possibles. La plus courte : les ' + n + ' cases marquées, dans n’importe quel ordre.';
};
$('luPrev').onclick = () => { if (lus.level > 1) luNew(lus.level - 1); $('luPrev').blur(); };
$('luNext').onclick = () => { if (lus.level < lus.top) luNew(lus.level + 1); $('luNext').blur(); };
$('gNew').onclick = () => { luNew(lus.level); $('gNew').blur(); };
$('gFs').onclick = () => { const box = cv.parentElement; document.fullscreenElement ? document.exitFullscreen() : box.requestFullscreen?.().catch(() => {}); $('gFs').blur(); };
function luCheck() {  // vérification : chaque pré se résout en rejouant les mêmes touches (une touche jouée deux fois s'annule) ; les lucioles tiennent dans leur case et dans le pré
  let ok = true; for (let lv = 1; lv < 30; lv++) { const b = [...Array(5)].map(() => Array(5).fill(true)), r = seeded(lv * 7919), p = new Set(); while (p.size < Math.min(12, 2 + lv)) p.add(Math.floor(r() * 25)); for (const q of p) luToggle(b, q % 5, Math.floor(q / 5)); for (const q of p) luToggle(b, q % 5, Math.floor(q / 5)); ok &&= b.every(r => r.every(v => v)); }
  const fit = LU.X + LU.N * LU.C <= W && LU.Y + LU.N * LU.C <= H && LU_ON.every(c => c.width + 10 + 3 <= LU.C + 4 && c.height <= LU.C) && LU_OFF.width === LU_ON[0].width;
  let alg = true; for (let lv = 1; lv < 12; lv++) { const b = [...Array(5)].map(() => Array(5).fill(true)), r = seeded(lv * 7919), p = new Set(); while (p.size < Math.min(12, 2 + lv)) p.add(Math.floor(r() * 25)); for (const q of p) luToggle(b, q % 5, Math.floor(q / 5));
    const s = luSolve(b); if (!s || s.press.filter(Boolean).length > p.size || s.free !== 2) { alg = false; break; } s.press.forEach((v, i) => { if (v) luToggle(b, i % 5, Math.floor(i / 5)); }); alg &&= b.every(r => r.every(v => v)); }
  return [ok ? '' : 'prés', fit ? '' : 'taille', alg ? '' : 'algèbre'].filter(Boolean).join(' | ') || 'ok';
}
{ const c = luCheck(); console.assert(c === 'ok', 'lucioles', c); cv.__lu = {show: () => (luShow || []).flatMap((v, i) => v ? [i] : []), check: luCheck, st: () => lu, press: (x, y) => luPress(x, y), again: lv => luNew(lv), lus}; }
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function luTrophies() {
  const sig = [lus.top, lus.stars, lus.games, lus.daily.best].join(); if (sig === luTrophies.sig) return; luTrophies.sig = sig;
  trophyRecord('pre', lus.games ? lus.top : null); trophyRecord('etoiles', lus.stars || null);
  if (lus.games >= 1) trophy('premier'); if (lus.top >= 10) trophy('n10'); if (lus.top >= 25) trophy('n25'); if (lus.top >= 50) trophy('n50');
  if (lus.stars >= 100) trophy('etoiles'); if (lus.daily.best >= 7) trophy('jour7');
}
ctx.onOpen(() => { if (!lu) luNew(); gameLoop(lu, 'lucioles', () => {}, luDraw); luInfo(); });

}
