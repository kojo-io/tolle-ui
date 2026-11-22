import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TagInputComponent } from '../../../../../../tolle/src/lib/tag-input.component';

@Component({
  selector: 'app-basic-tag-input',
  imports: [FormsModule, TagInputComponent],
  template: `
    <div class="w-full max-w-md">
      <!-- The value is a string[]; Enter or the delimiter adds a tag. -->
      <tolle-tag-input
        label="Skills"
        hint="Press Enter or comma to add"
        placeholder="Add a skill"
        [maxTags]="5"
        [(ngModel)]="skills"></tolle-tag-input>
      <p class="mt-2 text-sm text-muted-foreground">{{ skills.length }} / 5</p>
    </div>
  `,
})
export class BasicTagInputComponent {
  skills: string[] = ['Angular', 'TypeScript'];
}
