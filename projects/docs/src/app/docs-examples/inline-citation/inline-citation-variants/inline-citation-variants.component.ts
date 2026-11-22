import { Component } from '@angular/core';

import {
  InlineCitationComponent,
  InlineCitationCardComponent,
  InlineCitationProps,
} from '../../../../../../tolle/src/lib/inline-citation.component';

@Component({
  selector: 'app-inline-citation-variants',
  imports: [InlineCitationComponent, InlineCitationCardComponent],
  templateUrl: './inline-citation-variants.component.html',
})
export class InlineCitationVariantsComponent {
  readonly variants: NonNullable<InlineCitationProps['variant']>[] = ['default', 'muted', 'subtle'];
}
