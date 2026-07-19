import { Component } from '@angular/core';
import { SuggestionsComponent, SuggestionComponent } from '../../../../../../tolle/src/lib/suggestion.component';

@Component({
    selector: 'app-suggestion-variants',
    standalone: true,
    imports: [SuggestionsComponent, SuggestionComponent],
    templateUrl: './suggestion-variants.component.html'
})
export class SuggestionVariantsComponent { }
