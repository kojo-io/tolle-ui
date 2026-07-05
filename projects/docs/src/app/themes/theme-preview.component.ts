import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DemoIconComponent } from './demo-icon.component';
import { ButtonComponent } from '../../../../tolle/src/lib/button.component';
import { BadgeComponent } from '../../../../tolle/src/lib/badge.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardContentComponent,
  CardFooterComponent,
} from '../../../../tolle/src/lib/card.component';
import { InputComponent } from '../../../../tolle/src/lib/input.component';
import { LabelComponent } from '../../../../tolle/src/lib/label.component';
import { CheckboxComponent } from '../../../../tolle/src/lib/checkbox.component';
import { SwitchComponent } from '../../../../tolle/src/lib/switch.component';
import { SelectComponent } from '../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../tolle/src/lib/select-item.component';
import { SelectGroupComponent } from '../../../../tolle/src/lib/select-group.component';
import { SelectSeparatorComponent } from '../../../../tolle/src/lib/select-separator.component';
import { SliderComponent } from '../../../../tolle/src/lib/slider.component';
import { ProgressComponent } from '../../../../tolle/src/lib/progress.component';
import { RadioGroupComponent } from '../../../../tolle/src/lib/radio-group.component';
import { RadioItemComponent } from '../../../../tolle/src/lib/radio-item.component';
import {
  TabsComponent,
  TabsListComponent,
  TabsTriggerComponent,
  TabsContentComponent,
} from '../../../../tolle/src/lib/tabs.component';
import { CalendarComponent } from '../../../../tolle/src/lib/calendar.component';
import { AvatarComponent } from '../../../../tolle/src/lib/avatar.component';
import { AvatarFallbackComponent } from '../../../../tolle/src/lib/avatar-fallback.component';
import { AlertComponent } from '../../../../tolle/src/lib/alert.component';
import { SeparatorComponent } from '../../../../tolle/src/lib/separator.component';
import { TooltipDirective } from '../../../../tolle/src/lib/tooltip.directive';
import { DataTableComponent, TableColumn } from '../../../../tolle/src/lib/data-table.component';
import { TolleCellDirective } from '../../../../tolle/src/lib/tolle-cell.directive';

interface Member {
  name: string;
  email: string;
  role: string;
  initials: string;
  online: boolean;
}

interface Payment {
  customer: string;
  email: string;
  status: 'paid' | 'pending' | 'failed';
  amount: string;
}

/**
 * The live "kitchen-sink" canvas — a realistic product dashboard composed from real
 * Tolle components so every theme knob (primary color, radius, typography, appearance,
 * icon set) is visible at a glance. Purely presentational; it reads no theme state
 * itself (the tokens flow in from `<html>` via ThemeService).
 */
