import { Component, OnDestroy } from '@angular/core';
import {
    AttachmentComponent,
    AttachmentProps
} from '../../../../../../tolle/src/lib/attachment.component';

@Component({
    selector: 'app-attachment-states',
    standalone: true,
    imports: [AttachmentComponent],
    templateUrl: './attachment-states.component.html'
})
export class AttachmentStatesComponent implements OnDestroy {
    state: AttachmentProps['state'] = 'uploading';
    progress = 35;

    private timer?: ReturnType<typeof setInterval>;

    start(): void {
        this.stop();
        this.state = 'uploading';
        this.progress = 0;

        this.timer = setInterval(() => {
            this.progress += 8;
            if (this.progress >= 100) {
                this.progress = 100;
                this.state = 'idle';
                this.stop();
            }
        }, 220);
    }

    fail(): void {
        this.stop();
        this.state = 'error';
    }

    ngOnDestroy(): void {
        this.stop();
    }

    private stop(): void {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }
}
