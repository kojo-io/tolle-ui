import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-sheet-api',
    imports: [PropTableComponent],
    template: `
    <section id="api-reference" class="mb-16">
      <h2 class="text-2xl font-bold mb-6 text-foreground">API Reference</h2>

      <h3 class="text-xl font-semibold mb-4 text-foreground">Sheet</h3>
      <app-prop-table [props]="sheetProps"></app-prop-table>

      <h3 class="text-xl font-semibold mb-4 mt-12 text-foreground">SheetContent</h3>
      <app-prop-table [props]="contentProps"></app-prop-table>

      <h3 class="text-xl font-semibold mb-4 mt-12 text-foreground">SheetService</h3>
      <app-prop-table [props]="serviceProps"></app-prop-table>

      <h3 class="text-xl font-semibold mb-4 mt-12 text-foreground">SheetConfig</h3>
      <app-prop-table [props]="configProps"></app-prop-table>
    </section>
  `
})
export class SheetApiComponent {
  sheetProps: PropEntry[] = [
    { name: 'isOpen', description: 'The controlled open state of the sheet.', type: 'boolean', default: 'false' },
    { name: 'hasBackdrop', description: 'Whether the sheet has a backdrop.', type: 'boolean', default: 'true' },
    { name: 'isOpenChange', description: 'Event emitted when the open state changes.', type: 'EventEmitter<boolean>', default: '-' }
  ];

  contentProps: PropEntry[] = [
    { name: 'side', description: 'The edge of the screen where the component will appear.', type: '"top" | "bottom" | "left" | "right"', default: '"right"' },
    { name: 'rounded', description: 'Whether the sheet content has rounded corners on its inner side.', type: 'boolean', default: 'false' },
    { name: 'class', description: 'Additional CSS classes for styling.', type: 'string', default: "''" }
  ];

  serviceProps: PropEntry[] = [
    { name: 'open(config)', description: 'Opens a sheet with the provided configuration.', type: '(config: SheetConfig) => SheetRef', default: '-' }
  ];

  configProps: PropEntry[] = [
    { name: 'content', description: 'The content to display (String, Component, or Template).', type: 'string | Type<any> | TemplateRef<any>', default: '-' },
    { name: 'title', description: 'Optional title for the standard header.', type: 'string', default: '-' },
    { name: 'description', description: 'Optional description for the standard header.', type: 'string', default: '-' },
    { name: 'side', description: 'The edge of the screen where the component will appear.', type: '"top" | "bottom" | "left" | "right"', default: '"right"' },
    { name: 'hasBackdrop', description: 'Whether the sheet has a backdrop.', type: 'boolean', default: 'true' },
    { name: 'backdropClose', description: 'If true, clicking the backdrop closes the sheet.', type: 'boolean', default: 'true' },
    { name: 'showCloseButton', description: 'Whether to show the close button.', type: 'boolean', default: 'true' },
    { name: 'rounded', description: 'Whether the sheet content has rounded corners on its inner side.', type: 'boolean', default: 'false' },
    { name: 'data', description: 'Data to pass to a Component content.', type: '{ [key: string]: any }', default: '-' },
    { name: 'context', description: 'Context to pass to a TemplateRef content.', type: 'any', default: '-' },
    { name: 'class', description: 'Additional CSS classes for the sheet content.', type: 'string', default: '-' }
  ];
}
