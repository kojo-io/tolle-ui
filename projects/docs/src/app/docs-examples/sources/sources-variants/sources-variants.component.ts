import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    SourcesComponent,
    SourcesTriggerComponent,
    SourcesContentComponent,
    SourceComponent
} from '../../../../../../tolle/src/lib/sources.component';

@Component({
    selector: 'app-sources-variants',
    standalone: true,
    imports: [
        CommonModule,
        SourcesComponent,
        SourcesTriggerComponent,
        SourcesContentComponent,
        SourceComponent
    ],
    templateUrl: './sources-variants.component.html'
})
export class SourcesVariantsComponent {
    readonly sources = [
        {
            href: 'https://angular.dev/guide/signals',
            title: 'Angular — Signals',
            favicon: 'https://angular.dev/assets/icons/favicon-16x16.png'
        },
        {
            href: 'https://rxjs.dev/guide/subject',
            title: 'RxJS — Subject',
            favicon: 'https://rxjs.dev/assets/images/favicons/favicon-16x16.png'
        }
    ];
}
