/**
 * Agent-docs coverage gate.
 *
 * Measures how much of what an agent reads is real documentation rather than a
 * generated placeholder, and fails when it gets worse. It is a ratchet, not an
 * absolute bar: the baseline records today's gaps, any regression fails, and
 * `--update` lowers the baseline after you fill gaps in.
 *
 *   npm run check:agent-docs            # fail on any regression or problem
 *   npm run check:agent-docs -- --update  # accept the current (better) numbers
 *   npm run check:agent-docs -- --list    # print every gap
 *
 * Problems (an example importing something the package doesn't export, a
 * sidecar naming an unknown item) always fail — they ship broken docs.
 */
import * as fs from 'fs';
import * as path from 'path';
import { buildModel, buildAgentModel } from './generate';

const BASELINE = path.resolve(__dirname, '../agent-docs-baseline.json');

interface Metrics {
  pagesWithoutDescription: number;
  pagesWithoutExample: number;
  inputsWithoutDescription: number;
  outputsWithoutDescription: number;
}

function main() {
  const args = new Set(process.argv.slice(2));
  const model = buildModel();
  const agent = buildAgentModel(model);

  const gaps: Record<keyof Metrics, string[]> = {
    pagesWithoutDescription: [],
    pagesWithoutExample: [],
    inputsWithoutDescription: [],
    outputsWithoutDescription: [],
  };
  for (const p of agent.pages) {
    if (p.generatedDescription) gaps.pagesWithoutDescription.push(p.name);
    // Service-only pages document an API, not a template; examples are optional.
    if (!p.examples.length && p.classes.length) gaps.pagesWithoutExample.push(p.name);
    for (const c of p.classes) {
      for (const i of c.inputs) if (!i.description && !i.internal) gaps.inputsWithoutDescription.push(`${c.className}.${i.alias ?? i.name}`);
      for (const o of c.outputs) if (!o.description) gaps.outputsWithoutDescription.push(`${c.className}.${o.name}`);
    }
  }
  const current = Object.fromEntries(Object.entries(gaps).map(([k, v]) => [k, v.length])) as unknown as Metrics;

  if (args.has('--list')) {
    for (const [k, v] of Object.entries(gaps)) console.log(`\n${k} (${v.length}):\n  ${v.join('\n  ')}`);
  }

  if (args.has('--update')) {
    fs.writeFileSync(BASELINE, JSON.stringify(current, null, 2) + '\n');
    console.log(`Baseline updated → ${path.relative(process.cwd(), BASELINE)}`, current);
    return;
  }

  const baseline: Metrics = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, 'utf8')) : current;
  const regressions = (Object.keys(current) as (keyof Metrics)[]).filter((k) => current[k] > baseline[k]);
  const improved = (Object.keys(current) as (keyof Metrics)[]).filter((k) => current[k] < baseline[k]);

  console.log(`Agent docs: ${agent.pages.length} pages`);
  for (const k of Object.keys(current) as (keyof Metrics)[]) {
    const mark = current[k] > baseline[k] ? '✖' : current[k] < baseline[k] ? '↓' : ' ';
    console.log(`  ${mark} ${k}: ${current[k]} (baseline ${baseline[k]})`);
  }

  let failed = false;
  if (agent.problems.length) {
    failed = true;
    console.error(`\n✖ ${agent.problems.length} problem(s):\n  ${agent.problems.join('\n  ')}`);
  }
  if (regressions.length) {
    failed = true;
    console.error(`\n✖ Coverage regressed: ${regressions.join(', ')}. New components and inputs need a JSDoc line, a docs-app example and, for top-level components, a sidecar description. Run with --list to see the gaps.`);
  }
  if (improved.length && !failed) {
    console.log(`\nCoverage improved (${improved.join(', ')}). Lock it in: npm run check:agent-docs -- --update`);
  }
  if (failed) process.exit(1);
}

main();
