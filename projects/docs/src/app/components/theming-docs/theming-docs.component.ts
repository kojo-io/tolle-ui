import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { ThemingOverviewComponent } from './theming-overview/theming-overview.component';
import { ThemingColorsComponent } from './theming-colors/theming-colors.component';
import { ThemingConfigComponent } from './theming-config/theming-config.component';
import { ThemingIntegrationComponent } from './theming-integration/theming-integration.component';
import { ThemingOverridesComponent } from './theming-overrides/theming-overrides.component';

@Component({
    selector: 'app-theming-docs',
    standalone: true,
    imports: [
        CommonModule,
        ThemingOverviewComponent,
        ThemingColorsComponent,
        ThemingConfigComponent,
        ThemingIntegrationComponent,
        ThemingOverridesComponent
    ],
    templateUrl: './theming-docs.component.html'
})
export class ThemingDocsComponent {
    baseService = inject(BaseService);
}
