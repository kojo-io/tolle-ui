import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from '../../../../../tolle/src/lib/button.component';
import { SidebarComponent } from '../../../../../tolle/src/lib/sidebar.component';
import { ThemeService } from '../../../../../tolle/src/lib/theme.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgStyle } from '@angular/common';
import { coloris, init } from '@melloware/coloris';
import { TooltipDirective } from '../../../../../tolle/src/lib/tooltip.directive';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';


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
  // Demonstrated Grouped, Remix Icon-based, and Nested Expanding Items
  navGroups = [
    {
      title: "Sections",
      items: [
        { title: "Get Started", url: "/getting-started", },
        { title: "Theming", url: "/theming" },
        { title: "Components", url: "/components" },
      ]
    },
    {
      title: "Components",
      items: [
        { title: "Accordion", url: "/components/accordion" },
        { title: "Alert", url: "/components/alert" },
        { title: "Alert Dialog", url: "/components/alert-dialog" },
        { title: "Aspect Ratio", url: "/components/aspect-ratio" },
        { title: "Avatar", url: "/components/avatar" },
        { title: "Badge", url: "/components/badge" },
        { title: "Breadcrumb", url: "/components/breadcrumb" },
        { title: "Button", url: "/components/button" },
        { title: "Button Group", url: "/components/button-group" },
        { title: "Calendar", url: "/components/calendar" },
        { title: "Card", url: "/components/card" },
        { title: "Carousel", url: "/components/carousel" },
        { title: "Checkbox", url: "/components/checkbox" },
        { title: "Collapsible", url: "/components/collapsible" },
        { title: "Context Menu", url: "/components/context-menu" },
        { title: "Data Table", url: "/components/data-table" },
        { title: "Date Picker", url: "/components/date-picker" },
        { title: "Date Range Picker", url: "/components/date-range-picker" },
        { title: "Dropdown Menu", url: "/components/dropdown-menu" },
        { title: "Empty State", url: "/components/empty-state" },
        { title: "Input", url: "/components/input" },
        { title: "Label", url: "/components/label" },
        { title: "Masked Input", url: "/components/masked-input" },
        { title: "Modal", url: "/components/modal" },
        { title: "Multi Select", url: "/components/multi-select" },
        { title: "OTP", url: "/components/otp" },
        { title: "Pagination", url: "/components/pagination" },
        { title: "Popover", url: "/components/popover" },
        { title: "Progress", url: "/components/progress" },
        { title: "Radio Group", url: "/components/radio-group" },
        { title: "Range Calendar", url: "/components/range-calendar" },
        { title: "Resizable", url: "/components/resizable" },
        { title: "Scroll Area", url: "/components/scroll-area" },
        { title: "Segment", url: "/components/segment" },
        { title: "Select", url: "/components/select" },
        { title: "Separator", url: "/components/separator" },
        { title: "Sidebar", url: "/components/sidebar" },
        { title: "Skeleton", url: "/components/skeleton" },
        { title: "Slider", url: "/components/slider" },
        { title: "Switch", url: "/components/switch" },
        { title: "Tabs", url: "/components/tabs" },
        { title: "Textarea", url: "/components/textarea" },
        { title: "Toaster", url: "/components/toaster" },
        { title: "Toggle", url: "/components/toggle" },
        { title: "Tooltip", url: "/components/tooltip" }
      ]
    }
  ];
}
