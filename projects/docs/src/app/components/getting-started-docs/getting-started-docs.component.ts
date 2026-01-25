import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../shared/base.service';
import { GSIntroductionComponent } from './gs-introduction/gs-introduction.component';
import { GSInstallationComponent } from './gs-installation/gs-installation.component';
import { GSSetupComponent } from './gs-setup/gs-setup.component';

@Component({
    selector: 'app-getting-started-docs',
    standalone: true,
    imports: [
        CommonModule,
        GSIntroductionComponent,
        GSInstallationComponent,
        GSSetupComponent
    ],
    templateUrl: './getting-started-docs.component.html'
})
export class GettingStartedDocsComponent {
    baseService = inject(BaseService);
}
