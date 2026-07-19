import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestionsComponent, SuggestionComponent } from '../../../../../../tolle/src/lib/suggestion.component';

@Component({
    selector: 'app-basic-suggestions',
    standalone: true,
    imports: [CommonModule, SuggestionsComponent, SuggestionComponent],
    templateUrl: './basic-suggestions.component.html'
})
export class BasicSuggestionsComponent {
    prompts = [
        'Summarise this thread',
        'Draft a reply',
        'Find the related issue',
        'Explain the trade-offs'
    ];

    picked: string | null = null;

    onSelected(value: string): void {
        this.picked = value;
    }
}
