import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SkeletonComponent } from '../../../../../../tolle/src/lib/skeleton.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-skeleton-interactive',
    imports: [
    FormsModule,
    SkeletonComponent,
    SelectComponent,
    SelectItemComponent,
    PlaygroundComponent
],
    templateUrl: './skeleton-interactive.component.html'
})
export class SkeletonInteractiveComponent {
    variant: 'rect' | 'circle' | 'pill' = 'rect';

    get playgroundCode(): string {
        return `<tolle-skeleton variant="${this.variant}" class="${this.variant === 'circle' ? 'h-12 w-12' : 'h-4 w-[250px]'}" />`;
    }
}
