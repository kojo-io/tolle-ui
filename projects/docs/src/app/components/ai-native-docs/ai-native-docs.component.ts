import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule, RouterLink],
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
      desc: 'A concise, linkable index of every component — one line each, pointing at its registry JSON. Drop this into an agent’s context first.',
    },
    {
      title: 'llms-full.txt',
      path: '/llms-full.txt',
      icon: 'ri-file-list-3-line',
      desc: 'The complete reference: every component with its inputs, outputs, slots and variants as Markdown tables.',
    },
    {
      title: 'registry/manifest.json',
      path: '/registry/manifest.json',
      icon: 'ri-braces-line',
      desc: 'The structured registry — install command, imports, dependencies and files for each component. This is what the CLI reads.',
    },
  ];

  /** A ready-to-paste briefing for a coding agent. */
  protected get agentBriefing(): string {
    return [
      'You have access to Tolle UI, an Angular 18 component library.',
      `Component index:     ${this.origin}/llms.txt`,
      `Full API reference:  ${this.origin}/llms-full.txt`,
      'Add a component:     npx @tolle_/cli add <name>',
      'Read the index first, then add only the components you need.',
    ].join('\n');
  }

  protected copy(value: string, key: string): void {
    this.baseService.copyTo(value);
    this.copied = key;
    setTimeout(() => (this.copied = key === this.copied ? null : this.copied), 1400);
  }
}
