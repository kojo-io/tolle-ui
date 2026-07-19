import { Component } from '@angular/core';
import {
    InlineCitationComponent,
    InlineCitationCardComponent,
    InlineCitationQuoteComponent
} from '../../../../../../tolle/src/lib/inline-citation.component';

@Component({
    selector: 'app-inline-citation-quote',
    standalone: true,
    imports: [InlineCitationComponent, InlineCitationCardComponent, InlineCitationQuoteComponent],
    templateUrl: './inline-citation-quote.component.html'
})
export class InlineCitationQuoteExampleComponent {}
