import {Component, inject, OnInit} from '@angular/core';
import {ButtonComponent} from '../../../../tolle/src/lib/button.component';
import {AsyncPipe, NgStyle} from '@angular/common';
import {ThemeService} from '../../../../tolle/src/lib/theme.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {coloris, init} from '@melloware/coloris';
import {InputComponent} from '../../../../tolle/src/lib/input.component';
import {
  CardComponent,
  CardContentComponent,
  CardFooterComponent,
  CardHeaderComponent, CardTitleComponent
} from '../../../../tolle/src/lib/card.component';
import {SelectComponent} from '../../../../tolle/src/lib/select.component';
import {SelectGroupComponent} from '../../../../tolle/src/lib/select-group.component';
import {SelectItemComponent} from '../../../../tolle/src/lib/select-item.component';
import {SelectSeparatorComponent} from '../../../../tolle/src/lib/select-separator.component';
import {SwitchComponent} from '../../../../tolle/src/lib/switch.component';
import {BadgeComponent} from '../../../../tolle/src/lib/badge.component';
import {SkeletonComponent} from '../../../../tolle/src/lib/skeleton.component';
import {CheckboxComponent} from '../../../../tolle/src/lib/checkbox.component';
import {TooltipDirective} from '../../../../tolle/src/lib/tooltip.directive';
import {ToastService} from '../../../../tolle/src/lib/toast.service';
import {CalendarComponent} from '../../../../tolle/src/lib/calendar.component';
import {MaskedInputComponent} from '../../../../tolle/src/lib/masked-input.component';
import {DatePickerComponent} from '../../../../tolle/src/lib/date-picker.component';
import {AccordionComponent} from '../../../../tolle/src/lib/accordion.component';
import {AccordionItemComponent} from '../../../../tolle/src/lib/accordion-item.component';
import {ButtonGroupComponent} from '../../../../tolle/src/lib/button-group.component';
import {DateRangePickerComponent} from '../../../../tolle/src/lib/date-range-picker.component';
import {RangeCalendarComponent} from '../../../../tolle/src/lib/range-calendar.component';
import {DropdownItemComponent} from '../../../../tolle/src/lib/dropdown-item.component';
import {DropdownLabelComponent} from '../../../../tolle/src/lib/dropdown-label.component';
import {DropdownMenuComponent} from '../../../../tolle/src/lib/dropdown-menu.component';
import {DropdownSeparatorComponent} from '../../../../tolle/src/lib/dropdown-separator.component';
import {DropdownTriggerDirective} from '../../../../tolle/src/lib/dropdown-trigger.directive';
import {TextareaComponent} from '../../../../tolle/src/lib/textarea.component';
import {AlertComponent} from '../../../../tolle/src/lib/alert.component';
import {AvatarComponent} from '../../../../tolle/src/lib/avatar.component';
import {AvatarFallbackComponent} from '../../../../tolle/src/lib/avatar-fallback.component';
import {EmptyStateComponent} from '../../../../tolle/src/lib/empty-state.component';
import {OtpComponent} from '../../../../tolle/src/lib/otp.component';
import {OtpGroupComponent} from '../../../../tolle/src/lib/otp-group.component';
import {OtpSlotComponent} from '../../../../tolle/src/lib/otp-slot.component';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    ButtonComponent,
    NgStyle,
    FormsModule,
    AsyncPipe,
    InputComponent,
    CardComponent,
    CardContentComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleComponent,
    ReactiveFormsModule,
    SelectComponent,
    SelectGroupComponent,
    SelectItemComponent,
    SelectSeparatorComponent,
    SwitchComponent,
    BadgeComponent,
    CheckboxComponent,
    TooltipDirective,
    CalendarComponent,
    MaskedInputComponent,
    DatePickerComponent,
    AccordionComponent,
    AccordionItemComponent,
    ButtonGroupComponent,
    DateRangePickerComponent,
    RangeCalendarComponent,
    DropdownItemComponent,
    DropdownLabelComponent,
    DropdownMenuComponent,
    DropdownSeparatorComponent,
    DropdownTriggerDirective,
    TextareaComponent,
    AlertComponent,
    AvatarComponent,
    AvatarFallbackComponent,
    EmptyStateComponent,
    OtpComponent,
    OtpGroupComponent,
    OtpSlotComponent,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  baseUrl = environment.docsUrl;
  github = environment.gitHubUrl;
  myOtp: string = '';
  ngOnInit(): void {
    const base = this.theme.primaryColor;
    if (base) {
      this.theme.setPrimaryColor(base, true);
    }
    init();
    coloris({
      el: '.bg-coloris',
      theme: 'polaroid',
      themeMode: 'dark',
      formatToggle: true,
      closeButton: true,
      clearButton: true,
    });
  }
  theme = inject(ThemeService);
  toast = inject(ToastService);
  changeBrand(value: string) {
    this.theme.setPrimaryColor(value, true); // purple
  }

  toggle() {
    this.theme.toggleTheme();
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
