import { makeRng } from "@/lib/rng";

/**
 * Volto pixel in stile Papers, Please: busto ravvicinato (testa + spalle),
 * incarnato DESATURATO freddo, illuminazione laterale (sinistra in luce, destra
 * in ombra), tratti marcati, abiti d'epoca (cappotti, colletti, cappelli,
 * occhiali, sciarpe, cappucci). Cupo e sinistro. Risoluzione nativa bassa.
 */

// incarnati freddi e desaturati (grigio-azzurro/verde), come i volti di PP
const SKIN = ["#8c938d", "#7f8884", "#949b94", "#737c79", "#9aa29b", "#83837c", "#6f7a7b"];
const HAIR = ["#1f211e", "#2a2922", "#39352f", "#141410", "#56534d", "#2c2a26"];
const COAT = ["#2c362a", "#243039", "#382b1e", "#1b1b17", "#373a36", "#41301f", "#2a2723"];
const HOOD = ["#274a44", "#244039", "#1f3a35", "#2b3f3a"]; // cappuccio teal-cupo

function clampByte(v: number) {
  return Math.max(0, Math.min(255, Math.round(v)));
}
function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  return `rgb(${clampByte(parseInt(h.slice(0, 2), 16) + amt)},${clampByte(parseInt(h.slice(2, 4), 16) + amt)},${clampByte(parseInt(h.slice(4, 6), 16) + amt)})`;
}

