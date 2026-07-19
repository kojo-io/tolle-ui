import { Component, inject } from '@angular/core';
import { BaseService } from '../../shared/base.service';
import { DocHeroComponent } from '../../shared/doc-hero/doc-hero.component';
import { BaseEditorComponent } from '../../shared/base-editor/base-editor.component';
import { ComponentPreviewComponent } from '../../shared/component-preview/component-preview.component';
import { PropTableComponent } from '../../shared/prop-table/prop-table.component';
import { PropEntry } from '../../shared/types';
import { DocsWrapperComponent } from '../shared/docs-wrapper/docs-wrapper.component';
import { SiteNavComponent } from '../../docs-examples/navigation-menu/site-nav/site-nav.component';
import { NavFlatAndDropdownComponent } from '../../docs-examples/navigation-menu/nav-flat-and-dropdown/nav-flat-and-dropdown.component';
import { NavHoverSwitchComponent } from '../../docs-examples/navigation-menu/nav-hover-switch/nav-hover-switch.component';


@Component({
  selector: 'app-navigation-menu-docs',
  standalone: true,
  imports: [
    DocsWrapperComponent,
    DocHeroComponent,
    BaseEditorComponent,
    ComponentPreviewComponent,
    PropTableComponent,
    SiteNavComponent,
    NavFlatAndDropdownComponent,
    NavHoverSwitchComponent
  ],
  templateUrl: './navigation-menu-docs.component.html',
  styleUrl: './navigation-menu-docs.component.css'
})
export class NavigationMenuDocsComponent {
  baseService = inject(BaseService);

  installation = `import {
  NavigationMenuComponent,
  NavigationMenuListComponent,
  NavigationMenuItemComponent,
  NavigationMenuTriggerComponent,
  NavigationMenuContentComponent,
  NavigationMenuLinkComponent
} from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [
    NavigationMenuComponent,
    NavigationMenuListComponent,
    NavigationMenuItemComponent,
    NavigationMenuTriggerComponent,
    NavigationMenuContentComponent,
    NavigationMenuLinkComponent
  ]
})`;

  siteNavCode = `<tolle-navigation-menu ariaLabel="Site">
  <tolle-navigation-menu-list>
    <tolle-navigation-menu-item id="products">
      <tolle-navigation-menu-trigger>Products</tolle-navigation-menu-trigger>
      <tolle-navigation-menu-content class="w-[420px]">
        <div class="grid grid-cols-2 gap-1">
          <tolle-navigation-menu-link href="#analytics">
            <span label class="text-sm font-medium">Analytics</span>
            <span description class="text-xs text-muted-foreground">Funnels, retention and cohorts.</span>
          </tolle-navigation-menu-link>
          <tolle-navigation-menu-link href="#billing">
            <span label class="text-sm font-medium">Billing</span>
            <span description class="text-xs text-muted-foreground">Invoices, plans and usage.</span>
          </tolle-navigation-menu-link>
          <!-- ...more links -->
        </div>
      </tolle-navigation-menu-content>
    </tolle-navigation-menu-item>

    <tolle-navigation-menu-item id="pricing">
      <tolle-navigation-menu-link href="#pricing">
        <span label class="text-sm font-medium">Pricing</span>
      </tolle-navigation-menu-link>
    </tolle-navigation-menu-item>

    <tolle-navigation-menu-item id="docs">
      <tolle-navigation-menu-link href="#docs">
        <span label class="text-sm font-medium">Docs</span>
      </tolle-navigation-menu-link>
    </tolle-navigation-menu-item>
  </tolle-navigation-menu-list>
</tolle-navigation-menu>`;

  flatCode = `<tolle-navigation-menu align="start" ariaLabel="Workspace">
  <tolle-navigation-menu-list>
    <tolle-navigation-menu-item id="overview">
      <tolle-navigation-menu-link href="#overview" [active]="true">
        <span label class="text-sm font-medium">Overview</span>
      </tolle-navigation-menu-link>
    </tolle-navigation-menu-item>

    <tolle-navigation-menu-item id="reports">
      <tolle-navigation-menu-trigger>Reports</tolle-navigation-menu-trigger>
      <tolle-navigation-menu-content class="w-[320px]" placement="bottom-start">
        <tolle-navigation-menu-link href="#revenue">
          <span label class="text-sm font-medium">Revenue</span>
          <span description class="text-xs text-muted-foreground">Monthly recurring revenue.</span>
        </tolle-navigation-menu-link>
        <tolle-navigation-menu-link href="#churn">
          <span label class="text-sm font-medium">Churn</span>
          <span description class="text-xs text-muted-foreground">Cancellations by cohort.</span>
        </tolle-navigation-menu-link>
      </tolle-navigation-menu-content>
    </tolle-navigation-menu-item>

    <tolle-navigation-menu-item id="settings">
      <tolle-navigation-menu-link href="#settings" variant="muted">
        <span label class="text-sm font-medium">Settings</span>
      </tolle-navigation-menu-link>
    </tolle-navigation-menu-item>
  </tolle-navigation-menu-list>
</tolle-navigation-menu>`;

