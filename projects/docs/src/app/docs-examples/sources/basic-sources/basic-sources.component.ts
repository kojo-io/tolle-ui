import { Component } from '@angular/core';
import {
    SourcesComponent,
    SourcesTriggerComponent,
    SourcesContentComponent,
    SourceComponent
} from '../../../../../../tolle/src/lib/sources.component';

@Component({
    selector: 'app-basic-sources',
    standalone: true,
    imports: [SourcesComponent, SourcesTriggerComponent, SourcesContentComponent, SourceComponent],
    templateUrl: './basic-sources.component.html'
})
export class BasicSourcesComponent {}
