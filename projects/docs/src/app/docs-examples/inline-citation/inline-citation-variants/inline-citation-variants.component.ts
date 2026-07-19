import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    InlineCitationComponent,
    InlineCitationCardComponent,
    InlineCitationProps
} from '../../../../../../tolle/src/lib/inline-citation.component';

@Component({
    selector: 'app-inline-citation-variants',
    standalone: true,
    imports: [CommonModule, InlineCitationComponent, InlineCitationCardComponent],
    templateUrl: './inline-citation-variants.component.html'
})
export class InlineCitationVariantsComponent {
    readonly variants: NonNullable<InlineCitationProps['variant']>[] = ['default', 'muted', 'subtle'];
}
