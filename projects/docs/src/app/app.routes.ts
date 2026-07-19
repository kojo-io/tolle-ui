import { Routes } from '@angular/router';
import { DocLayoutComponent } from './layout/doc-layout/doc-layout.component';

export const routes: Routes = [
  {
    // Landing page — full-width, outside the docs shell.
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent),
  },
  {
    // Theme generator — full-width configurator, outside the docs shell.
    path: 'themes',
    loadComponent: () => import('./themes/themes.component').then(m => m.ThemesComponent),
  },
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
        path: 'ai-native',
        loadComponent: () => import('./components/ai-native-docs/ai-native-docs.component').then(m => m.AiNativeDocsComponent),
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
            path: 'attachment',
            loadComponent: () => import('./components/attachment-docs/attachment-docs.component').then(m => m.AttachmentDocsComponent),
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
            path: 'bubble',
            loadComponent: () => import('./components/bubble-docs/bubble-docs.component').then(m => m.BubbleDocsComponent),
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
            path: 'chart',
            loadComponent: () => import('./components/chart-docs/chart-docs.component').then(m => m.ChartDocsComponent),
          },
          {
            path: 'chart-pie',
            loadComponent: () => import('./components/chart-pie-docs/chart-pie-docs.component').then(m => m.ChartPieDocsComponent),
          },
          {
            path: 'checkbox',
            loadComponent: () => import('./components/check-box-docs/check-box-docs.component').then(m => m.CheckBoxDocsComponent),
          },
          {
            path: 'checkpoint',
            loadComponent: () => import('./components/checkpoint-docs/checkpoint-docs.component').then(m => m.CheckpointDocsComponent),
          },
          {
            path: 'collapsible',
            loadComponent: () => import('./components/collapsible-docs/collapsible-docs.component').then(m => m.CollapsibleDocsComponent),
          },
          {
            path: 'chain-of-thought',
            loadComponent: () => import('./components/chain-of-thought-docs/chain-of-thought-docs.component').then(m => m.ChainOfThoughtDocsComponent),
          },
          {
            path: 'combobox',
            loadComponent: () => import('./components/combobox-docs/combobox-docs.component').then(m => m.ComboboxDocsComponent),
          },
          {
            path: 'command',
            loadComponent: () => import('./components/command-docs/command-docs.component').then(m => m.CommandDocsComponent),
          },
          {
            path: 'command-dialog',
            loadComponent: () => import('./components/command-dialog-docs/command-dialog-docs.component').then(m => m.CommandDialogDocsComponent),
          },
          {
            path: 'confirmation',
            loadComponent: () => import('./components/confirmation-docs/confirmation-docs.component').then(m => m.ConfirmationDocsComponent),
          },
          {
            path: 'context',
            loadComponent: () => import('./components/context-docs/context-docs.component').then(m => m.ContextDocsComponent),
          },
          {
            path: 'context-menu',
            loadComponent: () => import('./components/context-menu-docs/context-menu-docs.component').then(m => m.ContextMenuDocsComponent),
          },
          {
            path: 'conversation',
            loadComponent: () => import('./components/conversation-docs/conversation-docs.component').then(m => m.ConversationDocsComponent),
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
            path: 'country-selector',
            loadComponent: () => import('./components/country-selector-docs/country-selector-docs.component').then(m => m.CountrySelectorDocsComponent),
          },
          {
            path: 'direction',
            loadComponent: () => import('./components/direction-docs/direction-docs.component').then(m => m.DirectionDocsComponent),
          },
          {
            path: 'inline-citation',
            loadComponent: () => import('./components/inline-citation-docs/inline-citation-docs.component').then(m => m.InlineCitationDocsComponent),
          },
          {
            path: 'marker',
            loadComponent: () => import('./components/marker-docs/marker-docs.component').then(m => m.MarkerDocsComponent),
          },
          {
            path: 'message',
            loadComponent: () => import('./components/message-docs/message-docs.component').then(m => m.MessageDocsComponent),
          },
          {
            path: 'message-scroller',
            loadComponent: () => import('./components/message-scroller-docs/message-scroller-docs.component').then(m => m.MessageScrollerDocsComponent),
          },
          {
            path: 'model-selector',
            loadComponent: () => import('./components/model-selector-docs/model-selector-docs.component').then(m => m.ModelSelectorDocsComponent),
          },
          {
            path: 'phone-number-input',
            loadComponent: () => import('./components/phone-number-input-docs/phone-number-input-docs.component').then(m => m.PhoneNumberInputDocsComponent),
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
            path: 'field',
            loadComponent: () => import('./components/field-docs/field-docs.component').then(m => m.FieldDocsComponent),
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
            path: 'input-group',
            loadComponent: () => import('./components/input-group-docs/input-group-docs.component').then(m => m.InputGroupDocsComponent),
          },
          {
            path: 'item',
            loadComponent: () => import('./components/item-docs/item-docs.component').then(m => m.ItemDocsComponent),
          },
          {
            path: 'kbd',
            loadComponent: () => import('./components/kbd-docs/kbd-docs.component').then(m => m.KbdDocsComponent),
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
            path: 'menubar',
            loadComponent: () => import('./components/menubar-docs/menubar-docs.component').then(m => m.MenubarDocsComponent),
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
            path: 'native-select',
            loadComponent: () => import('./components/native-select-docs/native-select-docs.component').then(m => m.NativeSelectDocsComponent),
          },
          {
            path: 'navigation-menu',
            loadComponent: () => import('./components/navigation-menu-docs/navigation-menu-docs.component').then(m => m.NavigationMenuDocsComponent),
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
            path: 'plan',
            loadComponent: () => import('./components/plan-docs/plan-docs.component').then(m => m.PlanDocsComponent),
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
            path: 'prompt-input',
            loadComponent: () => import('./components/prompt-input-docs/prompt-input-docs.component').then(m => m.PromptInputDocsComponent),
          },
          {
            path: 'queue',
            loadComponent: () => import('./components/queue-docs/queue-docs.component').then(m => m.QueueDocsComponent),
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
            path: 'reasoning',
            loadComponent: () => import('./components/reasoning-docs/reasoning-docs.component').then(m => m.ReasoningDocsComponent),
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
            path: 'select',
            loadComponent: () => import('./components/select-docs/select-docs.component').then(m => m.SelectDocsComponent),
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
            path: 'shimmer',
            loadComponent: () => import('./components/shimmer-docs/shimmer-docs.component').then(m => m.ShimmerDocsComponent),
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
            path: 'sources',
            loadComponent: () => import('./components/sources-docs/sources-docs.component').then(m => m.SourcesDocsComponent),
          },
          {
            path: 'spinner',
            loadComponent: () => import('./components/spinner-docs/spinner-docs.component').then(m => m.SpinnerDocsComponent),
          },
          {
            path: 'suggestion',
            loadComponent: () => import('./components/suggestion-docs/suggestion-docs.component').then(m => m.SuggestionDocsComponent),
          },
          {
            path: 'switch',
            loadComponent: () => import('./components/switch-docs/switch-docs.component').then(m => m.SwitchDocsComponent),
          },
          {
            path: 'table',
            loadComponent: () => import('./components/table-docs/table-docs.component').then(m => m.TableDocsComponent),
          },
          {
            path: 'tabs',
            loadComponent: () => import('./components/tabs-docs/tabs-docs.component').then(m => m.TabsDocsComponent),
          },
          {
            path: 'task',
            loadComponent: () => import('./components/task-docs/task-docs.component').then(m => m.TaskDocsComponent),
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
            path: 'tool',
            loadComponent: () => import('./components/tool-docs/tool-docs.component').then(m => m.ToolDocsComponent),
          },
          {
            path: 'tooltip',
            loadComponent: () => import('./components/tooltip-docs/tooltip-docs.component').then(m => m.TooltipDocsComponent),
          },
          {
            path: 'typography',
            loadComponent: () => import('./components/typography-docs/typography-docs.component').then(m => m.TypographyDocsComponent),
          },
        ]
      },
    ]
  }
];
