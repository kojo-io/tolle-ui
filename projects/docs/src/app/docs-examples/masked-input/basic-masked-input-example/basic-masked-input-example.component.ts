import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaskedInputComponent } from '../../../../../../tolle/src/lib/masked-input.component';

@Component({
    selector: 'app-basic-masked-input-example',
    imports: [CommonModule, FormsModule, MaskedInputComponent],
    template: `
    <div class="w-full max-w-sm space-y-4">
      <tolle-masked-input
        label="Credit Card"
        mask="0000 0000 0000 0000"
        placeholder="0000 0000 0000 0000"
        [(ngModel)]="creditCard"
      ><i prefix class="ri-bank-card-line text-muted-foreground"></i>
      </tolle-masked-input>

      <div class="text-sm text-muted-foreground">
        Value: {{ creditCard }}
      </div>
    </div>
  `
})
export class BasicMaskedInputExampleComponent {
    creditCard = '';
}
