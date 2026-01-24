import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent, SidebarGroup } from '../../../../../../tolle/src/lib/sidebar.component';
import { SwitchComponent } from '../../../../../../tolle/src/lib/switch.component';
import { SelectComponent } from '../../../../../../tolle/src/lib/select.component';
import { SelectItemComponent } from '../../../../../../tolle/src/lib/select-item.component';
import { PlaygroundComponent } from '../../../shared/playground/playground.component';

@Component({
    selector: 'app-sidebar-interactive',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SidebarComponent,
        SwitchComponent,
        SelectComponent,
        SelectItemComponent,
        PlaygroundComponent
    ],
    templateUrl: './sidebar-interactive.component.html'
})
export class SidebarInteractiveComponent {
    collapsed = false;
    variant: 'default' | 'secondary' | 'ghost' | 'outline' = 'default';

    items: SidebarGroup[] = [
        {
            title: 'Navigation',
            items: [
                { title: 'Dashboard', icon: 'ri-home-4-line', url: '#' },
                { title: 'Analytics', icon: 'ri-bar-chart-box-line', url: '#' },
                { title: 'Messages', icon: 'ri-mail-line', url: '#' }
            ]
        },
        {
            title: 'Tools',
            items: [
                {
                    title: 'Deployment',
                    icon: 'ri-cloud-line',
                    items: [
                        { title: 'Vercel', url: '#' },
                        { title: 'AWS', url: '#' }
                    ]
                },
                { title: 'Settings', icon: 'ri-settings-line', url: '#' }
            ]
        }
    ];

    get playgroundCode(): string {
        return `<tolle-sidebar
  [items]="items"
  [collapsed]="${this.collapsed}"
  variant="${this.variant}"
>
  <div header>My App</div>
</tolle-sidebar>`;
    }
}
