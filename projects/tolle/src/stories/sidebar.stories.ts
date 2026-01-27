import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import {SidebarComponent} from '../lib/sidebar.component';
import {ButtonComponent} from '../lib/button.component';

@Component({
    selector: 'sidebar-story-host',
    imports: [CommonModule, SidebarComponent, ButtonComponent, RouterModule],
    template: `
    <!-- We assume Remix Icon CSS is loaded globally -->
    <div class="flex h-[500px] w-full overflow-hidden border rounded-xl bg-muted/10 shadow-2xl">
      <tolle-sidebar [items]="navGroups" [collapsed]="isCollapsed">
        <!-- Header with improved shrinking logic -->
        <div header
             class="flex w-full items-center gap-2 overflow-hidden transition-all duration-300"
             [class.justify-center]="isCollapsed"
             [class.px-2]="!isCollapsed">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <i class="ri-flashlight-fill text-xl"></i>
          </div>
          @if (!isCollapsed) {
            <div class="flex flex-col leading-tight animate-in fade-in slide-in-from-left-2 duration-200">
              <span class="font-bold truncate text-foreground">Tolle UI</span>
              <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Enterprise SDK</span>
            </div>
          }
        </div>

        <!-- Footer with profile info -->
        <div footer class="flex w-full items-center gap-3 overflow-hidden transition-all duration-300"
             [class.justify-center]="isCollapsed"
             [class.p-2]="!isCollapsed">
          <div class="h-9 w-9 shrink-0 rounded-full bg-gradient-to-tr from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center shadow-sm">
            <span class="text-xs font-bold text-primary">JD</span>
          </div>
          @if (!isCollapsed) {
            <div class="flex flex-col leading-none animate-in fade-in duration-300">
              <span class="text-sm font-semibold text-foreground">John Doe</span>
              <span class="text-[10px] text-muted-foreground mt-0.5">Administrator</span>
            </div>
          }
        </div>
      </tolle-sidebar>

      <main class="flex-1 h-full overflow-auto bg-white p-8">
        <div class="flex items-center justify-between mb-8">
          <tolle-button variant="outline" size="sm" (click)="isCollapsed = !isCollapsed">
            <i [class]="isCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'" class="mr-2 h-4 w-4"></i>
            {{ isCollapsed ? 'Expand' : 'Collapse' }}
          </tolle-button>

          <div class="flex gap-2">
            <tolle-button variant="ghost" size="sm">
              <i class="ri-book-read-line mr-2"></i> Docs
            </tolle-button>
            <tolle-button variant="ghost" size="sm">
              <i class="ri-chat-smile-2-line mr-2"></i> Feedback
            </tolle-button>
          </div>
        </div>

        <div class="max-w-2xl">
          <h1 class="text-3xl font-extrabold tracking-tight lg:text-4xl mb-4 text-foreground">Workspace Overview</h1>
          <p class="text-xl text-muted-foreground mb-6">
            Manage your projects, track team performance, and configure system-wide settings using our new Remix Icon integrated sidebar.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <div class="p-6 rounded-xl border bg-card shadow-sm group hover:border-primary transition-colors cursor-pointer">
              <div class="flex justify-between items-center mb-4">
                <i class="ri-folder-zip-line text-2xl text-primary"></i>
                <span class="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">+2 today</span>
              </div>
              <h3 class="font-semibold text-muted-foreground text-sm uppercase">Active Projects</h3>
              <p class="text-3xl font-bold text-foreground">12</p>
            </div>
            <div class="p-6 rounded-xl border bg-card shadow-sm group hover:border-primary transition-colors cursor-pointer">
              <div class="flex justify-between items-center mb-4">
                <i class="ri-user-heart-line text-2xl text-primary"></i>
                <span class="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">4 pending</span>
              </div>
              <h3 class="font-semibold text-muted-foreground text-sm uppercase">Team Members</h3>
              <p class="text-3xl font-bold text-foreground">24</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
class SidebarStoryHost {
  isCollapsed = false;

  // Demonstrated Grouped, Remix Icon-based, and Nested Expanding Items
  navGroups = [
    {
      title: "Platform",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: "ri-dashboard-line", isActive: true },
        { title: "Team", url: "/team", icon: "ri-team-line" },
        { title: "Projects", url: "/projects", icon: "ri-folder-6-line" },
      ]
    },
    {
      title: "Resources",
      items: [
        {
          title: "Marketing",
          icon: "ri-megaphone-line",
          items: [ // Nested items demonstration
            { title: "Campaigns", url: "/marketing/campaigns", icon: "ri-flag-2-line" },
            { title: "Leads", url: "/marketing/leads", icon: "ri-user-search-line" },
            { title: "Analytics", url: "/marketing/analytics", icon: "ri-pie-chart-2-line" }
          ]
        },
        {
          title: "Sales",
          icon: "ri-money-dollar-circle-line",
          items: [
            { title: "Pipeline", url: "/sales/pipeline" },
            { title: "Invoices", url: "/sales/invoices" }
          ]
        },
        { title: "Media Library", url: "/media", icon: "ri-image-2-line" },
      ]
    },
    {
      title: "Configuration",
      items: [
        { title: "Billing", url: "/billing", icon: "ri-bank-card-line" },
        { title: "Settings", url: "/settings", icon: "ri-settings-4-line" },
        { title: "Audit Logs", url: "/logs", icon: "ri-file-list-3-line" },
      ]
    }
  ];
}

const meta: Meta<SidebarStoryHost> = {
  title: 'Components/Sidebar',
  tags: ['autodocs'],
  component: SidebarStoryHost,
  decorators: [
    moduleMetadata({
      imports: [SidebarComponent, ButtonComponent, CommonModule, RouterModule]
    })
  ],
  parameters: {
    layout: 'centered'
  }
};

export default meta;
type Story = StoryObj<SidebarStoryHost>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `
/* --- component.ts --- */
@Component({ ... })
export class LayoutComponent {
  isCollapsed = false;
  navItems = [
    {
      title: "Platform",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: "ri-dashboard-line" },
        ...
      ]
    }
  ];
}

/* --- component.html --- */
<tolle-sidebar [items]="navItems" [collapsed]="isCollapsed">
  <div header>Logo</div>
  <div footer>User Info</div>
</tolle-sidebar>
        `,
        language: 'typescript'
      }
    }
  }
};

export const Collapsed: Story = {
  args: {
    isCollapsed: true
  }
};
