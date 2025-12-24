import {Component, inject} from '@angular/core';
import {
  AccordionComponent, AccordionItemComponent,
  BadgeComponent,
  ButtonComponent, ButtonGroupComponent, CalendarComponent,
  CardComponent,
  CardContentComponent, CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent, CheckboxComponent, cn, DataTableComponent, DatePickerComponent,
  DateRangePickerComponent,
  InputComponent,
  MaskedInputComponent, ModalComponent,
  PaginationComponent,
  RangeCalendarComponent, SelectComponent, SelectGroupComponent, SelectItemComponent, SelectSeparatorComponent,
  SkeletonComponent, SwitchComponent, TableColumn, ToastService, TolleCellDirective, TooltipDirective
} from '@tolle/ui';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {ThemeService} from '@tolle/ui/theme.service';
import {ToastContainerComponent} from '@tolle/ui/toaster.component';
import {UserListComponent} from '../user-list/user-list.component';
import {DateRange} from '@tolle/ui/types/date-range';

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
