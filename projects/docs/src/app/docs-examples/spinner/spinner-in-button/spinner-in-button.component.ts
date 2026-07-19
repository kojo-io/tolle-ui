import { Component } from '@angular/core';
import { SpinnerComponent } from '../../../../../../tolle/src/lib/spinner.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-spinner-in-button',
    standalone: true,
    imports: [SpinnerComponent, ButtonComponent],
    templateUrl: './spinner-in-button.component.html'
})
export class SpinnerInButtonComponent { }
