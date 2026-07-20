import { Component } from '@angular/core';
import { BarListComponent } from '../../../../../../tolle/src/lib/bar-list.component';

@Component({
    selector: 'app-basic-bar-list',
    standalone: true,
    imports: [BarListComponent],
    styles: [':host { display: block; width: 100%; }'],
    templateUrl: './basic-bar-list.component.html'
})
export class BasicBarListComponent {
    traffic = [
        { source: 'Organic search', sessions: 4820 },
        { source: 'Direct', sessions: 2140 },
        { source: 'Referral', sessions: 1275 },
        { source: 'Social', sessions: 640 }
    ];
}