@Component({
  selector: 'app-theme-preview',
  standalone: true,
  imports: [
    FormsModule,
    DemoIconComponent,
    ButtonComponent,
    BadgeComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    CardFooterComponent,
    InputComponent,
    LabelComponent,
    CheckboxComponent,
    SwitchComponent,
    SelectComponent,
    SelectItemComponent,
    SelectGroupComponent,
    SelectSeparatorComponent,
    SliderComponent,
    ProgressComponent,
    RadioGroupComponent,
    RadioItemComponent,
    TabsComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent,
    CalendarComponent,
    AvatarComponent,
    AvatarFallbackComponent,
    AlertComponent,
    SeparatorComponent,
    TooltipDirective,
    DataTableComponent,
    TolleCellDirective,
  ],
  template: `
    <div class="space-y-6 p-4 text-foreground md:p-6">

      <!-- Header -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p class="text-sm text-muted-foreground">Welcome back — here's what's happening today.</p>
        </div>
        <div class="flex items-center gap-2">
          <tolle-button variant="outline" size="sm" tolleTooltip="Search" placement="bottom">
            <app-demo-icon [iconSet]="iconSet" name="search" [size]="16" class="mr-1.5" /> Search
          </tolle-button>
          <tolle-button variant="default" size="sm">
            <app-demo-icon [iconSet]="iconSet" name="plus" [size]="16" class="mr-1.5" /> Add funds
          </tolle-button>
          <tolle-avatar size="default" alt="You" class="border border-border">
            <tolle-avatar-fallback>BK</tolle-avatar-fallback>
          </tolle-avatar>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        @for (s of stats; track s.label) {
          <tolle-card>
            <tolle-card-content>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-muted-foreground">{{ s.label }}</span>
                <span class="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                  <app-demo-icon [iconSet]="iconSet" [name]="s.icon" [size]="16" />
                </span>
              </div>
              <div class="mt-3 text-2xl font-bold tabular-nums">{{ s.value }}</div>
              <div class="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <app-demo-icon [iconSet]="iconSet" name="arrow-right" [size]="12" class="-rotate-45" />
                <span class="font-medium">{{ s.delta }}</span>
                <span class="text-muted-foreground">vs last month</span>
              </div>
            </tolle-card-content>
          </tolle-card>
        }
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <!-- Auth + controls column -->
        <div class="space-y-6 lg:col-span-2">
          <tolle-card>
            <tolle-card-header>
              <tolle-card-title>Account</tolle-card-title>
              <p class="text-sm text-muted-foreground">Manage how you sign in and get notified.</p>
            </tolle-card-header>
            <tolle-card-content>
              <tolle-tabs defaultValue="signin">
                <tolle-tabs-list class="grid w-full grid-cols-2">
                  <tolle-tabs-trigger value="signin">Sign in</tolle-tabs-trigger>
                  <tolle-tabs-trigger value="signup">Create account</tolle-tabs-trigger>
                </tolle-tabs-list>

                <tolle-tabs-content value="signin" class="pt-4">
                  <div class="space-y-4">
                    <div class="space-y-1.5">
                      <tolle-label for="pv-email">Email</tolle-label>
                      <tolle-input id="pv-email" type="email" placeholder="you@example.com" [(ngModel)]="email">
                        <app-demo-icon prefix [iconSet]="iconSet" name="mail" [size]="16" class="text-muted-foreground" />
                      </tolle-input>
                    </div>
                    <div class="space-y-1.5">
                      <tolle-label for="pv-pass">Password</tolle-label>
                      <tolle-input id="pv-pass" type="password" placeholder="••••••••" [(ngModel)]="password" />
                    </div>
                    <div class="flex items-center justify-between">
                      <label class="flex cursor-pointer items-center gap-2 text-sm">
                        <tolle-checkbox size="sm" [(ngModel)]="remember" /> Remember me
                      </label>
                      <a class="text-sm font-medium text-primary hover:underline">Forgot?</a>
                    </div>
                  </div>
                </tolle-tabs-content>

                <tolle-tabs-content value="signup" class="pt-4">
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-3">
                      <div class="space-y-1.5">
                        <tolle-label for="pv-first">First name</tolle-label>
                        <tolle-input id="pv-first" placeholder="Jane" [(ngModel)]="firstName" />
                      </div>
                      <div class="space-y-1.5">
                        <tolle-label for="pv-last">Last name</tolle-label>
                        <tolle-input id="pv-last" placeholder="Doe" [(ngModel)]="lastName" />
                      </div>
                    </div>
                    <div class="space-y-1.5">
                      <tolle-label>Role</tolle-label>
                      <tolle-select placeholder="Select a role" [(ngModel)]="role">
                        <tolle-select-group>Workspace</tolle-select-group>
                        <tolle-select-item value="admin">Admin</tolle-select-item>
                        <tolle-select-item value="editor">Editor</tolle-select-item>
                        <tolle-select-separator></tolle-select-separator>
                        <tolle-select-item value="viewer">Viewer</tolle-select-item>
                      </tolle-select>
                    </div>
                    <label class="flex cursor-pointer items-start gap-2 text-sm">
                      <tolle-checkbox size="sm" [(ngModel)]="terms" class="mt-0.5" />
                      <span>I agree to the <a class="font-medium text-primary hover:underline">Terms</a> and
                        <a class="font-medium text-primary hover:underline">Privacy Policy</a>.</span>
                    </label>
                  </div>
                </tolle-tabs-content>
              </tolle-tabs>
            </tolle-card-content>
            <tolle-card-footer class="flex items-center gap-2">
              <tolle-button variant="default">Continue</tolle-button>
              <tolle-button variant="outline">Cancel</tolle-button>
              <div class="flex-1"></div>
              <tolle-button variant="ghost" size="icon-sm" tolleTooltip="Settings">
                <app-demo-icon [iconSet]="iconSet" name="settings" [size]="18" />
              </tolle-button>
            </tolle-card-footer>
          </tolle-card>

          <!-- Buttons & badges showcase -->
          <tolle-card>
            <tolle-card-header>
              <tolle-card-title>Components</tolle-card-title>
            </tolle-card-header>
            <tolle-card-content class="space-y-5">
              <div class="flex flex-wrap items-center gap-2">
                <tolle-button variant="default" size="sm">Default</tolle-button>
                <tolle-button variant="secondary" size="sm">Secondary</tolle-button>
                <tolle-button variant="outline" size="sm">Outline</tolle-button>
                <tolle-button variant="ghost" size="sm">Ghost</tolle-button>
                <tolle-button variant="destructive" size="sm">Destructive</tolle-button>
                <tolle-button variant="link" size="sm">Link</tolle-button>
                <tolle-button variant="default" size="sm" [busy]="true">Saving</tolle-button>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <tolle-badge variant="default">Default</tolle-badge>
                <tolle-badge variant="secondary">Secondary</tolle-badge>
                <tolle-badge variant="outline">Outline</tolle-badge>
                <tolle-badge variant="destructive">Destructive</tolle-badge>
                <tolle-badge variant="secondary">
                  <app-demo-icon prefix [iconSet]="iconSet" name="star" [size]="12" class="mr-1" /> Featured
                </tolle-badge>
              </div>

              <tolle-separator></tolle-separator>

              <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Plan</span>
                  </div>
                  <tolle-radio-group [(ngModel)]="plan">
                    <tolle-radio-item value="free">Free — $0/mo</tolle-radio-item>
                    <tolle-radio-item value="pro">Pro — $12/mo</tolle-radio-item>
                    <tolle-radio-item value="team">Team — $32/mo</tolle-radio-item>
                  </tolle-radio-group>
                </div>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="font-medium">Volume</span>
                      <span class="tabular-nums text-muted-foreground">{{ volume }}%</span>
                    </div>
                    <tolle-slider [min]="0" [max]="100" [step]="1" [(ngModel)]="volume" />
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center justify-between text-sm">
                      <span class="font-medium">Storage</span>
                      <span class="tabular-nums text-muted-foreground">68%</span>
                    </div>
                    <tolle-progress [value]="68" />
                  </div>
                </div>
              </div>
            </tolle-card-content>
          </tolle-card>

          <!-- Recent payments table -->
          <tolle-card>
            <tolle-card-header>
              <tolle-card-title>Recent payments</tolle-card-title>
            </tolle-card-header>
            <tolle-card-content>
              <tolle-data-table
                [data]="payments"
                [columns]="paymentCols"
                [searchable]="false"
                [paginate]="false"
                [showSettings]="false"
                [allowColumnHiding]="false"
                size="sm"
              >
                <ng-template tolleCell="status" let-value>
                  <tolle-badge [variant]="statusVariant(value)" size="sm">{{ value }}</tolle-badge>
                </ng-template>
                <ng-template tolleCell="amount" let-value>
                  <span class="font-medium tabular-nums">{{ value }}</span>
                </ng-template>
              </tolle-data-table>
            </tolle-card-content>
          </tolle-card>
        </div>

        <!-- Side column -->
        <div class="space-y-6">
          <!-- Chart (uses --chart-1…5) -->
          <tolle-card>
            <tolle-card-header>
              <tolle-card-title>Overview</tolle-card-title>
              <p class="text-sm text-muted-foreground">Visitors by channel · last 8 weeks</p>
            </tolle-card-header>
            <tolle-card-content>
              <div class="flex h-36 items-end gap-1.5">
                @for (bar of chartBars; track $index) {
                  <div class="flex-1 rounded-t-sm transition-all" [style.height.%]="bar.h" [class]="'bg-chart-' + bar.c"></div>
                }
              </div>
              <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                @for (l of chartLegend; track l.label) {
                  <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span class="h-2.5 w-2.5 rounded-sm" [class]="'bg-chart-' + l.c"></span> {{ l.label }}
                  </div>
                }
              </div>
            </tolle-card-content>
          </tolle-card>

          <tolle-card class="py-3">
            <tolle-card-content class="flex justify-center px-3">
              <tolle-calendar [bordered]="false" [showQuickActions]="false" [(ngModel)]="date" />
            </tolle-card-content>
          </tolle-card>

          <tolle-card>
            <tolle-card-header>
              <tolle-card-title>Team members</tolle-card-title>
              <p class="text-sm text-muted-foreground">Invite your team to collaborate.</p>
            </tolle-card-header>
            <tolle-card-content class="space-y-4">
              @for (m of members; track m.email) {
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <tolle-avatar size="default" [alt]="m.name" class="border border-border">
                      <tolle-avatar-fallback>{{ m.initials }}</tolle-avatar-fallback>
                    </tolle-avatar>
                    @if (m.online) {
                      <span class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500"></span>
                    }
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-sm font-medium">{{ m.name }}</div>
                    <div class="truncate text-xs text-muted-foreground">{{ m.email }}</div>
                  </div>
                  <tolle-badge variant="outline" size="sm">{{ m.role }}</tolle-badge>
                </div>
              }
              <tolle-separator></tolle-separator>
              <div class="space-y-3">
                <label class="flex items-center justify-between text-sm">
                  <span>Email notifications</span>
                  <tolle-switch [(ngModel)]="notifications" />
                </label>
                <label class="flex items-center justify-between text-sm">
                  <span>Product updates</span>
                  <tolle-switch [(ngModel)]="marketing" />
                </label>
              </div>
            </tolle-card-content>
          </tolle-card>

          <tolle-alert variant="info" title="Pro tip">
            <app-demo-icon icon [iconSet]="iconSet" name="bell" [size]="16" />
            Ship a preset URL to your team and everyone gets the same theme.
          </tolle-alert>
        </div>
      </div>
    </div>
  `,
})
export class ThemePreviewComponent {
  /** Icon set to render preview glyphs in (mirrors the generator control). */
  @Input() iconSet = 'remix';

