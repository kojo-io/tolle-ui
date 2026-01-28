import { Component, inject } from '@angular/core';
import { BaseService } from '../../../shared/base.service';

@Component({
    selector: 'app-gs-installation',
    standalone: true,
    templateUrl: './gs-installation.component.html'
})
export class GSInstallationComponent {
    baseService = inject(BaseService);
    install = 'npm install @tolle_/tolle-ui@18.2.1 date-fns@4.1.0 tailwind-merge@3.4.2 clsx@2.1.1 embla-carousel@8.5.2 @floating-ui/dom@1.7.4 class-variance-authority@0.7.1 remixicon@4.5.0';
}
