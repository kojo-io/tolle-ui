import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { OtpOverviewComponent } from './otp-overview/otp-overview.component';
import { OtpInteractiveComponent } from './otp-interactive/otp-interactive.component';
import { OtpApiComponent } from './otp-api/otp-api.component';

@Component({
    selector: 'app-otp-docs',
    standalone: true,
    imports: [
        OtpOverviewComponent,
        OtpInteractiveComponent,
        OtpApiComponent
    ],
    templateUrl: './otp-docs.component.html',
    styleUrl: './otp-docs.component.css'
})
export class OtpDocsComponent {
    baseService = inject(BaseService);
}