  // demo state
  email = 'jane@acme.io';
  password = '';
  firstName = '';
  lastName = '';
  remember = true;
  terms = true;
  notifications = true;
  marketing = false;
  plan = 'pro';
  role = 'admin';
  volume = 60;
  date: Date = new Date(2026, 6, 15);

  stats = [
    { label: 'Revenue', value: '$45,231', delta: '+20.1%', icon: 'dollar' },
    { label: 'Subscribers', value: '+2,350', delta: '+180.1%', icon: 'users' },
    { label: 'Sales', value: '+12,234', delta: '+19%', icon: 'card' },
    { label: 'Active now', value: '+573', delta: '+201', icon: 'activity' },
  ];

  chartBars = [
    { h: 42, c: 1 }, { h: 68, c: 2 }, { h: 55, c: 3 }, { h: 88, c: 4 },
    { h: 47, c: 5 }, { h: 63, c: 1 }, { h: 79, c: 2 }, { h: 58, c: 3 },
  ];

  chartLegend = [
    { label: 'Direct', c: 1 },
    { label: 'Organic', c: 2 },
    { label: 'Referral', c: 3 },
    { label: 'Social', c: 4 },
    { label: 'Email', c: 5 },
  ];

  members: Member[] = [
    { name: 'Sofia Davis', email: 'sofia@acme.io', role: 'Owner', initials: 'SD', online: true },
    { name: 'Jackson Lee', email: 'jackson@acme.io', role: 'Member', initials: 'JL', online: false },
    { name: 'Isabella Nguyen', email: 'isabella@acme.io', role: 'Member', initials: 'IN', online: true },
  ];

  payments: Payment[] = [
    { customer: 'Liam Johnson', email: 'liam@example.com', status: 'paid', amount: '$250.00' },
    { customer: 'Olivia Smith', email: 'olivia@example.com', status: 'pending', amount: '$150.00' },
    { customer: 'Noah Williams', email: 'noah@example.com', status: 'failed', amount: '$350.00' },
    { customer: 'Emma Brown', email: 'emma@example.com', status: 'paid', amount: '$450.00' },
  ];

  paymentCols: TableColumn[] = [
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount', class: 'text-right' },
  ];

  statusVariant(status: string): 'default' | 'secondary' | 'outline' | 'destructive' {
    if (status === 'paid') return 'default';
    if (status === 'failed') return 'destructive';
    return 'outline';
  }
}
