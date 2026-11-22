import { Component } from '@angular/core';

import {
  SuggestionsComponent,
  SuggestionComponent,
} from '../../../../../../tolle/src/lib/suggestion.component';

@Component({
  selector: 'app-basic-suggestions',
  imports: [SuggestionsComponent, SuggestionComponent],
  templateUrl: './basic-suggestions.component.html',
})
export class BasicSuggestionsComponent {
  prompts = [
    'Summarise this thread',
    'Draft a reply',
    'Find the related issue',
    'Explain the trade-offs',
  ];

  picked: string | null = null;

  onSelected(value: string): void {
    this.picked = value;
  }
}
