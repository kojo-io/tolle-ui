#!/usr/bin/env node
/**
 * update-usage-docs.js
 *
 * Reads every example in projects/docs/src/app/docs-examples/<component>/
 * and patches the corresponding component-usage/<component>-usage.md file
 * so its "## Basic Usage" section contains the real HTML from the docs app.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const USAGE_DIR = path.join(ROOT, 'component-usage');
const EXAMPLES_DIR = path.join(ROOT, 'projects/docs/src/app/docs-examples');

console.log('Starting update-usage-docs...');
console.log('Usage dir:', USAGE_DIR);
console.log('Examples dir:', EXAMPLES_DIR);

function titleCase(slug) {
    return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * Extract template string from a .ts file using indexOf instead of regex
 * to avoid catastrophic backtracking on large files.
 */
function extractInlineTemplate(tsContent) {
    const marker = 'template:';
    let idx = tsContent.indexOf(marker);
    if (idx === -1) {
        idx = tsContent.indexOf('template :');
        if (idx === -1) return null;
        idx += 'template :'.length;
    } else {
        idx += marker.length;
    }

    // Skip whitespace after template:
    while (idx < tsContent.length && (tsContent[idx] === ' ' || tsContent[idx] === '\t' || tsContent[idx] === '\n' || tsContent[idx] === '\r')) {
        idx++;
    }

    if (idx >= tsContent.length) return null;

    const quote = tsContent[idx]; // should be ` or ' or "
    if (quote !== '`' && quote !== "'" && quote !== '"') return null;

    idx++; // skip opening quote

    let result = '';
    let escaped = false;
    while (idx < tsContent.length) {
        const ch = tsContent[idx];
        if (escaped) {
            result += ch;
            escaped = false;
        } else if (ch === '\\') {
            escaped = true;
        } else if (ch === quote) {
            break; // closing quote
        } else {
            result += ch;
        }
        idx++;
    }

    return result.trim() || null;
}

function getExampleHtml(dir, name) {
    // 1. Try .html
    const htmlPaths = [
        path.join(dir, `${name}.component.html`),
        path.join(dir, name, `${name}.component.html`),
    ];
    for (const p of htmlPaths) {
        if (fs.existsSync(p)) {
            return fs.readFileSync(p, 'utf-8').trim();
        }
    }

    // 2. Try inline template in .ts
    const tsPaths = [
        path.join(dir, `${name}.component.ts`),
        path.join(dir, name, `${name}.component.ts`),
    ];
    for (const p of tsPaths) {
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf-8');
            const tmpl = extractInlineTemplate(content);
            if (tmpl) {
                // Dedent
                let lines = tmpl.split('\n');
                if (lines.length && lines[0].trim() === '') lines.shift();
                if (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
                const indent = lines
                    .filter(l => l.trim().length > 0)
                    .reduce((min, l) => Math.min(min, l.match(/^(\s*)/)[1].length), Infinity);
                if (indent > 0 && indent < Infinity) {
                    lines = lines.map(l => l.slice(indent));
                }
                return lines.join('\n').trim();
            }
        }
    }

    return null;
}

function getExamples(exDir) {
    if (!fs.existsSync(exDir)) return [];
    const entries = fs.readdirSync(exDir, { withFileTypes: true });
    const results = [];

    const dirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    for (const d of dirs) {
        const html = getExampleHtml(exDir, d);
        if (html) results.push({ title: titleCase(d), html });
    }

    const looseTsFiles = entries
        .filter(e => !e.isDirectory() && e.name.endsWith('.component.ts'))
        .map(e => e.name.replace('.component.ts', ''));
    for (const name of looseTsFiles) {
        if (dirs.includes(name)) continue;
        const html = getExampleHtml(exDir, name);
        if (html) results.push({ title: titleCase(name), html });
    }

    return results;
}

function buildUsageSection(examples) {
    let md = '## Basic Usage\n\n';
    for (const ex of examples) {
        md += `### ${ex.title}\n\n`;
        md += '```html\n' + ex.html + '\n```\n\n';
    }
    return md;
}

function resolveExampleDir(slug) {
    const direct = path.join(EXAMPLES_DIR, slug);
    if (fs.existsSync(direct)) return direct;

    const allDirs = fs.readdirSync(EXAMPLES_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name);
    const stripped = slug.replace(/-/g, '');
    const match = allDirs.find(d => d.replace(/-/g, '') === stripped);
    if (match) return path.join(EXAMPLES_DIR, match);

    return null;
}

// ── main ─────────────────────────────────────────────────────────────
const usageFiles = fs.readdirSync(USAGE_DIR).filter(f => f.endsWith('-usage.md'));
let updated = 0, skipped = 0;

for (const mdFile of usageFiles) {
    console.log(`Processing: ${mdFile}`);
    const slug = mdFile.replace('-usage.md', '');
    const mdPath = path.join(USAGE_DIR, mdFile);

    const exDir = resolveExampleDir(slug);
    if (!exDir) {
        console.log(`  SKIP (no examples dir)`);
        skipped++;
        continue;
    }

    const examples = getExamples(exDir);
    if (examples.length === 0) {
        console.log(`  SKIP (no examples extracted)`);
        skipped++;
        continue;
    }

    let md = fs.readFileSync(mdPath, 'utf-8');
    const newSection = buildUsageSection(examples);

    const startMarker = '## Basic Usage';
    const startIdx = md.indexOf(startMarker);

    if (startIdx === -1) {
        md = md.trimEnd() + '\n\n' + newSection;
    } else {
        const afterStart = startIdx + startMarker.length;
        // Find the next ## heading
        let endIdx = md.length;
        const rest = md.slice(afterStart);
        const lines = rest.split('\n');
        let offset = afterStart;
        for (let i = 0; i < lines.length; i++) {
            if (i > 0 && lines[i].startsWith('## ')) {
                endIdx = offset;
                break;
            }
            offset += lines[i].length + 1; // +1 for \n
        }
        md = md.slice(0, startIdx) + newSection + md.slice(endIdx);
    }

    fs.writeFileSync(mdPath, md, 'utf-8');
    console.log(`  ✓ Updated (${examples.length} examples)`);
    updated++;
}

console.log(`\nDone. Updated: ${updated}  Skipped: ${skipped}`);
