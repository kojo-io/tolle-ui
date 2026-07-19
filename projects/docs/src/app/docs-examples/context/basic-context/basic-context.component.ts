import { Component } from '@angular/core';
import { ContextComponent } from '../../../../../../tolle/src/lib/context.component';

@Component({
    selector: 'app-basic-context',
    standalone: true,
    imports: [ContextComponent],
    templateUrl: './basic-context.component.html'
})
export class BasicContextComponent {}
