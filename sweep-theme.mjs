// Run from the client folder:  node sweep-theme.mjs
// Moves the app's colours onto theme-aware tokens so the dark theme works everywhere.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const norm = (f) => f.replace(/\\/g, '/');
const endsWithAny = (f, names) => names.some((n) => norm(f).endsWith(n));

const rules = [
  // headings, links and rules use "strong" (ink stays for dark surfaces such as the sidebar)
  { from: /\btext-ink\b/g, to: 'text-strong' },
  { from: /\bborder-ink\b/g, to: 'border-strong' },
  // white inputs and cards become "card" (dark in the dark theme); social tiles and button shine stay white
  { skip: ['SocialLinks.jsx', 'LinkButton.jsx'], from: /(?<!before:)\bbg-white\b/g, to: 'bg-card' },
  // chart bars and lines use "accent"
  { only: ['dashboard/BilledVsPaid.jsx', 'dashboard/EarningsChart.jsx', 'reports/BarRow.jsx'], from: /bg-ink/g, to: 'bg-accent' },
  { only: ['dashboard/TrendChart.jsx'], from: /\bstroke-ink\b/g, to: 'stroke-accent' },
  { only: ['dashboard/TrendChart.jsx'], from: /\bfill-ink\b/g, to: 'fill-accent' },
  { only: ['auth/AuthLayout.jsx'], from: /rounded-t bg-ink/g, to: 'rounded-t bg-accent' },
  // text on the dark brand bands stays white
  { only: ['home/CallToAction.jsx', 'home/DashboardPreview.jsx'], from: /\btext-paper\b/g, to: 'text-white' }
];

let changed = 0;
for (const file of walk('src').filter((f) => /\.jsx?$/.test(f))) {
  const before = readFileSync(file, 'utf8');
  let text = before;
  for (const r of rules) {
    if (r.only && !endsWithAny(file, r.only)) continue;
    if (r.skip && endsWithAny(file, r.skip)) continue;
    text = text.replace(r.from, r.to);
  }
  if (text !== before) {
    writeFileSync(file, text);
    changed++;
    console.log('updated', norm(file));
  }
}
console.log(`Done. ${changed} files updated.`);