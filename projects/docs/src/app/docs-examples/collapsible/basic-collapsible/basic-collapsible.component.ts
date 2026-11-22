import { Component } from '@angular/core';
import {
  CollapsibleComponent,
  CollapsibleTriggerComponent,
  CollapsibleContentComponent,
} from '../../../../../../tolle/src/lib/collapsible.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
  selector: 'app-basic-collapsible',
  imports: [CollapsibleComponent, CollapsibleTriggerComponent, CollapsibleContentComponent, ButtonComponent],
  template: `
    <tolle-collapsible [(open)]="open" class="w-full max-w-sm space-y-2">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-semibold">3 starred repositories</h4>
        <tolle-collapsible-trigger>
          <tolle-button variant="ghost" size="icon-sm" [attr.aria-label]="open ? 'Collapse' : 'Expand'">
            <i [class]="open ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
          </tolle-button>
        </tolle-collapsible-trigger>
      </div>
      <div class="rounded-md border px-4 py-2 text-sm">angular/angular</div>
      <tolle-collapsible-content>
        <div class="space-y-2">
          <div class="rounded-md border px-4 py-2 text-sm">angular/components</div>
          <div class="rounded-md border px-4 py-2 text-sm">tailwindlabs/tailwindcss</div>
        </div>
      </tolle-collapsible-content>
    </tolle-collapsible>
  `,
})
export class BasicCollapsibleComponent {
  open = false;
}
