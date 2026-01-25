import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownMenuOverviewComponent } from './dropdown-menu-overview/dropdown-menu-overview.component';
import { DropdownMenuInteractiveComponent } from './dropdown-menu-interactive/dropdown-menu-interactive.component';
import { BaseService } from '../../shared/base.service';
import { DropdownMenuApiComponent } from './dropdown-menu-api/dropdown-menu-api.component';

@Component({
  selector: 'app-dropdown-menu-docs',
  standalone: true,
  imports: [
    CommonModule,
    DropdownMenuOverviewComponent,
    DropdownMenuInteractiveComponent,
    DropdownMenuApiComponent
  ],
  templateUrl: './dropdown-menu-docs.component.html'
})
export class DropdownMenuDocsComponent {
  baseService = inject(BaseService);
}
