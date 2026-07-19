import { Component } from '@angular/core';
import {
    ChainOfThoughtComponent,
    ChainOfThoughtHeaderComponent,
    ChainOfThoughtContentComponent,
    ChainOfThoughtStepComponent,
    ChainOfThoughtSearchResultsComponent,
    ChainOfThoughtSearchResultComponent
} from '../../../../../../tolle/src/lib/chain-of-thought.component';

@Component({
    selector: 'app-basic-chain-of-thought',
    standalone: true,
    imports: [
        ChainOfThoughtComponent,
        ChainOfThoughtHeaderComponent,
        ChainOfThoughtContentComponent,
        ChainOfThoughtStepComponent,
        ChainOfThoughtSearchResultsComponent,
        ChainOfThoughtSearchResultComponent
    ],
    templateUrl: './basic-chain-of-thought.component.html'
})
export class BasicChainOfThoughtComponent { }
