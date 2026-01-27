import * as fs from 'fs';
import * as path from 'path';

const docsContentPath = path.join(__dirname, '../src/assets/docs-content.json');
const publicDir = path.join(__dirname, '../public');
const llmsTxtPath = path.join(publicDir, 'llm.txt');
const llmsCtxPath = path.join(publicDir, 'llm-ctx.txt');

if (!fs.existsSync(docsContentPath)) {
    console.error('docs-content.json not found. Run extract-docs.ts first.');
    process.exit(1);
}

const docs = JSON.parse(fs.readFileSync(docsContentPath, 'utf8'));

// 1. Generate llms.txt (Index)
const llmsTxtContent = `# Tolle UI Documentation

Modern UI component library for Angular built with Tailwind CSS and the Angular CDK.

- [Full Context Documentation](llm-ctx.txt): For AI agents to ingest the entire library.
- [GitHub](https://github.com/kojo-io/tolle-ui)
- [Official Docs](https://tolle-ui.example.com)

## Components
${Object.keys(docs).map(key => `- ${key}`).join('\n')}
`;

// 2. Generate llms-ctx.txt (Full Context)
let llmsCtxContent = `# Tolle UI - Full Context for AI Agents

Tolle UI is a modern, config-first UI component library for Angular. 
It emphasizes accessibility, customizability, and premium aesthetics.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Components](#components)

---

<section id="getting-started">
## Getting Started

### Installation
\`\`\`bash
npm install @tolle_/tolle-ui date-fns remixicon @melloware/coloris embla-carousel clsx tailwind-merge class-variance-authority @floating-ui/dom
\`\`\`

### Configuration
${renderGS(docs['getting-started-docs'])}
</section>

---

<section id="components">
## Components Reference

${Object.keys(docs)
        .filter(key => key !== 'getting-started-docs')
        .map(key => renderComponentGroup(key, docs[key]))
        .join('\n\n---\n\n')}
</section>
`;

function renderGS(gsDocs: any): string {
    if (!gsDocs) return 'Refer to the main documentation.';
    const setupComp = gsDocs.components.find((c: any) => c.name === 'GSSetupComponent');
    if (!setupComp) return 'Refer to the main documentation.';

    return `
#### App Configuration (app.config.ts)
\`\`\`typescript
${setupComp.examples.appConfigCode || ''}
\`\`\`

#### Tailwind Configuration (tailwind.config.js)
\`\`\`javascript
${setupComp.examples.tailwindConfigCode || ''}
\`\`\`

#### Global Styles (angular.json)
\`\`\`json
${setupComp.examples.globalStyles || ''}
\`\`\`
`;
}

function renderComponentGroup(key: string, group: any): string {
    const title = key.replace('-docs', '').replace(/^\w/, c => c.toUpperCase());
    let md = `## ${title}\n\n`;

    group.components.forEach((comp: any) => {
        const isOverview = comp.name.includes('Overview');
        const isInteractive = comp.name.includes('Interactive') || comp.name.includes('Examples');
        const isApi = comp.name.includes('Api');
        const isAllInOne = !isOverview && !isInteractive && !isApi;

        if (isOverview || isAllInOne) {
            if (comp.installation || comp.examples.installation) {
                md += `### Overview & Installation\n`;
                md += `\`\`\`typescript\n${comp.installation || comp.examples.installation}\n\`\`\`\n\n`;
            }
            // Check for other overview snippets
            Object.keys(comp.examples).forEach(ex => {
                if (ex !== 'installation' && (ex.toLowerCase().includes('usage') || ex.toLowerCase().includes('setup'))) {
                    md += `#### ${ex.replace('Code', '')}\n\`\`\`typescript\n${comp.examples[ex]}\n\`\`\`\n\n`;
                }
            });
        }

        if (isInteractive || isAllInOne) {
            const exampleKeys = Object.keys(comp.examples).filter(ex => ex !== 'installation' && !ex.toLowerCase().includes('usage') && !ex.toLowerCase().includes('setup'));
            if (exampleKeys.length > 0) {
                md += `### Usage Examples\n`;
                exampleKeys.forEach(ex => {
                    const lang = ex.toLowerCase().includes('html') || ex.toLowerCase().includes('code') ? 'html' : 'typescript';
                    md += `#### ${ex.replace('Code', '')}\n\`\`\`${lang}\n${comp.examples[ex]}\n\`\`\`\n\n`;
                });
            }
        }

        if (isApi || isAllInOne) {
            const propGroups = Object.keys(comp.props);
            if (propGroups.length > 0) {
                md += `### API Reference\n`;
                propGroups.forEach(propGroup => {
                    md += `#### ${propGroup.replace('Props', '')} Properties\n`;
                    md += `| Name | Type | Default | Description |\n`;
                    md += `|------|------|---------|-------------|\n`;
                    if (Array.isArray(comp.props[propGroup])) {
                        comp.props[propGroup].forEach((p: any) => {
                            md += `| ${p.name || '-'} | \`${p.type || '-'}\` | ${p.default || '-'} | ${p.description || '-'} |\n`;
                        });
                    } else {
                        md += `| - | - | - | ${comp.props[propGroup].raw || 'Manual reference needed'} |\n`;
                    }
                    md += `\n`;
                });
            }
        }
    });

    return md;
}

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(llmsTxtPath, llmsTxtContent);
fs.writeFileSync(llmsCtxPath, llmsCtxContent);

console.log(`Generated LLM compatible files:
- ${llmsTxtPath}
- ${llmsCtxPath}`);
