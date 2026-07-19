import { Component } from '@angular/core';
import {
    ToolComponent,
    ToolHeaderComponent,
    ToolInputComponent,
    ToolOutputComponent
} from '../../../../../../tolle/src/lib/tool.component';

@Component({
    selector: 'app-tool-states',
    standalone: true,
    imports: [ToolComponent, ToolHeaderComponent, ToolInputComponent, ToolOutputComponent],
    templateUrl: './tool-states.component.html'
})
export class ToolStatesComponent {}
