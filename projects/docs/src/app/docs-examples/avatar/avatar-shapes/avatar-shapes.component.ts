import { Component } from '@angular/core';
import { AvatarComponent } from '../../../../../../tolle/src/lib/avatar.component';
import { AvatarFallbackComponent } from '../../../../../../tolle/src/lib/avatar-fallback.component';

@Component({
    selector: 'app-avatar-shapes',
    imports: [AvatarComponent, AvatarFallbackComponent],
    templateUrl: './avatar-shapes.component.html'
})
export class AvatarShapesComponent { }
