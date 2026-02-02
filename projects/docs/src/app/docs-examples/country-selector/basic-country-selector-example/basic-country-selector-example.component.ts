import { Component } from '@angular/core';
import { CountrySelectorComponent } from '../../../../../../tolle/src/public-api';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-basic-country-selector-example',
    standalone: true,
    imports: [CountrySelectorComponent, FormsModule, JsonPipe],
    template: `
    <div class="flex flex-col gap-4 max-w-sm">
      <tolle-country-selector
        [(ngModel)]="selectedCountry"
        placeholder="Select a country"
      ></tolle-country-selector>

      <div class="p-4 rounded-md bg-muted text-xs font-mono">
        Selected: {{ selectedCountry | json }}
      </div>
    </div>
  `
})
export class BasicCountrySelectorExampleComponent {
    selectedCountry = 'GH';
}
