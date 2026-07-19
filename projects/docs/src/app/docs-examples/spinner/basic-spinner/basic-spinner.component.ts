import { Component } from '@angular/core';
import { SpinnerComponent } from '../../../../../../tolle/src/lib/spinner.component';

@Component({
    selector: 'app-basic-spinner',
    standalone: true,
    imports: [SpinnerComponent],
    templateUrl: './basic-spinner.component.html'
})
export class BasicSpinnerComponent { }
