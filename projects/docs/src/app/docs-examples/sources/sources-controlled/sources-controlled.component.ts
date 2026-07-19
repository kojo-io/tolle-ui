import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    SourcesComponent,
    SourcesTriggerComponent,
    SourcesContentComponent,
    SourceComponent
} from '../../../../../../tolle/src/lib/sources.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-sources-controlled',
    standalone: true,
    imports: [
        CommonModule,
        SourcesComponent,
        SourcesTriggerComponent,
        SourcesContentComponent,
        SourceComponent,
        ButtonComponent
    ],
    templateUrl: './sources-controlled.component.html'
})
export class SourcesControlledComponent {
    open = false;
    lastEvent = '';

    onOpenChange(open: boolean): void {
        this.lastEvent = `openChange emitted ${open}`;
    }
}
