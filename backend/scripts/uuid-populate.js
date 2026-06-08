const fs = require("fs");
const path = require("path");

const p = path.join(__dirname, "../src/infra/database/populate.sql");
let s = fs.readFileSync(p, "utf8");

const pad = (n) => String(n).padStart(12, "0");
const U = (n) => `11111111-1111-4111-8111-${pad(n)}`;
const C = (n) => `22222222-2222-4222-8222-${pad(n)}`;
const S = (n) => `33333333-3333-4333-8333-${pad(n)}`;
const T = (n) => `44444444-4444-4444-8444-${pad(n)}`;
const R = (n) => `55555555-5555-4555-8555-${pad(n)}`;

s = s.replace(/'tx_pend_u8'/g, `'44444444-4444-4444-8444-999999999998'`);

for (let n = 46; n >= 1; n -= 1) {
  const k = `'tx${n}'`;
  if (s.includes(k)) s = s.split(k).join(`'${T(n)}'`);
}

for (let n = 45; n >= 1; n -= 1) {
  s = s.split(`'s${n}'`).join(`'${S(n)}'`);
}

for (let n = 45; n >= 1; n -= 1) {
  s = s.split(`'r${n}'`).join(`'${R(n)}'`);
}

for (let n = 10; n >= 1; n -= 1) {
  s = s.split(`'u${n}'`).join(`'${U(n)}'`);
}

for (let n = 6; n >= 1; n -= 1) {
  s = s.split(`'cat${n}'`).join(`'${C(n)}'`);
}

const note = `-- IDs UUID fixos (seed): user uK → 11111111-1111-4111-8111-00000000000K | cat → 2222… | servico sN → 3333…+NN12 | txN → 4444… | rN → 5555… | tx pendente → …9998999999998
`;

if (!s.includes("IDs UUID fixos (seed)")) {
  const i = s.indexOf("\n");
  s = s.slice(0, i + 1) + note + s.slice(i + 1);
}

fs.writeFileSync(p, s);
console.log("populate.sql atualizado com UUIDs.");
