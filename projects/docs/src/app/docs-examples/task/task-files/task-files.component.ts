import { Component } from '@angular/core';
import {
  TaskComponent,
  TaskTriggerComponent,
  TaskContentComponent,
  TaskItemComponent,
  TaskItemFileComponent
} from '../../../../../../tolle/src/lib/task.component';

@Component({
    selector: 'app-task-files',
    standalone: true,
    imports: [
      TaskComponent,
      TaskTriggerComponent,
      TaskContentComponent,
      TaskItemComponent,
      TaskItemFileComponent
    ],
    templateUrl: './task-files.component.html'
})
export class TaskFilesComponent {
  open = true;
}
