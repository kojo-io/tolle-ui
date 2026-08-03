import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextareaComponent } from '../../../../../../tolle/src/lib/textarea.component';

@Component({
    selector: 'app-basic-textarea-example',
    imports: [CommonModule, FormsModule, TextareaComponent],
    template: `
    <div class="w-full max-w-sm space-y-4">
      <tolle-textarea
        label="Bio"
        placeholder="Tell us a little bit about yourself."
        hint="You can @mention other users and organizations."
        [rows]="3"
      ></tolle-textarea>
    </div>
  `
})
export class BasicTextareaExampleComponent { }
