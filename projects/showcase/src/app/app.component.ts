import {Component, inject} from '@angular/core';

import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {UserListComponent} from '../user-list/user-list.component';
import {ToastContainerComponent} from '../../../tolle/src/lib/toaster.component';
import {ButtonComponent} from '../../../tolle/src/lib/button.component';
import {InputComponent} from '../../../tolle/src/lib/input.component';
import {
  CardComponent,
  CardContentComponent, CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent
} from '../../../tolle/src/lib/card.component';
import {SelectComponent} from '../../../tolle/src/lib/select.component';
import {SelectItemComponent} from '../../../tolle/src/lib/select-item.component';
import {SelectGroupComponent} from '../../../tolle/src/lib/select-group.component';
import {SelectSeparatorComponent} from '../../../tolle/src/lib/select-separator.component';
import {SwitchComponent} from '../../../tolle/src/lib/switch.component';
import {BadgeComponent} from '../../../tolle/src/lib/badge.component';
import {SkeletonComponent} from '../../../tolle/src/lib/skeleton.component';
import {CheckboxComponent} from '../../../tolle/src/lib/checkbox.component';
import {TooltipDirective} from '../../../tolle/src/lib/tooltip.directive';
import {CalendarComponent} from '../../../tolle/src/lib/calendar.component';
import {MaskedInputComponent} from '../../../tolle/src/lib/masked-input.component';
import {DatePickerComponent} from '../../../tolle/src/lib/date-picker.component';
import {PaginationComponent} from '../../../tolle/src/lib/pagination.component';
import {DataTableComponent, TableColumn} from '../../../tolle/src/lib/data-table.component';
import {TolleCellDirective} from '../../../tolle/src/lib/tolle-cell.directive';
import {AccordionComponent} from '../../../tolle/src/lib/accordion.component';
import {AccordionItemComponent} from '../../../tolle/src/lib/accordion-item.component';
import {ButtonGroupComponent} from '../../../tolle/src/lib/button-group.component';
import {DateRangePickerComponent} from '../../../tolle/src/lib/date-range-picker.component';
import {RangeCalendarComponent} from '../../../tolle/src/lib/range-calendar.component';
import {ThemeService} from '../../../tolle/src/lib/theme.service';
import {ToastService} from '../../../tolle/src/lib/toast.service';
import {DateRange} from '../../../tolle/src/lib/types/date-range';
import {cn} from '../../../tolle/src/lib/utils/cn';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    CardFooterComponent,
    FormsModule,
    SelectComponent,
    ReactiveFormsModule,
    SelectItemComponent,
    NgForOf,
    SelectGroupComponent,
    SelectSeparatorComponent,
    AsyncPipe,
    SwitchComponent,
    BadgeComponent,
    SkeletonComponent,
    CheckboxComponent,
    TooltipDirective,
    ToastContainerComponent,
    CalendarComponent,
    DatePipe,
    MaskedInputComponent,
    DatePickerComponent,
    PaginationComponent,
    DataTableComponent,
    TolleCellDirective,
    AccordionComponent,
    AccordionItemComponent,
    NgIf,
    UserListComponent,
    ButtonGroupComponent,
    DateRangePickerComponent,
    RangeCalendarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'showcase';
  emailControl = new FormControl();
  marketingControl = new FormControl();
  termsControl = new FormControl();
  dateControl = new FormControl();
  phoneControl = new FormControl();
  dobControl = new FormControl();
  theme = inject(ThemeService);
  toast = inject(ToastService);


  // Mock Data: 100 items
  allUsers = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`
  }));

  // Pagination State
  totalItems = this.allUsers.length;
  currentPage = 1;
  pageSize = 10;

  // The data currently displayed in the table
  pagedData: any[] = [];

  constructor() {
    this.updateTableData();
  }

  // 1. Data for the Picker (Input Field)
  filterRange: DateRange = { start: null, end: null };

  // 2. Data for the Inline Calendar (Side Panel / Dashboard)
  dashboardRange: DateRange = {
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7)) // Default: Next 7 days
  };

  onRangeChange(range: DateRange) {
    console.log('Range Updated:', range);
    // e.g., this.api.fetchData(range.start, range.end);
  }

  resetFilter() {
    this.filterRange = { start: null, end: null };
  }

  handlePageChange(page: number) {
    this.currentPage = page;
    this.updateTableData();
  }

  handleSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page
    this.updateTableData();
  }

  private updateTableData() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.allUsers.slice(start, end);
  }

  toggle() {
    this.theme.toggleTheme();
  }

  changeColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    // This updates the CSS variable, triggering the color-mix() logic
    document.documentElement.style.setProperty('--primary', color);
  }

  foodOptions = [
    { label: 'Steak', value: 'steak' },
    { label: 'Pizza', value: 'pizza' },
    { label: 'Salad', value: 'salad' }
  ];

  form = new FormGroup({
    favoriteFood: new FormControl(''),
    timezone: new FormControl(''),
    country: new FormControl('')
  });

  handleRemove(data: any) {
    alert(data)
  }

  saveSettings() {
    // Logic to save...
    this.toast.show({
      title: 'Success!',
      description: 'Your profile has been updated.',
      variant: 'success',
      duration: 3000
    });
  }

  showError() {
    this.toast.show({
      title: 'Uh oh!',
      description: 'Something went wrong with your request.',
      variant: 'destructive',
      duration: 10000
    });
  }

  orderColumns: TableColumn[] = [
    { key: 'orderNumber', label: 'Order #', sortable: true, class: 'w-[120px] font-mono' },
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'total', label: 'Amount', class: 'text-right' },
    { key: 'status', label: 'Status', class: 'w-[100px]' } // We'll use a template for this
  ];

  // Define columns for the Child Table (Expanded view)
  itemColumns: TableColumn[] = [
    { key: 'name', label: 'Product' },
    { key: 'sku', label: 'SKU', class: 'text-muted-foreground' },
    { key: 'qty', label: 'Qty', class: 'text-right' },
    { key: 'price', label: 'Price', class: 'text-right' }
  ];

  // Sample Data
  orders = [
    {
      orderNumber: 'ORD-7201',
      customer: 'Alex Rivera',
      date: '2025-12-01',
      total: '$124.50',
      status: 'Paid',
      items: [
        { name: 'Wireless Mouse', sku: 'MS-001', qty: 1, price: '$45.00' },
        { name: 'USB-C Cable', sku: 'CB-099', qty: 2, price: '$39.75' }
      ]
    },
    {
      orderNumber: 'ORD-8412',
      customer: 'Jordan Smith',
      date: '2025-11-28',
      total: '$2,100.00',
      status: 'Pending',
      items: [
        { name: 'MacBook Pro 14"', sku: 'LAP-MBP', qty: 1, price: '$2,100.00' }
      ]
    },
    {
      orderNumber: 'ORD-9005',
      customer: 'Kristin Chen',
      date: '2025-11-15',
      total: '$12.00',
      status: 'Refunded',
      items: [
        { name: 'Sticker Pack', sku: 'ST-01', qty: 1, price: '$12.00' }
      ]
    }
  ];

  faqs = [
    {
      question: "Is it accessible?",
      answer: "Yes. It adheres to the WAI-ARIA design pattern for accordions."
    },
    {
      question: "How do I install the library?",
      answer: "You can install it via npm using: npm install @kojo-io/tolle-ui"
    },
    {
      question: "Can I customize the primary color?",
      answer: "Absolutely. Use the provideTolleConfig function in your app config to set your brand colors."
    }
  ];
  protected readonly cn = cn;
}
