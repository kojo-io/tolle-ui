import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuggestionsComponent, SuggestionComponent } from '../../../../../../tolle/src/lib/suggestion.component';

@Component({
    selector: 'app-suggestion-scrolling',
    standalone: true,
    imports: [CommonModule, SuggestionsComponent, SuggestionComponent],
    templateUrl: './suggestion-scrolling.component.html'
})
export class SuggestionScrollingComponent {
    followUps = [
        { label: 'What changed in v2?', value: 'changelog', icon: 'ri-git-commit-line' },
        { label: 'Show me a migration example', value: 'migration', icon: 'ri-arrow-left-right-line' },
        { label: 'Which components are affected?', value: 'affected', icon: 'ri-layout-grid-line' },
        { label: 'Generate the codemod', value: 'codemod', icon: 'ri-magic-line' },
        { label: 'Compare with the previous release', value: 'compare', icon: 'ri-scales-3-line' },
        { label: 'Draft the release notes', value: 'notes', icon: 'ri-file-text-line' }
    ];

    sent: string[] = [];

    onPicked(value: string): void {
        this.sent = [value, ...this.sent].slice(0, 3);
    }
}
