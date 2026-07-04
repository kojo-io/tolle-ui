import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  items: string[];
}

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
  protected copied = false;

  // demo state for the featured component tiles
  protected email = '';
  protected notif = true;
  protected terms = true;

  /** Registry categories → primary components (mirrors the docs sidebar mapping). */
  protected categories: Category[] = [
    { name: 'Actions', count: 4, icon: 'ri-cursor-line', items: ['Button', 'Button Group', 'Toggle', 'Toggle Group'] },
    { name: 'Forms', count: 15, icon: 'ri-input-method-line', items: ['Input', 'Textarea', 'Select', 'Multi-select', 'Checkbox', 'Switch', 'Radio Group', 'Slider', 'Segment', 'Tag Input', 'OTP', 'Label', 'Masked Input', 'Country Selector', 'Phone Number'] },
    { name: 'Overlays', count: 8, icon: 'ri-layout-top-line', items: ['Dialog', 'Alert Dialog', 'Sheet', 'Popover', 'Hover Card', 'Tooltip', 'Dropdown Menu', 'Context Menu'] },
    { name: 'Layout', count: 9, icon: 'ri-layout-grid-line', items: ['Card', 'Accordion', 'Tabs', 'Collapsible', 'Sidebar', 'Resizable', 'Scroll Area', 'Separator', 'Aspect Ratio'] },
    { name: 'Feedback', count: 6, icon: 'ri-notification-3-line', items: ['Alert', 'Badge', 'Progress', 'Skeleton', 'Toast', 'Empty State'] },
    { name: 'Date & Time', count: 4, icon: 'ri-calendar-line', items: ['Calendar', 'Range Calendar', 'Date Picker', 'Date Range Picker'] },
    { name: 'Navigation', count: 2, icon: 'ri-guide-line', items: ['Breadcrumb', 'Pagination'] },
    { name: 'Data', count: 1, icon: 'ri-table-line', items: ['Data Table'] },
    { name: 'Media', count: 2, icon: 'ri-image-line', items: ['Avatar', 'Carousel'] },
  ];

  protected toggleTheme(): void {
    this.theme.toggleTheme();
  }

  protected copyCli(cmd = 'npx tolle add button'): void {
    navigator.clipboard?.writeText(cmd);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1200);
  }
}
