import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    ModelSelectorComponent,
    ModelOption
} from '../../../../../../tolle/src/lib/model-selector.component';

@Component({
    selector: 'app-model-selector-variants',
    standalone: true,
    imports: [CommonModule, FormsModule, ModelSelectorComponent],
    templateUrl: './model-selector-variants.component.html'
})
export class ModelSelectorVariantsComponent {
    readonly models: ModelOption[] = [
        { id: 'opus-4', name: 'Opus 4', provider: 'Anthropic' },
        { id: 'sonnet-4', name: 'Sonnet 4', provider: 'Anthropic' },
        { id: 'haiku-4', name: 'Haiku 4', provider: 'Anthropic' }
    ];

    modelId: string | null = 'haiku-4';
    lastChange = '';

    onModelChange(model: ModelOption | null): void {
        this.lastChange = model ? `modelChange → ${model.provider} / ${model.name}` : '';
    }
}
