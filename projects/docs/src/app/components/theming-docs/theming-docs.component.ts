import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { ThemingOverviewComponent } from './theming-overview/theming-overview.component';
import { ThemingColorsComponent } from './theming-colors/theming-colors.component';
import { ThemingConfigComponent } from './theming-config/theming-config.component';
import { ThemingIntegrationComponent } from './theming-integration/theming-integration.component';
import { ThemingOverridesComponent } from './theming-overrides/theming-overrides.component';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';


@Component({
    selector: 'app-theming-docs',
    imports: [
        CommonModule,
        ThemingOverviewComponent,
        ThemingColorsComponent,
        ThemingConfigComponent,
        ThemingIntegrationComponent,
        ThemingOverridesComponent,
        DocsWrapperComponent
    ],
    templateUrl: './theming-docs.component.html'
})
export class ThemingDocsComponent {
    baseService = inject(BaseService);
}
