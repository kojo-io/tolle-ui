import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ButtonComponent} from '../../../../../tolle/src/lib/button.component';
import {SidebarComponent} from '../../../../../tolle/src/lib/sidebar.component';
import {ThemeService} from '../../../../../tolle/src/lib/theme.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, NgStyle} from '@angular/common';
import {coloris, init} from '@melloware/coloris';
import {TooltipDirective} from '../../../../../tolle/src/lib/tooltip.directive';

@Component({
  selector: 'app-doc-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonComponent,
    SidebarComponent,
    TooltipDirective,
    ReactiveFormsModule,
    NgStyle,
    FormsModule,
    AsyncPipe
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
  theme = inject(ThemeService);

  changeBrand(value: string) {
    this.theme.setPrimaryColor(value, true); // purple
  }

  toggle() {
    this.theme.toggleTheme();
  }
  // Demonstrated Grouped, Remix Icon-based, and Nested Expanding Items
  navGroups = [
    {
      title: "Sections",
      items: [
        { title: "Get Started", url: "/getting-started", icon: "ri-home-6-fill" },
        { title: "Theming", url: "/theming", icon: "ri-paint-line" },
        { title: "Components", url: "/components", icon: "ri-dashboard-fill" },
        { title: "Projects", url: "/projects", icon: "ri-folder-6-line" },
      ]
    },
    {
      title: "Get Started",
      items: [
        { title: "Installation", url: "/installation", icon: "ri-bank-card-line" },
        { title: "Settings", url: "/settings", icon: "ri-settings-4-line" },
        { title: "Audit Logs", url: "/logs", icon: "ri-file-list-3-line" },
      ]
    }
  ];
}
