import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RegistryNavService, NavItem } from '../shared/registry-nav.service';
import { ThemeService } from '../../../../tolle/src/lib/theme.service';
import { ButtonComponent } from '../../../../tolle/src/lib/button.component';
import { BadgeComponent } from '../../../../tolle/src/lib/badge.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  CardFooterComponent,
} from '../../../../tolle/src/lib/card.component';
import { AlertComponent } from '../../../../tolle/src/lib/alert.component';
import { AvatarComponent } from '../../../../tolle/src/lib/avatar.component';
import { SwitchComponent } from '../../../../tolle/src/lib/switch.component';
import { CheckboxComponent } from '../../../../tolle/src/lib/checkbox.component';
import { InputComponent } from '../../../../tolle/src/lib/input.component';
import { CalendarComponent } from '../../../../tolle/src/lib/calendar.component';
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
} from '../../../../tolle/src/lib/tabs.component';

interface Category {
  name: string;
  count: number;
  icon: string;
  items: NavItem[];
}

/** Icons per registry category. `RegistryNavService`'s groups don't carry icons. */
const CATEGORY_ICON: Record<string, string> = {
  Actions: 'ri-cursor-line',
  Forms: 'ri-input-method-line',
  Overlays: 'ri-layout-top-line',
  Layout: 'ri-layout-grid-line',
  Feedback: 'ri-notification-3-line',
  'Date & Time': 'ri-calendar-line',
  Navigation: 'ri-guide-line',
  Data: 'ri-table-line',
  Media: 'ri-image-line',
  'AI & Chat': 'ri-chat-3-line',
  Utilities: 'ri-tools-line',
};

/** Sidebar groups that are navigation chrome, not component categories. */
const NON_COMPONENT_GROUPS = new Set(['Getting Started', 'AI Native']);

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonComponent,
    BadgeComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    CardFooterComponent,
    AlertComponent,
    AvatarComponent,
    SwitchComponent,
    CheckboxComponent,
    InputComponent,
    CalendarComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
  ],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  protected theme = inject(ThemeService);
  private registryNav = inject(RegistryNavService);
  protected copied = false;

  // demo state for the featured component tiles
  protected email = '';
  protected notif = true;
  protected terms = true;

  /** Registry categories → primary components; re-syncs with the shipped registry. */
  protected categories = computed<Category[]>(() =>
    this.registryNav
      .groups()
      .filter((g) => !NON_COMPONENT_GROUPS.has(g.title))
      .map((g) => ({
        name: g.title,
        count: g.items.length,
        icon: CATEGORY_ICON[g.title] ?? 'ri-puzzle-line',
        items: g.items,
      }))
  );

  /** Total documented components, for the hero badge. */
  protected totalComponents = computed(() => this.registryNav.allComponents().length);

  protected toggleTheme(): void {
    this.theme.toggleTheme();
  }

  protected copyCli(cmd = 'npx @tolle_/cli add button'): void {
    navigator.clipboard?.writeText(cmd);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1200);
  }
}
