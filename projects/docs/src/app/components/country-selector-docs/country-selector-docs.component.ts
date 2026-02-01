import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { CountrySelectorOverviewComponent } from './country-selector-overview/country-selector-overview.component';
import { CountrySelectorInteractiveComponent } from './country-selector-interactive/country-selector-interactive.component';
import { CountrySelectorApiComponent } from './country-selector-api/country-selector-api.component';

@Component({
  selector: 'app-country-selector-docs',
  standalone: true,
  imports: [
    CommonModule,
    DocsWrapperComponent,
    CountrySelectorOverviewComponent,
    CountrySelectorInteractiveComponent,
    CountrySelectorApiComponent
  ],
  template: `
    <app-docs-wrapper [tocTemplate]="toc">
      <div content class="space-y-12">
        <app-country-selector-overview id="overview" />
        <app-country-selector-interactive id="playground" />
        <app-country-selector-api id="api-reference" />
      </div>

      <ng-template #toc>
        <ul class="flex flex-col gap-2 text-sm">
          <li>
            <a (click)="baseService.scrollTo('overview')"
               class="block cursor-pointer text-[0.8rem] text-muted-foreground transition-all duration-200 hover:ml-2 hover:text-foreground">
              Overview
            </a>
          </li>
          <li>
            <a (click)="baseService.scrollTo('playground')"
               class="block cursor-pointer text-[0.8rem] text-muted-foreground transition-all duration-200 hover:ml-2 hover:text-foreground">
              Playground
            </a>
          </li>
          <li>
            <a (click)="baseService.scrollTo('api-reference')"
               class="block cursor-pointer text-[0.8rem] text-muted-foreground transition-all duration-200 hover:ml-2 hover:text-foreground">
              API Reference
            </a>
          </li>
        </ul>
      </ng-template>
    </app-docs-wrapper>
  `,
})
export class CountrySelectorDocsComponent {
  baseService = inject(BaseService);
}
