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
import {
  FieldComponent,
  FieldLabelComponent,
  FieldDescriptionComponent,
} from '../../../../tolle/src/lib/field.component';
import {
  InputGroupComponent,
  InputGroupAddonComponent,
  InputGroupInputComponent,
  InputGroupTextComponent,
  InputGroupButtonComponent,
} from '../../../../tolle/src/lib/input-group.component';
import {
  ItemComponent,
  ItemGroupComponent,
  ItemMediaComponent,
  ItemContentComponent,
  ItemTitleComponent,
  ItemDescriptionComponent,
  ItemActionsComponent,
} from '../../../../tolle/src/lib/item.component';
import { SpinnerComponent } from '../../../../tolle/src/lib/spinner.component';
import { KbdComponent, KbdGroupComponent } from '../../../../tolle/src/lib/kbd.component';
import {
  TableComponent,
  TableHeaderDirective,
  TableBodyDirective,
  TableFooterDirective,
  TableRowDirective,
  TableHeadDirective,
  TableCellDirective,
} from '../../../../tolle/src/lib/table.component';
import { TypographyComponent } from '../../../../tolle/src/lib/typography.component';
import { EmptyStateComponent } from '../../../../tolle/src/lib/empty-state.component';
import {
  MessageComponent,
  MessageAvatarComponent,
  MessageContentComponent,
  MessageHeaderComponent,
  MessageFooterComponent,
} from '../../../../tolle/src/lib/message.component';
import { BubbleComponent } from '../../../../tolle/src/lib/bubble.component';
import {
  ChartComponent,
  ChartGridComponent,
  ChartXAxisComponent,
  ChartYAxisComponent,
  ChartAreaComponent,
  ChartLineComponent,
} from '../../../../tolle/src/lib/chart.component';
import type { ChartSeries } from '../../../../tolle/src/lib/chart.service';

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

interface Invoice {
  id: string;
  status: 'paid' | 'pending' | 'failed';
  method: string;
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
    FieldComponent,
    FieldLabelComponent,
    FieldDescriptionComponent,
    InputGroupComponent,
    InputGroupAddonComponent,
    InputGroupInputComponent,
    InputGroupTextComponent,
    InputGroupButtonComponent,
    ItemComponent,
    ItemGroupComponent,
    ItemMediaComponent,
    ItemContentComponent,
    ItemTitleComponent,
    ItemDescriptionComponent,
    ItemActionsComponent,
    SpinnerComponent,
    KbdComponent,
    KbdGroupComponent,
    TableComponent,
    TableHeaderDirective,
    TableBodyDirective,
    TableFooterDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective,
    TypographyComponent,
    EmptyStateComponent,
    MessageComponent,
    MessageAvatarComponent,
    MessageContentComponent,
    MessageHeaderComponent,
    MessageFooterComponent,
    BubbleComponent,
    ChartComponent,
    ChartGridComponent,
    ChartXAxisComponent,
    ChartYAxisComponent,
    ChartAreaComponent,
    ChartLineComponent,
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
              <p class="text-sm text-muted-foreground">Traffic and signups · last 6 months</p>
            </tolle-card-header>
            <tolle-card-content>
              <tolle-chart
                [data]="traffic"
                [series]="trafficSeries"
                xKey="month"
                [height]="170"
                xHeader="Month"
                ariaLabel="Visitors and signups by month"
                description="An area for visitors with a line for signups, over six months."
              >
                <svg:g tolle-chart-grid></svg:g>
                <svg:g tolle-chart-y-axis></svg:g>
                <svg:g tolle-chart-x-axis></svg:g>
                <svg:g tolle-chart-area seriesKey="visitors" curve="smooth"></svg:g>
                <svg:g tolle-chart-line seriesKey="signups" curve="smooth" [showDots]="true"></svg:g>
              </tolle-chart>
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

      <!-- ===== Fields, rows & conversation ===== -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <tolle-card class="lg:col-span-2">
          <tolle-card-header>
            <tolle-card-title>Workspace settings</tolle-card-title>
            <p class="text-sm text-muted-foreground">Fields, input groups and content rows.</p>
          </tolle-card-header>
          <tolle-card-content class="space-y-5">

