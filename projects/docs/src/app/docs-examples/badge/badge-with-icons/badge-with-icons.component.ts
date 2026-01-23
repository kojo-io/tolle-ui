import { Component } from '@angular/core';
import { BadgeComponent } from '../../../../../../tolle/src/lib/badge.component';

@Component({
    selector: 'app-badge-with-icons',
    standalone: true,
    imports: [BadgeComponent],
    templateUrl: './badge-with-icons.component.html'
})
export class BadgeWithIconsComponent { }
