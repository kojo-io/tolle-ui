import { Component } from '@angular/core';
import { AvatarComponent } from '../../../../../../tolle/src/lib/avatar.component';
import { AvatarFallbackComponent } from '../../../../../../tolle/src/lib/avatar-fallback.component';

@Component({
    selector: 'app-basic-avatar',
    standalone: true,
    imports: [AvatarComponent, AvatarFallbackComponent],
    templateUrl: './basic-avatar.component.html'
})
export class BasicAvatarComponent { }
