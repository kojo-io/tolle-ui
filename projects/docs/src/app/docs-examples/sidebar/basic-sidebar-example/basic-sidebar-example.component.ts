import { Component } from '@angular/core';

import { SidebarComponent, SidebarGroup } from '../../../../../../tolle/src/lib/sidebar.component';

@Component({
  selector: 'app-basic-sidebar-example',
  imports: [SidebarComponent],
  template: `
    <div class="flex h-[600px] w-full overflow-hidden rounded-lg border border-input bg-background">
      <tolle-sidebar [items]="sidebarItems" [collapsed]="false">
        <div header class="flex items-center gap-2 px-2 text-xl font-bold">
          <i class="ri-antigravity-line text-primary"></i>
          <span>Antigravity</span>
        </div>

        <div footer class="flex items-center gap-3 border-t border-border px-2 py-4">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <i class="ri-user-line text-primary"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-medium">John Doe</span>
            <span class="text-xs text-muted-foreground">Designer</span>
          </div>
        </div>
      </tolle-sidebar>

      <main class="flex-1 bg-muted/10 p-8">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="mt-2 text-muted-foreground">Welcome to your application workspace.</p>
      </main>
    </div>
  `,
})
export class BasicSidebarExampleComponent {
  sidebarItems: SidebarGroup[] = [
    {
      title: 'Platform',
      items: [
        {
          title: 'Playground',
          icon: 'ri-terminal-box-line',
          items: [
            { title: 'History', url: '#' },
            { title: 'Starred', url: '#' },
            { title: 'Settings', url: '#' },
          ],
        },
        {
          title: 'Models',
          icon: 'ri-command-line',
          items: [
            { title: 'Genesis', url: '#' },
            { title: 'Explorer', url: '#' },
            { title: 'Quantum', url: '#' },
          ],
        },
        {
          title: 'Documentation',
          icon: 'ri-book-open-line',
          items: [
            { title: 'Introduction', url: '#' },
            { title: 'Get Started', url: '#' },
            { title: 'Tutorials', url: '#' },
            { title: 'Changelog', url: '#' },
          ],
        },
        {
          title: 'Settings',
          icon: 'ri-settings-4-line',
          items: [
            { title: 'General', url: '#' },
            { title: 'Team', url: '#' },
            { title: 'Billing', url: '#' },
            { title: 'Limits', url: '#' },
          ],
        },
      ],
    },
    {
      title: 'Projects',
      items: [
        { title: 'Design Engineering', icon: 'ri-layout-line', url: '#' },
        { title: 'Sales & Marketing', icon: 'ri-pie-chart-line', url: '#' },
        { title: 'Travel', icon: 'ri-map-pin-line', url: '#' },
      ],
    },
  ];
}
