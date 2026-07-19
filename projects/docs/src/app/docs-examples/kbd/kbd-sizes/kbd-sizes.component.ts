import { Component } from '@angular/core';
import { KbdComponent } from '../../../../../../tolle/src/lib/kbd.component';

@Component({
    selector: 'app-kbd-sizes',
    standalone: true,
    imports: [KbdComponent],
    templateUrl: './kbd-sizes.component.html'
})
export class KbdSizesComponent { }
