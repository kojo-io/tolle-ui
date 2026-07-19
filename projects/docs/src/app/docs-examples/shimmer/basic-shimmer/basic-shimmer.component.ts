import { Component } from '@angular/core';
import { ShimmerComponent } from '../../../../../../tolle/src/lib/shimmer.component';

@Component({
    selector: 'app-basic-shimmer',
    standalone: true,
    imports: [ShimmerComponent],
    templateUrl: './basic-shimmer.component.html'
})
export class BasicShimmerComponent { }
