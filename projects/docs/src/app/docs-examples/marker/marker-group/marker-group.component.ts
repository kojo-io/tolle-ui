import { Component } from '@angular/core';
import { MarkerComponent, MarkerGroupComponent } from '../../../../../../tolle/src/lib/marker.component';

@Component({
    selector: 'app-marker-group',
    imports: [MarkerComponent, MarkerGroupComponent],
    templateUrl: './marker-group.component.html'
})
export class MarkerGroupExampleComponent { }
