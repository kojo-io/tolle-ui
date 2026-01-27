import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicOtpExampleComponent } from '../../../docs-examples/otp/basic-otp-example/basic-otp-example.component';
import { ManualOtpExampleComponent } from '../../../docs-examples/otp/manual-otp-example/manual-otp-example.component';

@Component({
    selector: 'app-otp-overview',
    imports: [AsyncPipe, BaseEditorComponent, BasicOtpExampleComponent, ManualOtpExampleComponent],
    templateUrl: './otp-overview.component.html'
})
export class OtpOverviewComponent {
    private sourceCodeService = inject(SourceCodeService);
    basicCode$ = this.sourceCodeService.getFile('docs-examples/otp/basic-otp-example/basic-otp-example.component.ts');
    manualCode$ = this.sourceCodeService.getFile('docs-examples/otp/manual-otp-example/manual-otp-example.component.ts');
}
