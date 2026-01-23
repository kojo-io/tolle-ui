import { Component } from '@angular/core';
import { BadgeComponent } from '../../../../../../tolle/src/lib/badge.component';

@Component({
    selector: 'app-badge-sizes',
    standalone: true,
    imports: [BadgeComponent],
    templateUrl: './badge-sizes.component.html'
})
export class BadgeSizesComponent { }
