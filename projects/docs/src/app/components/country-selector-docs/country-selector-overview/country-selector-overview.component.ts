import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { SourceCodeService } from '../../../shared/source-code.service';
import { BaseEditorComponent } from '../../../shared/base-editor/base-editor.component';
import { BasicCountrySelectorExampleComponent } from '../../../docs-examples/country-selector/basic-country-selector-example/basic-country-selector-example.component';

@Component({
  selector: 'app-country-selector-overview',
  standalone: true,
  imports: [CommonModule, AsyncPipe, BaseEditorComponent, BasicCountrySelectorExampleComponent],
  templateUrl: './country-selector-overview.component.html'
})
export class CountrySelectorOverviewComponent {
  private sourceCodeService = inject(SourceCodeService);
  basicCode$ = this.sourceCodeService.getFile('docs-examples/country-selector/basic-country-selector-example/basic-country-selector-example.component.ts');
}
