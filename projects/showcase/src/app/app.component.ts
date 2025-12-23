import {Component, inject} from '@angular/core';
import {
  BadgeComponent,
  ButtonComponent,
  CardComponent,
  CardContentComponent, CardFooterComponent,
  CardHeaderComponent,
  CardTitleComponent, CheckboxComponent,
  InputComponent, SelectComponent, SelectGroupComponent, SelectItemComponent, SelectSeparatorComponent,
  SkeletonComponent, SwitchComponent, ToastService, TooltipDirective
} from '@tolle/ui';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe, NgForOf} from '@angular/common';
import {ThemeService} from '@tolle/ui/theme.service';
import {ToastContainerComponent} from '@tolle/ui/toaster.component';

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
    ToastContainerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'showcase';
  emailControl = new FormControl();
  marketingControl = new FormControl();
  termsControl = new FormControl();
  theme = inject(ThemeService);
  toast = inject(ToastService);

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
}
