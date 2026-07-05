import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicButtonGroupComponent } from '../../../docs-examples/button-group/basic-button-group.component';
import { MixedButtonGroupComponent } from '../../../docs-examples/button-group/mixed-button-group.component';

@Component({
  selector: 'app-button-group-examples',
  standalone: true,
  imports: [
    CommonModule,
    ComponentPreviewComponent,
    BasicButtonGroupComponent,
    MixedButtonGroupComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="mb-6 scroll-m-20 text-xl font-semibold tracking-tight">Examples</h2>

      <!-- Basic -->
      <div class="mb-12 space-y-3" id="basic">
        <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Basic</h3>
        <p class="text-muted-foreground">Standard button grouping with various variants.</p>
        <app-preview [code]="basicCode" language="typescript">
          <app-basic-button-group />
        </app-preview>
      </div>

      <!-- Mixed -->
      <div class="space-y-3" id="mixed">
        <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Mixed Content</h3>
        <p class="text-muted-foreground">Combining text, icons, and different sizes within a group.</p>
        <app-preview [code]="mixedCode" language="typescript">
          <app-mixed-button-group />
        </app-preview>
      </div>
    </section>
  `
})
export class ButtonGroupExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicCode = '';
  mixedCode = '';

  constructor() {
    this.sourceService.getFile('button-group/basic-button-group.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('button-group/mixed-button-group.component.ts').subscribe(code => this.mixedCode = code);
  }
}
