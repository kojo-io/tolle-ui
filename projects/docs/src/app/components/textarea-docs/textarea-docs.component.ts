import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextareaOverviewComponent } from './textarea-overview/textarea-overview.component';
import { TextareaInteractiveComponent } from './textarea-interactive/textarea-interactive.component';
import { TextareaApiComponent } from './textarea-api/textarea-api.component';

@Component({
    selector: 'app-textarea-docs',
    standalone: true,
    imports: [
        CommonModule,
        TextareaOverviewComponent,
        TextareaInteractiveComponent,
        TextareaApiComponent
    ],
    templateUrl: './textarea-docs.component.html',
    styleUrls: ['./textarea-docs.component.css']
})
export class TextareaDocsComponent {
    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
