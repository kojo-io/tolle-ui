import { Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { BaseService } from '../../shared/base.service';

interface Artifact {
  title: string;
  /** Site-relative path where the file is served. */
  path: string;
  icon: string;
  desc: string;
}

@Component({
  selector: 'app-ai-native-docs',
  imports: [RouterLink],
  templateUrl: './ai-native-docs.component.html',
})
export class AiNativeDocsComponent {
  protected baseService = inject(BaseService);
  protected copied: string | null = null;

  /** Canonical origin used in the copy-paste examples. */
  protected readonly origin = 'https://tolle-ui.com';

  protected artifacts: Artifact[] = [
    {
      title: 'llms.txt',
      path: '/llms.txt',
      icon: 'ri-robot-2-line',
      desc: 'The index: the rules every component follows (imports, form binding, variants, services), then every component by category with a link to its page. Drop this into an agent’s context first.',
    },
    {
      title: 'registry/docs/<name>.md',
      path: '/registry/docs/select.md',
      icon: 'ri-file-text-line',
      desc: 'One page per component, small enough to read whole: import line, compiled examples, the full API, how to bind it in forms, services, types and known pitfalls.',
    },
    {
      title: 'llms-full.txt',
      path: '/llms-full.txt',
      icon: 'ri-file-list-3-line',
      desc: 'Every component page in one file, one short example each — for agents that prefer a single fetch.',
    },
    {
      title: 'registry/manifest.json',
      path: '/registry/manifest.json',
      icon: 'ri-braces-line',
      desc: 'The structured registry — install commands, imports, dependencies, examples and services per component. The CLI and the @tolle_/mcp server read it.',
    },
  ];

  /** A ready-to-paste briefing for a coding agent. */
  protected get agentBriefing(): string {
    return [
      'You have access to Tolle UI (@tolle_/tolle-ui), an Angular 21 component library.',
      'Before writing a tolle-* template, read the docs for the installed version:',
      '  node_modules/@tolle_/tolle-ui/registry/llms.txt          (rules + index)',
      '  node_modules/@tolle_/tolle-ui/registry/docs/<name>.md    (one component)',
      `Not installed yet? ${this.origin}/llms.txt and ${this.origin}/registry/docs/<name>.md`,
      'Form controls bind with [(ngModel)] / formControlName; import every part class you use.',
      'Tip: `npx @tolle_/cli agents` writes this into AGENTS.md and a Claude Code skill;',
      '`npx -y @tolle_/mcp` serves the same docs as MCP tools.',
    ].join('\n');
  }

  protected copy(value: string, key: string): void {
    this.baseService.copyTo(value);
    this.copied = key;
    setTimeout(() => (this.copied = key === this.copied ? null : this.copied), 1400);
  }
}
