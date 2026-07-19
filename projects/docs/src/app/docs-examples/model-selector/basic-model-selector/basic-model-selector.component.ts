import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    ModelSelectorComponent,
    ModelOption
} from '../../../../../../tolle/src/lib/model-selector.component';

@Component({
    selector: 'app-basic-model-selector',
    standalone: true,
    imports: [CommonModule, FormsModule, ModelSelectorComponent],
    templateUrl: './basic-model-selector.component.html'
})
export class BasicModelSelectorComponent {
    /** Grouped by `provider` — models sharing one land under a single heading. */
    readonly models: ModelOption[] = [
        { id: 'opus-4', name: 'Opus 4', provider: 'Anthropic', description: 'Deepest reasoning' },
        { id: 'sonnet-4', name: 'Sonnet 4', provider: 'Anthropic', description: 'Balanced speed and quality' },
        { id: 'haiku-4', name: 'Haiku 4', provider: 'Anthropic', description: 'Fastest, lowest cost' }
    ];

    modelId: string | null = 'sonnet-4';
}
