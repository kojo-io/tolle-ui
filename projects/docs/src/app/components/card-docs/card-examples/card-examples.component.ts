import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentPreviewComponent } from '../../../shared/component-preview/component-preview.component';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BasicCardComponent } from '../../../docs-examples/card/basic-card.component';
import { FullCardComponent } from '../../../docs-examples/card/full-card.component';
import { FormCardComponent } from '../../../docs-examples/card/form-card.component';

@Component({
  selector: 'app-card-examples',
  standalone: true,
  imports: [
    CommonModule,
    ComponentPreviewComponent,
    BasicCardComponent,
    FullCardComponent,
    FormCardComponent
  ],
  template: `
    <section class="mb-16" id="examples">
      <h2 class="mb-6 scroll-m-20 text-xl font-semibold tracking-tight">Examples</h2>

      <div class="space-y-12">
        <div id="basic" class="space-y-3">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Basic</h3>
          <p class="text-muted-foreground">A simple card with a title and content area.</p>
          <app-preview [code]="basicCode" language="typescript">
            <app-basic-card />
          </app-preview>
        </div>

        <div id="full" class="space-y-3">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Full Card</h3>
          <p class="text-muted-foreground">A complete card using header, content, and footer sub-components.</p>
          <app-preview [code]="fullCode" language="typescript">
            <app-full-card />
          </app-preview>
        </div>

        <div id="form" class="space-y-3">
          <h3 class="scroll-m-20 text-lg font-semibold tracking-tight">Form Card</h3>
          <p class="text-muted-foreground">A complex card containing input fields and mixed content.</p>
          <app-preview [code]="formCode" language="typescript">
            <app-form-card />
          </app-preview>
        </div>
      </div>
    </section>
  `
})
export class CardExamplesComponent {
  sourceService = inject(SourceCodeService);

  basicCode = '';
  fullCode = '';
  formCode = '';

  constructor() {
    this.sourceService.getFile('card/basic-card.component.ts').subscribe(code => this.basicCode = code);
    this.sourceService.getFile('card/full-card.component.ts').subscribe(code => this.fullCode = code);
    this.sourceService.getFile('card/form-card.component.ts').subscribe(code => this.formCode = code);
  }
}
