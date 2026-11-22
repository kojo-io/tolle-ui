import { Component } from '@angular/core';
import { AttachmentComponent } from '../../../../../../tolle/src/lib/attachment.component';

@Component({
    selector: 'app-basic-attachment',
    imports: [AttachmentComponent],
    templateUrl: './basic-attachment.component.html'
})
export class BasicAttachmentComponent {
    opened = 0;
    removed = 0;
}
