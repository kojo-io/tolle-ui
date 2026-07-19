import { Component } from '@angular/core';
import {
    InlineCitationComponent,
    InlineCitationCardComponent
} from '../../../../../../tolle/src/lib/inline-citation.component';

@Component({
    selector: 'app-basic-inline-citation',
    standalone: true,
    imports: [InlineCitationComponent, InlineCitationCardComponent],
    templateUrl: './basic-inline-citation.component.html'
})
export class BasicInlineCitationComponent {}
