# Toast Component Usage Guide

## Overview

The Toast component displays brief, non-blocking notifications at the edge of the screen. The Toaster component renders the toasts, while the ToastService manages toast creation and display.

## Import

```typescript
import {
  ToastContainerComponent,
  ToastService
} from '@tolle_/tolle-ui';
```

## ToastService

**Methods:**

| Method | Parameters | Description |
|--------|------------|-------------|
| `show` | `toast: Omit<Toast, 'id' \| 'remainingTime' \| 'isPaused'>` | Show a new toast |
| `remove` | `id: number` | Remove a specific toast |
| `setPaused` | `id: number, paused: boolean` | Pause/unpause a toast timer |

## Toast Interface

| Property | Type | Description |
|----------|------|-------------|
| `id` | `number` | Unique identifier (auto-generated) |
| `title` | `string` | Toast title |
| `description` | `string` | Toast message |
| `variant` | `'default'\|'destructive'\|'success'` | Toast style variant |
| `duration` | `number` | Custom duration in ms |
| `remainingTime` | `number` | Time remaining (auto-managed) |
| `isPaused` | `boolean` | Whether timer is paused |

## ToastContainerComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `position` | `'top-right'\|'top-left'\|'bottom-right'\|'bottom-left'\|'top-center'\|'bottom-center'` | `'bottom-right'` | Toast position |

## Basic Usage

```html
```html
<tolle-button variant="outline" (click)="showToast()">Show Toast</tolle-button>

<!-- Ensure <tolle-toast-container></tolle-toast-container> is added to your root component (like app.component.html) -->
```

```typescript
import { Component } from '@angular/core';
import { ToastService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  constructor(private toastService: ToastService) {}

  showToast() {
    this.toastService.show({
      title: 'Scheduled: Catch up',
      description: 'Friday, February 10, 2024 at 5:57 PM',
      variant: 'default'
    });
  }
}

```
