import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountrySelectorComponent } from '../../../../../../tolle/src/lib/country-selector.component';

@Component({
  selector: 'app-basic-country-selector-example',
  standalone: true,
  imports: [CommonModule, CountrySelectorComponent],
  template: `
    <div class="w-full max-w-xs">
      <tolle-country-selector defaultCountryCode="GH"></tolle-country-selector>
    </div>
  `,
})
export class BasicCountrySelectorExampleComponent { }
