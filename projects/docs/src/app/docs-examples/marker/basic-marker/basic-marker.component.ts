import { Component } from '@angular/core';
import { MarkerComponent } from '../../../../../../tolle/src/lib/marker.component';

@Component({
    selector: 'app-basic-marker',
    standalone: true,
    imports: [MarkerComponent],
    templateUrl: './basic-marker.component.html'
})
export class BasicMarkerComponent { }
