import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { PhoneNumberInputOverviewComponent } from './phone-number-input-overview/phone-number-input-overview.component';
import { PhoneNumberInputInteractiveComponent } from './phone-number-input-interactive/phone-number-input-interactive.component';
import { PhoneNumberInputApiComponent } from './phone-number-input-api/phone-number-input-api.component';

@Component({
    selector: 'app-phone-number-input-docs',
    standalone: true,
    imports: [
        CommonModule,
        DocsWrapperComponent,
        PhoneNumberInputOverviewComponent,
        PhoneNumberInputInteractiveComponent,
        PhoneNumberInputApiComponent
    ],
    template: `
    <app-docs-wrapper [tocTemplate]="toc">
      <div content class="space-y-12">
        <app-phone-number-input-overview id="overview" />
        <app-phone-number-input-interactive id="playground" />
        <app-phone-number-input-api id="api-reference" />
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
export class PhoneNumberInputDocsComponent {
    baseService = inject(BaseService);
}
