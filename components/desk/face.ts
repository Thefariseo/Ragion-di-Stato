import { makeRng } from "@/lib/rng";

/**
 * Disegno procedurale di un volto pixel su canvas a risoluzione NATIVA bassa
 * (poi scalato con image-rendering: pixelated). Palette e variazioni ispirate
 * alla grammatica di Papers, Please (Faces.xml: età, calvizie, barba, baffi,
 * occhiali), ricreate in modo originale. Tinte da palette estratta.
 */

const SKIN = ["#d8ab89", "#ba8657", "#ac6b47", "#a08b61", "#c89a74"];
const HAIR = ["#241c14", "#352818", "#4e4234", "#11100d", "#6b6258", "#504631"];
const COAT = ["#3d4232", "#46341f", "#414447", "#45140f", "#25364c", "#5a4a2e"];

function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const r = clamp(parseInt(h.slice(0, 2), 16) + amt);
  const g = clamp(parseInt(h.slice(2, 4), 16) + amt);
  const b = clamp(parseInt(h.slice(4, 6), 16) + amt);
  return `rgb(${r},${g},${b})`;
}
function clamp(v: number) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

export function drawFace(ctx: CanvasRenderingContext2D, W: number, H: number, seed: number) {
  const rng = makeRng(seed);
  const px = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
  };

  // fondo grigio-verde + linee del misuratore d'altezza
  px(0, 0, W, H, "#3a3f3a");
  for (let y = Math.round(H * 0.08); y < H; y += Math.max(5, Math.round(H * 0.1)))
    px(0, y, W, 1, "#454b44");

  const skin = SKIN[rng.int(0, SKIN.length - 1)] as string;
  const skinSh = shade(skin, -26);
  const hair = HAIR[rng.int(0, HAIR.length - 1)] as string;
  const coat = COAT[rng.int(0, COAT.length - 1)] as string;
  const coatSh = shade(coat, -18);

  const cx = W / 2 + rng.int(-1, 1);
  const headTop = H * 0.18;
  const headBot = H * 0.72;
  const headR = W * (0.27 + rng.next() * 0.04);

  // cappotto / spalle
  for (let y = headBot - 2; y < H; y++) {
    const t = (y - (headBot - 2)) / (H - (headBot - 2));
    const hw = Math.min(W / 2, W * 0.16 + t * W * 0.42);
    px(cx - hw, y, hw * 2, 1, y % Math.max(4, Math.round(H * 0.07)) === 0 ? coatSh : coat);
  }
  // collo
  px(cx - W * 0.08, headBot - H * 0.09, W * 0.16, H * 0.12, skinSh);

  // testa
  for (let y = headTop; y < headBot; y++) {
    const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
    const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy));
    if (hw <= 0) continue;
    px(cx - hw, y, hw * 2, 1, skin);
    px(cx + hw * 0.35, y, hw * 0.65, 1, skinSh); // lato in ombra
  }

  // stile capelli
  const r = rng.next();
  const style = r < 0.16 ? "bald" : r < 0.32 ? "balding" : "full";
  if (style !== "bald") {
    const topLimit = style === "balding" ? headTop + headR * 0.55 : headTop + headR * 0.85;
    for (let y = headTop - 2; y < topLimit; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
      const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy)) + 1;
      px(cx - hw, y, hw * 2, 1, hair);
    }
    // basette
    px(cx - headR, headTop + headR * 0.6, 2, headR * 0.5, hair);
    px(cx + headR - 2, headTop + headR * 0.6, 2, headR * 0.5, hair);
  }

  const eyeY = headTop + headR * 1.05;
  const eyeDx = headR * 0.5;
  const eyeW = headR * 0.34;
  // sopracciglia
  px(cx - eyeDx - eyeW * 0.6, eyeY - headR * 0.22, eyeW * 1.3, 1.5, hair);
  px(cx + eyeDx - eyeW * 0.7, eyeY - headR * 0.22, eyeW * 1.3, 1.5, hair);
  // occhi
  px(cx - eyeDx - eyeW / 2, eyeY, eyeW, 2, "#1b1712");
  px(cx + eyeDx - eyeW / 2, eyeY, eyeW, 2, "#1b1712");
  // occhiaie
  px(cx - eyeDx - eyeW / 2, eyeY + 2, eyeW, 1, skinSh);
  px(cx + eyeDx - eyeW / 2, eyeY + 2, eyeW, 1, skinSh);
  // occhiali
  if (rng.next() < 0.3) {
    ctx.strokeStyle = "#2a2620";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - eyeDx - eyeW * 0.8, eyeY - 1.5, eyeW * 1.6, 4);
    ctx.strokeRect(cx + eyeDx - eyeW * 0.8, eyeY - 1.5, eyeW * 1.6, 4);
    px(cx - eyeW * 0.4, eyeY, eyeW * 0.8, 1, "#2a2620");
  }
  // naso
  px(cx - 1, eyeY + headR * 0.2, 2, headR * 0.5, skinSh);
  // bocca / baffi
  const mouthY = eyeY + headR * 0.95;
  if (rng.next() < 0.4) px(cx - headR * 0.45, mouthY - 2, headR * 0.9, 2.5, hair); // baffi
  px(cx - headR * 0.4, mouthY + 1, headR * 0.8, 1, "#5a3b30");
  // barba
  if (rng.next() < 0.3) {
    for (let y = Math.round(mouthY); y < headBot; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
      const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy));
      if (hw > 0) px(cx - hw, y, hw * 2, 1, shade(hair, 6));
    }
  } else if (rng.next() < 0.5) {
    // barba accennata
    for (let i = 0; i < W * H * 0.05; i++) {
      const x = cx + rng.int(-headR, headR);
      const y = mouthY + rng.int(-1, headR * 0.5);
      if (y < headBot && Math.abs(x - cx) < headR) px(x, y, 1, 1, shade(skin, -38));
    }
  }

  // grana
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng.next() - 0.5) * 22;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}
