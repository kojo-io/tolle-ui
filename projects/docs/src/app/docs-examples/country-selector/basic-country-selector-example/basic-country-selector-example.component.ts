import { Component } from '@angular/core';

import { CountrySelectorComponent } from '../../../../../../tolle/src/lib/country-selector.component';

@Component({
  selector: 'app-basic-country-selector-example',
  imports: [CountrySelectorComponent],
  template: `
    <div class="w-full max-w-xs">
      <tolle-country-selector defaultCountryCode="GH"></tolle-country-selector>
    </div>
  `,
})
export class BasicCountrySelectorExampleComponent {}
