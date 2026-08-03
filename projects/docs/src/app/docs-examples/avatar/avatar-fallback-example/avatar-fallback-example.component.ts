import { Component } from '@angular/core';
import { AvatarComponent } from '../../../../../../tolle/src/lib/avatar.component';
import { AvatarFallbackComponent } from '../../../../../../tolle/src/lib/avatar-fallback.component';

@Component({
    selector: 'app-avatar-fallback-example',
    imports: [AvatarComponent, AvatarFallbackComponent],
    templateUrl: './avatar-fallback-example.component.html'
})
export class AvatarFallbackExampleComponent { }
