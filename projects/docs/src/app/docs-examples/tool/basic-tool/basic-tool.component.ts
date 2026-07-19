import { Component } from '@angular/core';
import {
    ToolComponent,
    ToolHeaderComponent,
    ToolInputComponent,
    ToolOutputComponent
} from '../../../../../../tolle/src/lib/tool.component';

@Component({
    selector: 'app-basic-tool',
    standalone: true,
    imports: [ToolComponent, ToolHeaderComponent, ToolInputComponent, ToolOutputComponent],
    templateUrl: './basic-tool.component.html'
})
export class BasicToolComponent {
    /** Objects are pretty-printed as JSON by the panels. */
    readonly input = { query: 'context window', limit: 3, section: 'ai' };

    readonly output = {
        results: [
            { slug: 'context', title: 'Context' },
            { slug: 'reasoning', title: 'Reasoning' },
            { slug: 'sources', title: 'Sources' }
        ]
    };
}
