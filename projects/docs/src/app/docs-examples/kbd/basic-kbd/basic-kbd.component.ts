import { Component } from '@angular/core';
import { KbdComponent } from '../../../../../../tolle/src/lib/kbd.component';

@Component({
    selector: 'app-basic-kbd',
    standalone: true,
    imports: [KbdComponent],
    templateUrl: './basic-kbd.component.html'
})
export class BasicKbdComponent { }