            <tolle-field>
              <tolle-field-label for="pv-project">Project</tolle-field-label>
              <tolle-input-group size="sm">
                <tolle-input-group-addon>
                  <app-demo-icon [iconSet]="iconSet" name="search" [size]="15" />
                </tolle-input-group-addon>
                <tolle-input-group-input id="pv-project" class="min-w-0 flex-1"
                                         placeholder="Search projects" [(ngModel)]="search" />
                <tolle-input-group-addon align="inline-end">
                  <tolle-kbd-group>
                    <tolle-kbd size="sm">⌘</tolle-kbd>
                    <tolle-kbd size="sm">K</tolle-kbd>
                  </tolle-kbd-group>
                </tolle-input-group-addon>
              </tolle-input-group>
              <tolle-field-description>Jump to any project without leaving the keyboard.</tolle-field-description>
            </tolle-field>

            <tolle-field>
              <tolle-field-label for="pv-repo" [required]="true">Repository</tolle-field-label>
              <tolle-input-group size="sm">
                <tolle-input-group-addon>
                  <tolle-input-group-text>github.com/</tolle-input-group-text>
                </tolle-input-group-addon>
                <tolle-input-group-input id="pv-repo" class="min-w-0 flex-1"
                                         placeholder="acme/tolle-ui" [(ngModel)]="repo" />
                <tolle-input-group-addon align="inline-end">
                  <tolle-spinner size="xs" variant="muted" label="Checking availability" />
                  <tolle-input-group-button variant="ghost" size="sm" ariaLabel="Connect">Connect</tolle-input-group-button>
                </tolle-input-group-addon>
              </tolle-input-group>
            </tolle-field>

            <tolle-separator></tolle-separator>

            <tolle-item-group>
              @for (r of rows; track r.title) {
                <tolle-item variant="outline" class="mb-2 last:mb-0">
                  <tolle-item-media class="h-9 w-9 rounded-md bg-primary/10">
                    <span class="text-primary">
                      <app-demo-icon [iconSet]="iconSet" [name]="r.icon" [size]="16" />
                    </span>
                  </tolle-item-media>
                  <tolle-item-content>
                    <tolle-item-title>{{ r.title }}</tolle-item-title>
                    <tolle-item-description>{{ r.description }}</tolle-item-description>
                  </tolle-item-content>
                  <tolle-item-actions>
                    <tolle-badge variant="secondary" size="sm">{{ r.badge }}</tolle-badge>
                    <tolle-switch [(ngModel)]="r.on" />
                  </tolle-item-actions>
                </tolle-item>
              }
            </tolle-item-group>
          </tolle-card-content>
        </tolle-card>

        <tolle-card>
          <tolle-card-header>
            <tolle-card-title>Assistant</tolle-card-title>
            <p class="text-sm text-muted-foreground">Chat surfaces wear the same tokens.</p>
          </tolle-card-header>
          <tolle-card-content class="space-y-3">
            <tolle-message align="start">
              <tolle-message-avatar>AI</tolle-message-avatar>
              <tolle-message-content>
                <tolle-message-header>Tolle · now</tolle-message-header>
                <tolle-bubble variant="muted">Want me to apply this palette across the workspace?</tolle-bubble>
              </tolle-message-content>
            </tolle-message>

            <tolle-message align="end">
              <tolle-message-avatar>BK</tolle-message-avatar>
              <tolle-message-content>
                <tolle-bubble variant="primary" align="end">Yes — and round the corners a little more.</tolle-bubble>
                <tolle-message-footer>Sent</tolle-message-footer>
              </tolle-message-content>
            </tolle-message>

            <tolle-message align="start">
              <tolle-message-avatar>AI</tolle-message-avatar>
              <tolle-message-content>
                <tolle-bubble variant="muted">
                  <span class="flex items-center gap-2">
                    <tolle-spinner size="xs" variant="muted" label="Applying preset" />
                    Applying preset…
                  </span>
                </tolle-bubble>
              </tolle-message-content>
            </tolle-message>
          </tolle-card-content>
        </tolle-card>
      </div>

