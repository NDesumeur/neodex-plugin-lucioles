// lancé par le test « local » de NeoDex : la vérification interne (prés faisables, taille des lucioles), un pré résolu au clic
// (les lucioles allumées décollent et volettent), trois étoiles, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('gc').__lu, lu = T.st(); ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'lucioles-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  const click = (x, y) => pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); c.dispatchEvent(new PointerEvent('pointerdown', {clientX: r.left + (54 + ${x} * 36 + 18) / 288 * r.width, clientY: r.top + (30 + ${y} * 36 + 18) / 216 * r.height, bubbles: true})); })(), 0`);
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  const lv0 = await C('return T.lus.level;');
  await C('T.again(4); return 0;'); await sleep(400); await shot('0-pre');
  // les mêmes touches que celles qui ont mélangé le pré le résolvent : on les rejoue au clic
  const ps = await C('return lu.presses;');
  for (const [i, q] of ps.entries()) { await click(q % 5, Math.floor(q / 5)); await sleep(i === ps.length - 2 ? 700 : 120); if (i === ps.length - 2) await shot('1-envol'); }
  const s = await C('return {mode: lu.mode, moves: lu.moves, stars: lu.stars};');
  if (s.mode !== 'won' || s.moves !== ps.length || s.stars !== 3) throw new Error('le pré devait être fini en trois étoiles : ' + JSON.stringify(s));
  await sleep(700); await shot('2-allumees');
  // le pré du jour : le même à chaque départ ; la solution expliquée marque les cases, et les toucher rallume tout
  const day = []; for (let k = 0; k < 2; k++) { await pj(`document.getElementById('luDaily').click(), 0`); await sleep(200); day.push(await C('return lu.daily + ":" + JSON.stringify(lu.b);')); }
  if (day[0] !== day[1] || !day[0].startsWith('true')) throw new Error('pré du jour');
  await pj(`document.getElementById('luMath').click(), 0`); await sleep(400); await shot('3-solution');
  const tip = await pj(`document.getElementById('luTip').textContent`); if (!/25 équations/.test(tip)) throw new Error('explication : ' + tip);
  const press = await pj(`(() => { const m = /les (\\d+) cases/.exec(document.getElementById('luTip').textContent); return m ? +m[1] : -1; })()`);
  const cells = await C('return T.show();');
  for (const i of cells) { await click(i % 5, Math.floor(i / 5)); await sleep(60); }
  if (await C('return lu.mode;') !== 'won' || cells.length !== press) throw new Error('la solution expliquée devait rallumer le pré : ' + cells.length + ' / ' + press);
  await sleep(300);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('gFs').click(), 0`); await sleep(800);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(400);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 280) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  await C(`T.again(${lv0}); return 0;`);
  return 'vérification ok · pré résolu au clic en ' + s.moves + ' coups, trois étoiles · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
