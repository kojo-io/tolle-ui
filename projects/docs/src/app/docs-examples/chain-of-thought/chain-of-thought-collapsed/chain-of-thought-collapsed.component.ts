import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    ChainOfThoughtComponent,
    ChainOfThoughtHeaderComponent,
    ChainOfThoughtContentComponent,
    ChainOfThoughtStepComponent,
    ChainOfThoughtSearchResultsComponent,
    ChainOfThoughtSearchResultComponent
} from '../../../../../../tolle/src/lib/chain-of-thought.component';

@Component({
    selector: 'app-chain-of-thought-collapsed',
    standalone: true,
    imports: [
        CommonModule,
        ChainOfThoughtComponent,
        ChainOfThoughtHeaderComponent,
        ChainOfThoughtContentComponent,
        ChainOfThoughtStepComponent,
        ChainOfThoughtSearchResultsComponent,
        ChainOfThoughtSearchResultComponent
    ],
    templateUrl: './chain-of-thought-collapsed.component.html'
})
export class ChainOfThoughtCollapsedComponent {
    open = false;

    sources = ['angular.dev/guide/signals', 'rxjs.dev/api/operators', 'tolle-ui/theme.css'];

    onOpenChange(open: boolean): void {
        this.open = open;
    }
}
