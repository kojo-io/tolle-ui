import { Component } from '@angular/core';
import { DirectionDirective } from '../../../../../../tolle/src/lib/direction.component';

@Component({
    selector: 'app-basic-direction',
    standalone: true,
    imports: [DirectionDirective],
    templateUrl: './basic-direction.component.html'
})
export class BasicDirectionComponent { }