      <!-- ===== Table, type scale & empty state ===== -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <tolle-card class="lg:col-span-2">
          <tolle-card-header>
            <tolle-card-title>Invoices</tolle-card-title>
            <p class="text-sm text-muted-foreground">
              Composed by hand with <span class="font-mono text-xs">tolle-table</span> primitives.
            </p>
          </tolle-card-header>
          <tolle-card-content>
            <tolle-table>
              <thead tolleTableHeader>
                <tr tolleTableRow>
                  <th tolleTableHead>Invoice</th>
                  <th tolleTableHead>Status</th>
                  <th tolleTableHead>Method</th>
                  <th tolleTableHead><span class="block text-right">Amount</span></th>
                </tr>
              </thead>
              <tbody tolleTableBody>
                @for (i of invoices; track i.id) {
                  <tr tolleTableRow>
                    <td tolleTableCell><span class="font-medium">{{ i.id }}</span></td>
                    <td tolleTableCell>
                      <tolle-badge [variant]="statusVariant(i.status)" size="sm">{{ i.status }}</tolle-badge>
                    </td>
                    <td tolleTableCell><span class="text-muted-foreground">{{ i.method }}</span></td>
                    <td tolleTableCell><span class="block text-right tabular-nums">{{ i.amount }}</span></td>
                  </tr>
                }
              </tbody>
              <tfoot tolleTableFooter>
                <tr tolleTableRow>
                  <td tolleTableCell colspan="3">Total</td>
                  <td tolleTableCell><span class="block text-right tabular-nums">$1,650.00</span></td>
                </tr>
              </tfoot>
            </tolle-table>
          </tolle-card-content>
          <tolle-card-footer class="flex items-center gap-2 text-xs text-muted-foreground">
            Press
            <tolle-kbd-group>
              <tolle-kbd size="sm">⌘</tolle-kbd>
              <tolle-kbd size="sm">⇧</tolle-kbd>
              <tolle-kbd size="sm">E</tolle-kbd>
            </tolle-kbd-group>
            to export.
          </tolle-card-footer>
        </tolle-card>

        <div class="space-y-6">
          <tolle-card>
            <tolle-card-header>
              <tolle-card-title>Type scale</tolle-card-title>
            </tolle-card-header>
            <tolle-card-content class="space-y-2">
              <tolle-typography variant="h4">Heading four</tolle-typography>
              <tolle-typography variant="lead">A lead line sets the tone.</tolle-typography>
              <tolle-typography variant="p">Body copy picks up the sans stack you chose in the rail.</tolle-typography>
              <tolle-typography variant="blockquote">Tokens beat hard-coded values.</tolle-typography>
              <tolle-typography variant="muted">Muted footnote</tolle-typography>
              <tolle-typography variant="code">--radius</tolle-typography>
            </tolle-card-content>
          </tolle-card>

          <tolle-card>
            <tolle-card-header>
              <tolle-card-title>Archive</tolle-card-title>
            </tolle-card-header>
            <tolle-card-content>
              <tolle-empty-state
                variant="minimal"
                title="Nothing archived"
                description="Anything you archive shows up here."
              >
                <app-demo-icon icon [iconSet]="iconSet" name="check" [size]="20" />
              </tolle-empty-state>
            </tolle-card-content>
          </tolle-card>
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
  search = '';
  repo = '';

  stats = [
    { label: 'Revenue', value: '$45,231', delta: '+20.1%', icon: 'dollar' },
    { label: 'Subscribers', value: '+2,350', delta: '+180.1%', icon: 'users' },
    { label: 'Sales', value: '+12,234', delta: '+19%', icon: 'card' },
    { label: 'Active now', value: '+573', delta: '+201', icon: 'activity' },
  ];

  /**
   * Chart inputs are plain fields, never getters: `tolle-chart` diffs `data` and
   * `series` in ngOnChanges, so an array rebuilt on every read would re-run the
   * chart's layout on every change-detection pass.
   */
  trafficSeries: ChartSeries[] = [
    { key: 'visitors', label: 'Visitors' },
    { key: 'signups', label: 'Signups' },
  ];

  traffic = [
    { month: 'Jan', visitors: 420, signups: 96 },
    { month: 'Feb', visitors: 512, signups: 128 },
    { month: 'Mar', visitors: 488, signups: 141 },
    { month: 'Apr', visitors: 604, signups: 172 },
    { month: 'May', visitors: 671, signups: 205 },
    { month: 'Jun', visitors: 742, signups: 246 },
  ];

  rows = [
    { icon: 'bell', title: 'Deployment alerts', description: 'Ping me when a build fails.', badge: 'Email', on: true },
    { icon: 'users', title: 'Mentions', description: 'Someone names you in a thread.', badge: 'Push', on: true },
    { icon: 'card', title: 'Billing receipts', description: 'Monthly invoice summaries.', badge: 'Email', on: false },
  ];

  invoices: Invoice[] = [
    { id: 'INV-2401', status: 'paid', method: 'Visa · 4242', amount: '$650.00' },
    { id: 'INV-2402', status: 'pending', method: 'Bank transfer', amount: '$400.00' },
    { id: 'INV-2403', status: 'paid', method: 'Mastercard · 8210', amount: '$350.00' },
    { id: 'INV-2404', status: 'failed', method: 'Visa · 1199', amount: '$250.00' },
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
