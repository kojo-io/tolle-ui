import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ToolComponent,
    ToolHeaderComponent,
    ToolInputComponent,
    ToolOutputComponent,
    ToolState
} from '../../../../../../tolle/src/lib/tool.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-tool-lifecycle',
    standalone: true,
    imports: [
        CommonModule,
        ToolComponent,
        ToolHeaderComponent,
        ToolInputComponent,
        ToolOutputComponent,
        ButtonComponent
    ],
    templateUrl: './tool-lifecycle.component.html'
})
export class ToolLifecycleComponent implements OnDestroy {
    /** Drives the header chip and the tool's border colour. */
    state: ToolState = 'pending';
    open = false;
    output: unknown = null;

    readonly input = { table: 'sessions', where: { active: true }, limit: 2 };

    private timers: ReturnType<typeof setTimeout>[] = [];

    run(): void {
        this.reset();
        this.state = 'running';
        this.open = true;

        this.timers.push(
            setTimeout(() => {
                this.output = [
                    { id: 'ses_18f2', model: 'sonnet', tokens: 8210 },
                    { id: 'ses_18f3', model: 'opus', tokens: 15044 }
                ];
                this.state = 'success';
            }, 1600)
        );
    }

    ngOnDestroy(): void {
        this.reset();
    }

    private reset(): void {
        this.timers.forEach(clearTimeout);
        this.timers = [];
        this.output = null;
        this.state = 'pending';
    }
}
