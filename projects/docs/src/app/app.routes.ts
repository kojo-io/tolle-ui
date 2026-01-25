import { Routes } from '@angular/router';
import { DocLayoutComponent } from './layout/doc-layout/doc-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: DocLayoutComponent,
    children: [
      {
        path: 'getting-started',
        loadComponent: () => import('./components/getting-started-docs/getting-started-docs.component').then(m => m.GettingStartedDocsComponent),
      },
      {
        path: 'theming',
        loadComponent: () => import('./components/theming-docs/theming-docs.component').then(m => m.ThemingDocsComponent),
      },
      {
        path: 'components',
        children: [
          {
            path: '',
            loadComponent: () => import('./components/components.component').then(m => m.ComponentsComponent),
          },
          {
            path: 'accordion',
            loadComponent: () => import('./components/accordion-docs/accordion-docs.component').then(m => m.AccordionDocsComponent),
          },
          {
            path: 'alert',
            loadComponent: () => import('./components/alert-docs/alert-docs.component').then(m => m.AlertDocsComponent),
          },
          {
            path: 'alert-dialog',
            loadComponent: () => import('./components/alert-dialog-docs/alert-dialog-docs.component').then(m => m.AlertDialogDocsComponent),
          },
          {
            path: 'aspect-ratio',
            loadComponent: () => import('./components/aspect-ratio-docs/aspect-ratio-docs.component').then(m => m.AspectRatioDocsComponent),
          },
          {
            path: 'avatar',
            loadComponent: () => import('./components/avatar-docs/avatar-docs.component').then(m => m.AvatarDocsComponent),
          },
          {
            path: 'badge',
            loadComponent: () => import('./components/badge-docs/badge-docs.component').then(m => m.BadgeDocsComponent),
          },
          {
            path: 'breadcrumb',
            loadComponent: () => import('./components/breadcrumb-docs/breadcrumb-docs.component').then(m => m.BreadcrumbDocsComponent),
          },
          {
            path: 'button',
            loadComponent: () => import('./components/button-docs/button-docs.component').then(m => m.ButtonDocsComponent),
          },
          {
            path: 'button-group',
            loadComponent: () => import('./components/button-group-docs/button-group-docs.component').then(m => m.ButtonGroupDocsComponent),
          },
          {
            path: 'calendar',
            loadComponent: () => import('./components/calendar-docs/calendar-docs.component').then(m => m.CalendarDocsComponent),
          },
          {
            path: 'card',
            loadComponent: () => import('./components/card-docs/card-docs.component').then(m => m.CardDocsComponent),
          },
          {
            path: 'carousel',
            loadComponent: () => import('./components/carousel-docs/carousel-docs.component').then(m => m.CarouselDocsComponent),
          },
          {
            path: 'checkbox',
            loadComponent: () => import('./components/check-box-docs/check-box-docs.component').then(m => m.CheckBoxDocsComponent),
          },
          {
            path: 'collapsible',
            loadComponent: () => import('./components/collapsible-docs/collapsible-docs.component').then(m => m.CollapsibleDocsComponent),
          },
          {
            path: 'context-menu',
            loadComponent: () => import('./components/context-menu-docs/context-menu-docs.component').then(m => m.ContextMenuDocsComponent),
          },
          {
            path: 'data-table',
            loadComponent: () => import('./components/data-table-docs/data-table-docs.component').then(m => m.DataTableDocsComponent),
          },
          {
            path: 'date-picker',
            loadComponent: () => import('./components/date-picker-docs/date-picker-docs.component').then(m => m.DatePickerDocsComponent),
          },
          {
            path: 'date-range-picker',
            loadComponent: () => import('./components/date-range-picker-docs/date-range-picker-docs.component').then(m => m.DateRangePickerDocsComponent),
          },
          {
            path: 'dropdown-menu',
            loadComponent: () => import('./components/dropdown-menu-docs/dropdown-menu-docs.component').then(m => m.DropdownMenuDocsComponent),
          },
          {
            path: 'empty-state',
            loadComponent: () => import('./components/empty-state-docs/empty-state-docs.component').then(m => m.EmptyStateDocsComponent),
          },
          {
            path: 'hover-card',
            loadComponent: () => import('./components/hover-card-docs/hover-card-docs.component').then(m => m.HoverCardDocsComponent),
          },
          {
            path: 'input',
            loadComponent: () => import('./components/input-docs/input-docs.component').then(m => m.InputDocsComponent),
          },
          {
            path: 'label',
            loadComponent: () => import('./components/label-docs/label-docs.component').then(m => m.LabelDocsComponent),
          },
          {
            path: 'masked-input',
            loadComponent: () => import('./components/masked-input-docs/masked-input-docs.component').then(m => m.MaskedInputDocsComponent),
          },
          {
            path: 'modal',
            loadComponent: () => import('./components/modal-docs/modal-docs.component').then(m => m.ModalDocsComponent),
          },
          {
            path: 'multi-select',
            loadComponent: () => import('./components/multi-select-docs/multi-select-docs.component').then(m => m.MultiSelectDocsComponent),
          },
          {
            path: 'otp',
            loadComponent: () => import('./components/otp-docs/otp-docs.component').then(m => m.OtpDocsComponent),
          },
          {
            path: 'pagination',
            loadComponent: () => import('./components/pagination-docs/pagination-docs.component').then(m => m.PaginationDocsComponent),
          },
          {
            path: 'popover',
            loadComponent: () => import('./components/popover-docs/popover-docs.component').then(m => m.PopoverDocsComponent),
          },
          {
            path: 'progress',
            loadComponent: () => import('./components/progress-docs/progress-docs.component').then(m => m.ProgressDocsComponent),
          },
          {
            path: 'radio-group',
            loadComponent: () => import('./components/radio-group-docs/radio-group-docs.component').then(m => m.RadioGroupDocsComponent),
          },
          {
            path: 'range-calendar',
            loadComponent: () => import('./components/calendar-range-docs/calendar-range-docs.component').then(m => m.CalendarRangeDocsComponent),
          },
          {
            path: 'resizable',
            loadComponent: () => import('./components/resizable-docs/resizable-docs.component').then(m => m.ResizableDocsComponent),
          },
          {
            path: 'scroll-area',
            loadComponent: () => import('./components/scroll-area-docs/scroll-area-docs.component').then(m => m.ScrollAreaDocsComponent),
          },
          {
            path: 'segment',
            loadComponent: () => import('./components/segment-docs/segment-docs.component').then(m => m.SegmentDocsComponent),
          },
          {
            path: 'separator',
            loadComponent: () => import('./components/separator-docs/separator-docs.component').then(m => m.SeparatorDocsComponent),
          },
          {
            path: 'sheet',
            loadComponent: () => import('./components/sheet-docs/sheet-docs.component').then(m => m.SheetDocsComponent),
          },
          {
            path: 'sidebar',
            loadComponent: () => import('./components/sidebar-docs/sidebar-docs.component').then(m => m.SidebarDocsComponent),
          },
          {
            path: 'skeleton',
            loadComponent: () => import('./components/skeleton-docs/skeleton-docs.component').then(m => m.SkeletonDocsComponent),
          },
          {
            path: 'slider',
            loadComponent: () => import('./components/slider-docs/slider-docs.component').then(m => m.SliderDocsComponent),
          },
          {
            path: 'switch',
            loadComponent: () => import('./components/switch-docs/switch-docs.component').then(m => m.SwitchDocsComponent),
          },
          {
            path: 'tabs',
            loadComponent: () => import('./components/tabs-docs/tabs-docs.component').then(m => m.TabsDocsComponent),
          },
          {
            path: 'textarea',
            loadComponent: () => import('./components/textarea-docs/textarea-docs.component').then(m => m.TextareaDocsComponent),
          },
          {
            path: 'toaster',
            loadComponent: () => import('./components/toaster-docs/toaster-docs.component').then(m => m.ToasterDocsComponent),
          },
          {
            path: 'toggle',
            loadComponent: () => import('./components/toggle-docs/toggle-docs.component').then(m => m.ToggleDocsComponent),
          },
          {
            path: 'toggle-group',
            loadComponent: () => import('./components/toggle-group-docs/toggle-group-docs.component').then(m => m.ToggleGroupDocsComponent)
          },
          {
            path: 'tooltip',
            loadComponent: () => import('./components/tooltip-docs/tooltip-docs.component').then(m => m.TooltipDocsComponent),
          },
        ]
      },
      {
        path: '',
        redirectTo: 'getting-started',
        pathMatch: 'full'
      }
    ]
  }
];
