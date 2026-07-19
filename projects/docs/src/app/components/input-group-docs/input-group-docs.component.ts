import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { InputGroupSearchComponent } from '../../docs-examples/input-group/input-group-search/input-group-search.component';
import { InputGroupAddonsComponent } from '../../docs-examples/input-group/input-group-addons/input-group-addons.component';
import { InputGroupStackedComponent } from '../../docs-examples/input-group/input-group-stacked/input-group-stacked.component';


@Component({
  selector: 'app-input-group-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    InputGroupSearchComponent,
    InputGroupAddonsComponent,
    InputGroupStackedComponent
  ],
  templateUrl: './input-group-docs.component.html',
  styleUrl: './input-group-docs.component.css'
})
export class InputGroupDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  InputGroupComponent,
  InputGroupAddonComponent,
  InputGroupButtonComponent,
  InputGroupTextComponent,
  InputGroupInputComponent,
  InputGroupTextareaComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [InputGroupComponent, InputGroupAddonComponent, InputGroupInputComponent]
})`;

  searchCode = `<tolle-input-group>
  <tolle-input-group-addon>
    <i class="ri-search-line"></i>
  </tolle-input-group-addon>
  <tolle-input-group-input
    id="component-search"
    type="search"
    placeholder="Search components"
    [(ngModel)]="query" />
</tolle-input-group>

<tolle-input-group size="sm">
  <tolle-input-group-addon>
    <i class="ri-search-line"></i>
  </tolle-input-group-addon>
  <tolle-input-group-input type="search" placeholder="Small" />
</tolle-input-group>`;

  addonsCode = `<tolle-input-group>
  <tolle-input-group-addon>
    <tolle-input-group-text>$</tolle-input-group-text>
  </tolle-input-group-addon>

  <tolle-input-group-input
    id="invoice-amount"
    type="text"
    placeholder="0.00"
    ariaDescribedby="invoice-amount-hint"
    [(ngModel)]="amount" />

  <tolle-input-group-addon align="inline-end">
    <tolle-input-group-text>USD</tolle-input-group-text>
    <tolle-input-group-button
      variant="ghost"
      size="icon-sm"
      ariaLabel="Clear amount"
      (clicked)="clear()">
      <i class="ri-close-line"></i>
    </tolle-input-group-button>
  </tolle-input-group-addon>
</tolle-input-group>

<tolle-input-group>
  <tolle-input-group-input id="invite-link" [readonly]="true" [(ngModel)]="inviteLink" />

  <tolle-input-group-addon align="inline-end">
    <tolle-input-group-button
      variant="outline"
      size="sm"
      ariaLabel="Copy invite link"
      (clicked)="copy()">
      {{ copied ? 'Copied' : 'Copy' }}
    </tolle-input-group-button>
  </tolle-input-group-addon>
</tolle-input-group>`;

  stackedCode = `<tolle-input-group [stacked]="true" [invalid]="tooLong">
  <tolle-input-group-textarea
    id="review-comment"
    [rows]="4"
    placeholder="Leave a comment"
    ariaDescribedby="review-comment-hint"
    class="px-3"
    [(ngModel)]="comment" />

  <tolle-input-group-addon align="block-end" class="justify-between">
    <tolle-input-group-text id="review-comment-hint">
      {{ remaining }} characters left
    </tolle-input-group-text>

    <tolle-input-group-button
      variant="default"
      size="sm"
      ariaLabel="Send comment"
      [disabled]="!comment.trim() || tooLong"
      (clicked)="send()">
      <i class="ri-send-plane-line"></i>
      Send
    </tolle-input-group-button>
  </tolle-input-group-addon>
</tolle-input-group>`;

  groupProps: PropEntry[] = [
    { name: 'size', type: "'xs' | 'sm' | 'default' | 'lg'", default: "'default'", description: 'Height and text size of the group; match it to the control inside.' },
    { name: 'invalid', type: 'boolean', default: 'false', description: 'Applies the destructive border and focus ring.' },
    { name: 'stacked', type: 'boolean', default: 'false', description: 'Switches to a column layout so `block-start` / `block-end` addons can stack above and below the control.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the group.' }
  ];

  addonProps: PropEntry[] = [
    { name: 'align', type: "'inline-start' | 'inline-end' | 'block-start' | 'block-end'", default: "'inline-start'", description: 'Where the addon sits relative to the control. The `block-*` values require `stacked` on the group.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the addon.' }
  ];

  buttonProps: PropEntry[] = [
    { name: 'variant', type: "'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'", default: "'ghost'", description: 'Visual style of the button.' },
    { name: 'size', type: "'xs' | 'sm' | 'icon-xs' | 'icon-sm'", default: "'icon-sm'", description: 'Size of the button; the `icon-*` sizes render a square.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name — required when the button shows only an icon.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the button.' },
    { name: 'clicked', type: 'EventEmitter<MouseEvent>', description: 'Output — emitted with the click event when the button is pressed.' }
  ];

  textProps: PropEntry[] = [
    { name: 'class', type: 'string', description: 'Additional CSS classes for the text — a unit, prefix, or character counter inside an addon.' }
  ];

  inputProps: PropEntry[] = [
    { name: 'id', type: 'string', default: 'auto-generated', description: 'Id applied to the underlying `<input>`.' },
    { name: 'type', type: 'string', default: "'text'", description: 'Native input type.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the input read-only.' },
    { name: 'ariaDescribedby', type: 'string', default: "''", description: 'Id of the element describing this input, for `aria-describedby`.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the input.' },
    { name: 'valueChange', type: 'EventEmitter<string>', description: 'Output — emitted with the new value on every keystroke. The component is also a `ControlValueAccessor`, so `ngModel` and `formControl` work directly.' }
  ];

  textareaProps: PropEntry[] = [
    { name: 'id', type: 'string', default: 'auto-generated', description: 'Id applied to the underlying `<textarea>`.' },
    { name: 'rows', type: 'number', default: '3', description: 'Visible rows.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the textarea.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the textarea read-only.' },
    { name: 'ariaDescribedby', type: 'string', default: "''", description: 'Id of the element describing this textarea, for `aria-describedby`.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the textarea.' },
    { name: 'valueChange', type: 'EventEmitter<string>', description: 'Output — emitted with the new value on every keystroke. The component is also a `ControlValueAccessor`, so `ngModel` and `formControl` work directly.' }
  ];
}
