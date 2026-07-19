import { Component } from '@angular/core';
import { DirectionDirective } from '../../../../../../tolle/src/lib/direction.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

type Dir = 'ltr' | 'rtl';

@Component({
    selector: 'app-direction-toggle',
    standalone: true,
    imports: [DirectionDirective, InputComponent, ButtonComponent],
    templateUrl: './direction-toggle.component.html'
})
export class DirectionToggleComponent {
  dir: Dir = 'ltr';

  toggle() {
    this.dir = this.dir === 'ltr' ? 'rtl' : 'ltr';
  }
}
