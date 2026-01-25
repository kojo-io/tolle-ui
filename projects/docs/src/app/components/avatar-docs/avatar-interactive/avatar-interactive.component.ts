import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarComponent } from '../../../../../../tolle/src/lib/avatar.component';
import { AvatarFallbackComponent } from '../../../../../../tolle/src/lib/avatar-fallback.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { InputComponent } from '../../../../../../tolle/src/lib/input.component';

@Component({
    selector: 'app-avatar-interactive',
    standalone: true,
    imports: [
        FormsModule,
        AvatarComponent,
        AvatarFallbackComponent,
        PlaygroundComponent,
        SelectComponent,
        SelectItemComponent,
        InputComponent
    ],
    templateUrl: './avatar-interactive.component.html'
})
export class AvatarInteractiveComponent {
    size: 'sm' | 'default' | 'lg' | 'xl' = 'default';
    shape: 'circle' | 'square' = 'circle';
    src: string = 'https://github.com/nutlope.png';
    fallbackText: string = 'JD';

    get playgroundCode() {
        return `<tolle-avatar src="${this.src}" size="${this.size}" shape="${this.shape}">
  <tolle-avatar-fallback>${this.fallbackText}</tolle-avatar-fallback>
</tolle-avatar>`;
    }
}
