import { Component } from '@angular/core';
import { BarListComponent } from '../../../../../../tolle/src/lib/bar-list.component';

@Component({
    selector: 'app-bar-list-in-a-card',
    standalone: true,
    imports: [BarListComponent],
    styles: [':host { display: block; width: 100%; }'],
    templateUrl: './bar-list-in-a-card.component.html'
})
export class BarListInACardComponent {
    pages = [
        { path: '/pricing', views: 12840 },
        { path: '/docs/getting-started', views: 9310 },
        { path: '/blog/v2-launch', views: 6720 },
        { path: '/docs/components', views: 4150 },
        { path: '/changelog', views: 1890 }
    ];
}
