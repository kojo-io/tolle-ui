# Radio Group Component Usage Guide

## Overview

The RadioGroup component provides a container for radio buttons with built-in form integration. It manages the selection state and implements ControlValueAccessor for Angular forms.

## Import

```typescript
import {
  RadioGroupComponent,
  RadioItemComponent
} from '@tolle_/tolle-ui';
```

## Components

### RadioGroupComponent

Container for radio items.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `disabled` | `boolean` | `false` | Disabled state |
| `name` | `string` | Auto-generated | Radio group name |
| `ngModel` | `any` | `null` | Two-way binding value |
| `formControlName` | `string` | - | Form control name |

### RadioItemComponent

Individual radio button item.

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `value` | `any` | - | Radio value (required) |
| `disabled` | `boolean` | `false` | Disabled state |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Radio Group

```html
<tolle-radio-group [(ngModel)]="selectedOption">
  <label class="flex items-center gap-2">
    <input type="radio" tolleRadioItem value="option1" />
    <span>Option 1</span>
  </label>
  <label class="flex items-center gap-2">
    <input type="radio" tolleRadioItem value="option2" />
    <span>Option 2</span>
  </label>
  <label class="flex items-center gap-2">
    <input type="radio" tolleRadioItem value="option3" />
    <span>Option 3</span>
  </label>
</tolle-radio-group>
<p>Selected: {{ selectedOption }}</p>
```

### Disabled Radio Group

```html
<tolle-radio-group [disabled]="true" value="option1">
  <label class="flex items-center gap-2">
    <input type="radio" tolleRadioItem value="option1" />
    <span>Option 1</span>
  </label>
  <label class="flex items-center gap-2">
    <input type="radio" tolleRadioItem value="option2" />
    <span>Option 2</span>
  </label>
</tolle-radio-group>
```

## Radio Group with Form

### Reactive Form

```typescript
this.form = this.fb.group({
  paymentMethod: ['credit-card', Validators.required]
});
```

```html
<form [formGroup]="form">
  <tolle-radio-group formControlName="paymentMethod">
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="credit-card" />
      <span>Credit Card</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="debit-card" />
      <span>Debit Card</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="paypal" />
      <span>PayPal</span>
    </label>
  </tolle-radio-group>
</form>
```

### Template-driven Form

```html
<form>
  <tolle-radio-group [(ngModel)]="selected" name="options" required>
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="a" />
      <span>Option A</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="b" />
      <span>Option B</span>
    </label>
  </tolle-radio-group>
</form>
```

## Radio Group with Custom Styling

### Styled Radio Group

```html
<tolle-radio-group [(ngModel)]="selected" class="space-y-3">
  <label class="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
    <input type="radio" tolleRadioItem value="basic" class="mt-0.5" />
    <div>
      <div class="font-medium">Basic Plan</div>
      <div class="text-sm text-muted-foreground">$9/month</div>
    </div>
  </label>
  <label class="flex items-start gap-3 p-3 rounded-lg border border-primary bg-primary/5 hover:border-primary transition-colors cursor-pointer">
    <input type="radio" tolleRadioItem value="pro" class="mt-0.5" />
    <div>
      <div class="font-medium">Pro Plan</div>
      <div class="text-sm text-muted-foreground">$29/month</div>
    </div>
  </label>
  <label class="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
    <input type="radio" tolleRadioItem value="enterprise" class="mt-0.5" />
    <div>
      <div class="font-medium">Enterprise</div>
      <div class="text-sm text-muted-foreground">Custom pricing</div>
    </div>
  </label>
</tolle-radio-group>
```

## Radio Group with Icons

```html
<tolle-radio-group [(ngModel)]="selected">
  <label class="flex items-center gap-3">
    <input type="radio" tolleRadioItem value="email" />
    <i class="ri-mail-line text-lg"></i>
    <span>Email</span>
  </label>
  <label class="flex items-center gap-3">
    <input type="radio" tolleRadioItem value="sms" />
    <i class="ri-message-line text-lg"></i>
    <span>SMS</span>
  </label>
  <label class="flex items-center gap-3">
    <input type="radio" tolleRadioItem value="push" />
    <i class="ri-bell-line text-lg"></i>
    <span>Push</span>
  </label>
</tolle-radio-group>
```

## Radio Group with Helper Text

```html
<div class="space-y-4">
  <tolle-radio-group [(ngModel)]="selected">
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="email" />
      <span>Email</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="sms" />
      <span>SMS</span>
    </label>
  </tolle-radio-group>
  <p class="text-xs text-muted-foreground">
    Choose how you want to receive notifications
  </p>
</div>
```

## Radio Group with Error State

```html
<div class="space-y-2">
  <tolle-radio-group
    [(ngModel)]="selected"
    [error]="form.submitted && !selected"
  >
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="yes" />
      <span>Yes</span>
    </label>
    <label class="flex items-center gap-2">
      <input type="radio" tolleRadioItem value="no" />
      <span>No</span>
    </label>
  </tolle-radio-group>
  <p class="text-xs text-destructive" *ngIf="form.submitted && !selected">
    Please select an option
  </p>
</div>
```

## Radio Group with Horizontal Layout

```html
<tolle-radio-group [(ngModel)]="selected" class="flex gap-4">
  <label class="flex items-center gap-2">
    <input type="radio" tolleRadioItem value="left" />
    <span>Left</span>
  </label>
  <label class="flex items-center gap-2">
    <input type="radio" tolleRadioItem value="center" />
    <span>Center</span>
  </label>
  <label class="flex items-center gap-2">
    <input type="radio" tolleRadioItem value="right" />
    <span>Right</span>
  </label>
</tolle-radio-group>
```

## Radio Group in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Notification Preferences</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content>
    <tolle-radio-group [(ngModel)]="frequency">
      <label class="flex items-center gap-2">
        <input type="radio" tolleRadioItem value="instant" />
        <span>Instant</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" tolleRadioItem value="daily" />
        <span>Daily Digest</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" tolleRadioItem value="weekly" />
        <span>Weekly Summary</span>
      </label>
    </tolle-radio-group>
  </tolle-card-content>
</tolle-card>
```

## Radio Group with Object Values

```html
<tolle-radio-group [(ngModel)]="selectedUser">
  <label class="flex items-center gap-2" *ngFor="let user of users">
    <input type="radio" tolleRadioItem [value]="user.id" />
    <span>{{ user.name }}</span>
  </label>
</tolle-radio-group>
<p>Selected User ID: {{ selectedUser }}</p>
```
