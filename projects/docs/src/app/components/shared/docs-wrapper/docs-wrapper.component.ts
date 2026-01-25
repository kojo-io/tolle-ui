import { Component, inject, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { ButtonComponent } from '../../../../../../tolle/src/lib/button.component';

@Component({
    selector: 'app-docs-wrapper',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './docs-wrapper.component.html',
    styleUrl: './docs-wrapper.component.css'
})
export class DocsWrapperComponent {
    private breakpointObserver = inject(BreakpointObserver);

    isMobile$ = this.breakpointObserver.observe(['(max-width: 1280px)'])
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    @Input() tocTemplate?: TemplateRef<any>;

    tocOpen = false;

    toggleToc() {
        this.tocOpen = !this.tocOpen;
    }
}
