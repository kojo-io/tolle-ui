# Alert

Highlights important information to draw the user’s attention.

---

## Usage

Alerts are used to display a brief, important message in a way that attracts the user's attention without interrupting their task.

---

## Installation

Import the `AlertComponent` into your standalone component's `imports` array.

```typescript
import { AlertComponent } from '@tolle_/tolle-ui';

@Component({
  // ...
  imports: [AlertComponent]
})
```

---

## Variants

Toggle between different visual styles using the `variant` input. Supported variants include:

- `default`
- `destructive`
- `success`
- `warning`

---

## Dismissible

Set the `dismissible` input to `true` to allow users to close the alert.
