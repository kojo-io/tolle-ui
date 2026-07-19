import { Component, inject } from '@angular/core';
import {RouterLink} from '@angular/router';
import { RegistryNavService } from '../shared/registry-nav.service';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './components.component.html',
  styleUrl: './components.component.css'
})
export class ComponentsComponent {
  private nav = inject(RegistryNavService);

  /**
   * Driven by the same source as the sidebar so this index can't drift — it was
   * previously ~50 hand-written anchors and had already fallen behind. Each item
   * carries its `badge` ('New'), which originates from a `@new` JSDoc tag on the
   * component source and travels through the generated registry manifest.
   */
  readonly components = this.nav.allComponents;
}