export function drawFace(ctx: CanvasRenderingContext2D, W: number, H: number, seed: number) {
  const rng = makeRng(seed);
  const px = (x: number, y: number, w: number, h: number, c: string) => {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
  };
  ctx.clearRect(0, 0, W, H);

  // fondo cupo + linee del misuratore d'altezza
  px(0, 0, W, H, "#2a322e");
  px(0, 0, W, H * 0.5, "#252c28");
  for (let y = Math.round(H * 0.06); y < H; y += Math.max(5, Math.round(H * 0.09))) px(0, y, W, 1, "#343d38");

  const skin = SKIN[rng.int(0, SKIN.length - 1)] as string;
  const skinSh = shade(skin, -30);
  const hair = HAIR[rng.int(0, HAIR.length - 1)] as string;
  const coat = COAT[rng.int(0, COAT.length - 1)] as string;
  const coatSh = shade(coat, -16);

  const cx = W / 2 + rng.int(-1, 1);
  const headTop = H * 0.13;
  const headBot = H * 0.63;
  const headR = W * 0.27;

  // spalle / cappotto (busto ravvicinato)
  const bodyTop = headBot - 5;
  for (let y = bodyTop; y < H; y++) {
    const t = (y - bodyTop) / (H - bodyTop);
    const hw = Math.min(W / 2, W * 0.22 + t * W * 0.5);
    px(cx - hw, y, hw * 2, 1, y % 12 === 0 ? coatSh : coat);
  }
  // collo
  px(cx - W * 0.08, headBot - 6, W * 0.16, 10, skinSh);
  // colletto della camicia
  const shirt = shade(coat, 26);
  px(cx - W * 0.12, bodyTop + 2, W * 0.24, 5, shirt);
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.1, bodyTop + 2);
  ctx.lineTo(cx, bodyTop + 9);
  ctx.lineTo(cx + W * 0.1, bodyTop + 2);
  ctx.closePath();
  ctx.fillStyle = coat;
  ctx.fill();

  // testa
  for (let y = headTop; y < headBot; y++) {
    const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
    const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy));
    if (hw <= 0) continue;
    px(cx - hw, y, hw * 2, 1, skin);
  }

  const r = rng.next();
  const style = r < 0.13 ? "hood" : r < 0.27 ? "cap" : r < 0.42 ? "bald" : r < 0.55 ? "balding" : "hair";

  if (style === "hair" || style === "balding") {
    const top = style === "balding" ? headTop + headR * 0.6 : headTop + headR * 0.95;
    for (let y = headTop - 2; y < top; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
      const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy)) + 1;
      px(cx - hw, y, hw * 2, 1, hair);
    }
    px(cx - headR, headTop + headR * 0.7, 2, headR * 0.55, hair); // basette
    px(cx + headR - 2, headTop + headR * 0.7, 2, headR * 0.55, hair);
  } else if (style === "cap") {
    // berretto da divisa (tesa + corpo + fregio)
    const capH = headR * 0.9;
    for (let y = headTop - 4; y < headTop + capH; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
      const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy)) + 1;
      px(cx - hw, y, hw * 2, 1, "#16140f");
    }
    px(cx - headR - 1, headTop + capH - 3, headR * 2 + 2, 3, "#0c0d09"); // tesa
    px(cx - headR, headTop - 4, headR * 2, capH - 2, "#1a1c16");
    px(cx - 2, headTop + 2, 4, 4, "#7c241c"); // fregio rosso
  } else if (style === "hood") {
    const hood = HOOD[rng.int(0, HOOD.length - 1)] as string;
    // cappuccio: ovale più grande dietro/intorno, sceso sulle spalle
    for (let y = headTop - 5; y < headBot + 6; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2 + 6);
      const hw = (headR + 5) * Math.sqrt(Math.max(0, 1 - dy * dy));
      px(cx - hw, y, hw * 2, 1, hood);
    }
    // re-disegna il volto sopra (l'apertura del cappuccio)
    for (let y = headTop + 2; y < headBot; y++) {
      const dy = (y - (headTop + 2 + headBot) / 2) / ((headBot - headTop - 2) / 2);
      const hw = headR * 0.86 * Math.sqrt(Math.max(0, 1 - dy * dy));
      if (hw <= 0) continue;
      px(cx - hw, y, hw * 2, 1, shade(skin, -8));
    }
    px(cx - headR - 2, headBot - 4, headR * 2 + 4, 8, shade(hood, -12)); // bordo sulle spalle
  }

  // tratti del volto
  const eyeY = headTop + headR * 1.05;
  const dx = headR * 0.48;
  const ew = headR * 0.32;
  // sopracciglia marcate
  px(cx - dx - ew * 0.7, eyeY - headR * 0.24, ew * 1.5, 2, shade(hair, -6));
  px(cx + dx - ew * 0.8, eyeY - headR * 0.24, ew * 1.5, 2, shade(hair, -6));
  // occhiaie (incavi)
  px(cx - dx - ew * 0.7, eyeY - 1, ew * 1.5, 4, skinSh);
  px(cx + dx - ew * 0.8, eyeY - 1, ew * 1.5, 4, skinSh);
  // occhi
  px(cx - dx - ew / 2, eyeY, ew, 2, "#15140f");
  px(cx + dx - ew / 2, eyeY, ew, 2, "#15140f");
  // occhiali
  if (rng.next() < 0.32) {
    ctx.strokeStyle = "#23241e";
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - dx - ew * 0.9, eyeY - 2, ew * 1.8, 5);
    ctx.strokeRect(cx + dx - ew * 0.9, eyeY - 2, ew * 1.8, 5);
    px(cx - ew * 0.5, eyeY, ew, 1, "#23241e");
  }
  // naso con ombra
  px(cx - 1, eyeY + headR * 0.18, 2, headR * 0.5, skin);
  px(cx + 1, eyeY + headR * 0.2, 2, headR * 0.45, skinSh);
  px(cx - 2, eyeY + headR * 0.62, 4, 2, skinSh);
  // baffi (frequenti, da Prima Repubblica)
  const mouthY = eyeY + headR * 0.95;
  if (rng.next() < 0.5) px(cx - headR * 0.46, mouthY - 3, headR * 0.92, 3, shade(hair, 4));
  px(cx - headR * 0.38, mouthY + 1, headR * 0.76, 1, shade(skin, -42));
  // barba/ombra
  if (rng.next() < 0.3) {
    for (let y = Math.round(mouthY); y < headBot; y++) {
      const dy = (y - (headTop + headBot) / 2) / ((headBot - headTop) / 2);
      const hw = headR * Math.sqrt(Math.max(0, 1 - dy * dy));
      if (hw > 0) px(cx - hw, y, hw * 2, 1, shade(hair, 10));
    }
  }

  // illuminazione laterale (sinistra in luce, destra in ombra) — l'umore di PP
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "rgba(180,195,190,0.07)");
  g.addColorStop(0.45, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.34)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // grana fine
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng.next() - 0.5) * 16;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}
