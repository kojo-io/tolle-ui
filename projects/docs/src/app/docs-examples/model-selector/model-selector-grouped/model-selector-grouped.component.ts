import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
    ModelSelectorComponent,
    ModelOption
} from '../../../../../../tolle/src/lib/model-selector.component';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-model-selector-grouped',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ModelSelectorComponent, ButtonComponent],
    templateUrl: './model-selector-grouped.component.html'
})
export class ModelSelectorGroupedComponent {
    private readonly fb = inject(FormBuilder);

    /** Group order follows first appearance, and so does the order within a group. */
    readonly models: ModelOption[] = [
        { id: 'opus-4', name: 'Opus 4', provider: 'Anthropic', description: 'Deepest reasoning', badge: 'new' },
        { id: 'sonnet-4', name: 'Sonnet 4', provider: 'Anthropic', description: 'Balanced speed and quality' },
        { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Long context window' },
        { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'Google', description: 'Not enabled on this plan', disabled: true },
        { id: 'llama-70b', name: 'Llama 70B', provider: 'Meta', description: 'Open weights', badge: 'preview' }
    ];

    readonly form = this.fb.nonNullable.group({
        model: this.fb.control<string | null>('gemini-pro')
    });
}
