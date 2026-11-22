import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleGroupComponent, ToggleGroupItemComponent } from '../../../../../../tolle/src/lib/toggle-group.component';

@Component({
  selector: 'app-basic-toggle-group',
  imports: [FormsModule, ToggleGroupComponent, ToggleGroupItemComponent],
  template: `
    <div class="grid gap-6">
      <!-- type="single": the value is one item's value (string). -->
      <tolle-toggle-group type="single" variant="outline" [(ngModel)]="align">
        <tolle-toggle-group-item value="left" aria-label="Align left"><i class="ri-align-left"></i></tolle-toggle-group-item>
        <tolle-toggle-group-item value="center" aria-label="Align center"><i class="ri-align-center"></i></tolle-toggle-group-item>
        <tolle-toggle-group-item value="right" aria-label="Align right"><i class="ri-align-right"></i></tolle-toggle-group-item>
      </tolle-toggle-group>

      <!-- type="multiple": the value is an array of item values. -->
      <tolle-toggle-group type="multiple" [(ngModel)]="styles">
        <tolle-toggle-group-item value="bold" aria-label="Bold"><i class="ri-bold"></i></tolle-toggle-group-item>
        <tolle-toggle-group-item value="italic" aria-label="Italic"><i class="ri-italic"></i></tolle-toggle-group-item>
        <tolle-toggle-group-item value="underline" aria-label="Underline"><i class="ri-underline"></i></tolle-toggle-group-item>
      </tolle-toggle-group>

      <p class="text-sm text-muted-foreground">Align: {{ align }} · Styles: {{ styles.join(', ') || 'none' }}</p>
    </div>
  `,
})
export class BasicToggleGroupComponent {
  align = 'left';
  styles: string[] = ['bold'];
}
