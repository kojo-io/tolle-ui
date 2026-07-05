import { Component, inject } from '@angular/core';
import { BaseService } from '../../../shared/base.service';

@Component({
    selector: 'app-gs-installation',
    standalone: true,
    templateUrl: './gs-installation.component.html'
})
export class GSInstallationComponent {
    baseService = inject(BaseService);
    install = 'npm install @tolle_/tolle-ui date-fns tailwind-merge clsx embla-carousel @floating-ui/dom class-variance-authority remixicon';
}
