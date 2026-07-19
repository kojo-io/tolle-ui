import { Component } from '@angular/core';
import {
    AttachmentComponent,
    AttachmentGroupComponent,
    AttachmentActionsComponent
} from '../../../../../../tolle/src/lib/attachment.component';
import {
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent
} from '../../../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../../../tolle/src/lib/bubble.component';

interface DemoFile {
    name: string;
    size: number;
    type: string;
}

@Component({
    selector: 'app-attachment-in-message',
    standalone: true,
    imports: [
        AttachmentComponent,
        AttachmentGroupComponent,
        AttachmentActionsComponent,
        MessageComponent,
        MessageAvatarComponent,
        MessageContentComponent,
        BubbleComponent
    ],
    templateUrl: './attachment-in-message.component.html'
})
export class AttachmentInMessageComponent {
    files: DemoFile[] = [
        { name: 'audit-summary.pdf', size: 198656, type: 'application/pdf' },
        { name: 'findings.csv', size: 3072, type: 'text/csv' },
        { name: 'screenshots.zip', size: 6291456, type: 'application/zip' }
    ];
}