  hoverCode = `<tolle-navigation-menu ariaLabel="Resources" [closeDelay]="300" (openChange)="onOpenChange($event)">
  <tolle-navigation-menu-list>
    <tolle-navigation-menu-item id="learn">
      <tolle-navigation-menu-trigger>Learn</tolle-navigation-menu-trigger>
      <tolle-navigation-menu-content class="w-[320px]">
        <tolle-navigation-menu-link href="#guides">
          <span label class="text-sm font-medium">Guides</span>
          <span description class="text-xs text-muted-foreground">Step-by-step walkthroughs.</span>
        </tolle-navigation-menu-link>
        <tolle-navigation-menu-link href="#tutorials">
          <span label class="text-sm font-medium">Tutorials</span>
          <span description class="text-xs text-muted-foreground">Build something end to end.</span>
        </tolle-navigation-menu-link>
      </tolle-navigation-menu-content>
    </tolle-navigation-menu-item>

    <tolle-navigation-menu-item id="community">
      <tolle-navigation-menu-trigger>Community</tolle-navigation-menu-trigger>
      <tolle-navigation-menu-content class="w-[320px]">
        <tolle-navigation-menu-link href="#discord">
          <span label class="text-sm font-medium">Discord</span>
          <span description class="text-xs text-muted-foreground">Ask questions, share builds.</span>
        </tolle-navigation-menu-link>
        <tolle-navigation-menu-link href="#changelog">
          <span label class="text-sm font-medium">Changelog</span>
          <span description class="text-xs text-muted-foreground">What shipped this month.</span>
        </tolle-navigation-menu-link>
      </tolle-navigation-menu-content>
    </tolle-navigation-menu-item>
  </tolle-navigation-menu-list>
</tolle-navigation-menu>

<p class="text-sm text-muted-foreground">Open item: {{ openId ?? 'none' }}</p>`;

  navigationMenuProps: PropEntry[] = [
    { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Horizontal alignment of the list within the nav landmark.' },
    { name: 'ariaLabel', type: 'string', default: "'Main'", description: 'Accessible name for the <nav> landmark.' },
    { name: 'closeDelay', type: 'number', default: '150', description: 'Milliseconds to wait before closing after the pointer leaves — the grace period that lets the pointer travel diagonally into the panel.' },
    { name: 'class', type: 'string', description: 'Additional CSS classes for the nav.' },
    { name: 'openChange', type: 'EventEmitter<string | null>', description: 'Emits the id of the item that opened, or null when the menu closes.' }
  ];

  subComponents: PropEntry[] = [
    { name: 'tolle-navigation-menu-list', type: 'component', description: 'The horizontal list that holds the navigation items.' },
    { name: 'tolle-navigation-menu-item', type: 'component — id', description: 'One entry in the list: a plain link, or a trigger plus its content panel. Set id to identify the item in openChange; one is generated when omitted.' },
    { name: 'tolle-navigation-menu-trigger', type: 'component — disabled, size', description: "Button that reveals its item's panel on hover, focus or click. size is 'sm' | 'default' | 'lg'; disabled prevents opening." },
    { name: 'tolle-navigation-menu-content', type: 'component — placement, sideOffset', description: "The floating panel revealed by a trigger, rendered only while open. placement is 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' (default 'bottom'); sideOffset is the gap in pixels (default 8)." },
    { name: 'tolle-navigation-menu-link', type: 'component — href, target, active, variant, navigate', description: "A link inside a panel, or directly in the list for flat entries. variant is 'default' | 'muted'; active marks the current page; navigate emits the click MouseEvent. Projects [label] and [description] slots plus default content." }
  ];
}
