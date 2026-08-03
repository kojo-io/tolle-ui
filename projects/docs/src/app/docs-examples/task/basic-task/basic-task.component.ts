import { Component } from '@angular/core';
import {
  TaskComponent,
  TaskTriggerComponent,
  TaskContentComponent,
  TaskItemComponent
} from '../../../../../../tolle/src/lib/task.component';

@Component({
    selector: 'app-basic-task',
    imports: [TaskComponent, TaskTriggerComponent, TaskContentComponent, TaskItemComponent],
    templateUrl: './basic-task.component.html'
})
export class BasicTaskComponent { }
