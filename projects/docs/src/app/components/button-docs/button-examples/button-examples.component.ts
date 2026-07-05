import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicButtonComponent } from '../../../docs-examples/button/basic-button.component';
import { DestructiveButtonComponent } from '../../../docs-examples/button/destructive-button.component';
import { IconButtonComponent } from '../../../docs-examples/button/icon-button.component';
import { BusyButtonComponent } from '../../../docs-examples/button/busy-button.component';

@Component({
  selector: 'app-button-examples',
  standalone: true,
  imports: [
    CommonModule,
    ComponentPreviewComponent,
    BasicButtonComponent,
    DestructiveButtonComponent,
    IconButtonComponent,
    BusyButtonComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="mb-6 scroll-m-20 text-xl font-semibold tracking-tight">Examples</h2>

      <!-- Basic -->
      <div class="mb-12 space-y-3" id="basic">
        <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Basic</h3>
        <p class="text-muted-foreground">Standard variants and sizes for common use cases.</p>
        <app-preview [code]="basicCode" language="typescript">
          <app-basic-button />
        </app-preview>
      </div>

      <!-- Destructive -->
      <div class="mb-12 space-y-3" id="destructive">
        <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Destructive</h3>
        <p class="text-muted-foreground">Use for actions that result in data loss or other high-risk operations.</p>
        <app-preview [code]="destructiveCode" language="typescript">
          <app-destructive-button />
        </app-preview>
      </div>

      <!-- Icon -->
      <div class="mb-12 space-y-3" id="icon">
        <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Icons</h3>
        <p class="text-muted-foreground">Buttons can contain icons alongside text or as standalone icon buttons.</p>
        <app-preview [code]="iconCode" language="typescript">
          <app-icon-button />
        </app-preview>
      </div>

      <!-- Busy -->
      <div class="space-y-3" id="busy">
        <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Busy State</h3>
        <p class="text-muted-foreground">Indicate an ongoing process by setting the
          <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary">busy</code> prop.
        </p>
        <app-preview [code]="busyCode" language="typescript">
          <app-busy-button />
        </app-preview>
      </div>
    </section>
  `
})
export class ButtonExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicCode = '';
  destructiveCode = '';
  iconCode = '';
  busyCode = '';

  constructor() {
    this.sourceService.getFile('button/basic-button.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('button/destructive-button.component.ts').subscribe(code => this.destructiveCode = code);
    this.sourceService.getFile('button/icon-button.component.ts').subscribe(code => this.iconCode = code);
    this.sourceService.getFile('button/busy-button.component.ts').subscribe(code => this.busyCode = code);
  }
}
