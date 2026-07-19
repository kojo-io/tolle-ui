import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { SidebarComponent } from '../../../../../tolle/src/lib/sidebar.component';
import { ThemeService } from '../../../../../tolle/src/lib/theme.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgStyle } from '@angular/common';
import { coloris, init } from '@melloware/coloris';
import { TooltipDirective } from '../../../../../tolle/src/lib/tooltip.directive';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RegistryNavService, NavItem, CATEGORY_ICON } from '../../shared/registry-nav.service';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommandDialogComponent } from '../../../../../tolle/src/lib/command-dialog.component';
import {
  CommandComponent,
  CommandInputComponent,
  CommandListComponent,
  CommandGroupComponent,
  CommandItemComponent,
  CommandEmptyComponent,
  CommandShortcutComponent,
} from '../../../../../tolle/src/lib/command.component';


@Component({
  selector: 'app-doc-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    SidebarComponent,
    TooltipDirective,
    ReactiveFormsModule,
    NgStyle,
    FormsModule,
    AsyncPipe,
    CommandDialogComponent,
    CommandComponent,
    CommandInputComponent,
    CommandListComponent,
    CommandGroupComponent,
    CommandItemComponent,
    CommandEmptyComponent,
    CommandShortcutComponent,
  ],
  templateUrl: './doc-layout.component.html',
  styleUrl: './doc-layout.component.css'
})
export class DocLayoutComponent implements OnInit {
  ngOnInit(): void {
    init();
    coloris({
      el: '.bg-coloris',
      theme: 'polaroid',
      themeMode: 'dark',
      formatToggle: true,
      closeButton: true,
      clearButton: true,
    });
    const base = this.theme.primaryColor;
    if (base) {
      this.theme.setPrimaryColor(base, true);
    }
  }
  isCollapsed = false;
  mobileMenuOpen = false;
  theme = inject(ThemeService);
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 1024px)'])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  changeBrand(value: string) {
    this.theme.setPrimaryColor(value, true); // purple
  }

  toggle() {
    this.theme.toggleTheme();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
  // Sidebar menu — grouped by the component registry's categories (RegistryNavService),
  // kept in sync with the shipped /registry/manifest.json.
  private nav = inject(RegistryNavService);
  navGroups = this.nav.groups;

  // ⌘K search — reuses the same registry groups as the sidebar, so results
  // never drift from what's actually shipped.
  private router = inject(Router);
  protected commandPaletteOpen = false;

  protected openCommandPalette(): void {
    this.commandPaletteOpen = true;
  }

  /** Falls back to the item's category icon, then a generic page icon. */
  protected iconFor(item: NavItem, groupTitle: string): string {
    return item.icon ?? CATEGORY_ICON[groupTitle] ?? 'ri-file-list-2-line';
  }

  protected onCommandSelected(item: NavItem): void {
    this.commandPaletteOpen = false;
    if (item.external) {
      window.open(item.url, '_blank', 'noopener');
    } else {
      this.router.navigateByUrl(item.url);
    }
  }
}
