import { Component } from '@angular/core';
import { AvatarComponent } from '../../../../../../tolle/src/lib/avatar.component';
import { AvatarFallbackComponent } from '../../../../../../tolle/src/lib/avatar-fallback.component';

@Component({
    selector: 'app-avatar-sizes',
    imports: [AvatarComponent, AvatarFallbackComponent],
    templateUrl: './avatar-sizes.component.html'
})
export class AvatarSizesComponent { }
