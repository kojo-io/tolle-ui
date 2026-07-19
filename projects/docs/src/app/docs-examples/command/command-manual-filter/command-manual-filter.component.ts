import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandGroupComponent,
  CommandItemComponent
} from '../../../../../../tolle/src/lib/command.component';

interface Repo {
  name: string;
  owner: string;
}

@Component({
    selector: 'app-command-manual-filter',
    standalone: true,
    imports: [
        CommonModule,
        CommandComponent,
        CommandInputComponent,
        CommandListComponent,
        CommandGroupComponent,
        CommandItemComponent
    ],
    templateUrl: './command-manual-filter.component.html'
})
export class CommandManualFilterComponent {
  private readonly repos: Repo[] = [
    { name: 'tolle-ui', owner: 'tolle' },
    { name: 'design-tokens', owner: 'tolle' },
    { name: 'docs-site', owner: 'tolle' },
    { name: 'edge-worker', owner: 'acme' },
    { name: 'payments-api', owner: 'acme' }
  ];

  results: Repo[] = this.repos;

  onQueryChange(query: string): void {
    const q = query.trim().toLowerCase();
    this.results = q
      ? this.repos.filter(repo => `${repo.owner}/${repo.name}`.toLowerCase().includes(q))
      : this.repos;
  }
}
