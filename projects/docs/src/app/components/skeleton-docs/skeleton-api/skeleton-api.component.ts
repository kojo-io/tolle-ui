import { Component } from '@angular/core';
import { PropEntry } from '../../../shared/types';
import { PropTableComponent } from '../../../shared/prop-table/prop-table.component';

@Component({
    selector: 'app-skeleton-api',
    standalone: true,
    imports: [PropTableComponent],
    templateUrl: './skeleton-api.component.html'
})
export class SkeletonApiComponent {
    componentProps: PropEntry[] = [
        { name: 'variant', description: 'The visual shape of the skeleton.', type: "'rect' | 'circle' | 'pill'", default: "'rect'" },
        { name: 'class', description: 'Additional CSS classes to apply (used for sizing).', type: 'string', default: "''" }
    ];
}
