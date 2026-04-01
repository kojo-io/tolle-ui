# Modal Component Usage Guide

## Overview

The Modal component provides a dialog overlay for displaying content that requires user attention. The ModalService allows programmatic control of modals with support for string content, template content, and component content.

## Import

```typescript
import { ModalComponent, ModalService, Modal, ModalRef } from '@tolle_/tolle-ui';
```

## ModalService

The `ModalService` allows you to open modals programmatically.

### Methods

| Method                   | Returns       | Description                               |
| ------------------------ | ------------- | ----------------------------------------- |
| `open<R>(config: Modal)` | `ModalRef<R>` | Opens a new modal and returns a reference |
| `closeAll()`             | `void`        | Closes all open modals                    |

## Modal Configuration (Modal class)

| Property          | Type                                                | Default     | Description                                                       |
| ----------------- | --------------------------------------------------- | ----------- | ----------------------------------------------------------------- |
| `content`         | `string \| Type<any> \| TemplateRef<any>`           | -           | **Required.** Content to display (string, component, or template) |
| `title`           | `string`                                            | -           | Optional modal title                                              |
| `size`            | `'xs' \| 'sm' \| 'default' \| 'lg' \| 'fullscreen'` | `'default'` | Modal size                                                        |
| `backdropClose`   | `boolean`                                           | `true`      | Whether clicking backdrop closes modal                            |
| `data`            | `{ [key: string]: any }`                            | -           | Data to pass to component content                                 |
| `context`         | `T`                                                 | -           | Context to pass to template content                               |
| `showCloseButton` | `boolean`                                           | `true`      | Show close button in header                                       |

## ModalRef

The `ModalRef` is returned by `ModalService.open()` and provides control over the modal.

| Property/Method | Type                                 | Description                             |
| --------------- | ------------------------------------ | --------------------------------------- |
| `afterClosed$`  | `Observable<R \| undefined \| null>` | Observable that emits when modal closes |
| `modal`         | `Modal`                              | The modal configuration                 |

### Methods

| Method              | Returns | Description                                     |
| ------------------- | ------- | ----------------------------------------------- |
| `close(result?: R)` | `void`  | Closes the modal and optionally passes a result |

## Sizes Reference

| Size         | Width        | Use Case                            |
| ------------ | ------------ | ----------------------------------- |
| `xs`         | 320px        | Mobile alerts, simple confirmations |
| `sm`         | 425px        | Standard dialogs                    |
| `default`    | 544px        | Forms, default size                 |
| `lg`         | 90% / 1024px | Data tables, complex content        |
| `fullscreen` | 100vw/100vh  | Complex workflows, multi-step forms |

## String Content

The simplest way to show a modal is with a string content:

```typescript
import { Component, inject } from '@angular/core';
import { ModalService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: ` <tolle-button (click)="showMessage()">Show Message</tolle-button> `,
})
export class ExampleComponent {
  private modalService = inject(ModalService);

  showMessage() {
    this.modalService.open({
      title: 'Success',
      content: 'Your changes have been saved successfully.',
      size: 'sm',
    });
  }
}
```

## Template Content

Use `ng-template` for custom modal content with access to component context:

### Basic Template Modal

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalService, ModalRef, ButtonComponent, InputComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent, InputComponent, FormsModule],
  template: `
    <tolle-button (click)="openTemplateModal()">Edit Profile</tolle-button>

    <ng-template #editModal let-close="close" let-user="user">
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Edit Profile</h3>
        <div class="space-y-2">
          <tolle-input label="Name" [(ngModel)]="editedName"></tolle-input>
          <tolle-input label="Email" type="email" [(ngModel)]="editedEmail"></tolle-input>
        </div>
        <div class="flex justify-end gap-2">
          <tolle-button variant="outline" (click)="close()">Cancel</tolle-button>
          <tolle-button (click)="close({ name: editedName, email: editedEmail })"
            >Save</tolle-button
          >
        </div>
      </div>
    </ng-template>
  `,
})
export class ExampleComponent {
  private modalService = inject(ModalService);

  editedName = '';
  editedEmail = '';

  openTemplateModal() {
    this.editedName = 'John Doe';
    this.editedEmail = 'john@example.com';

    const ref = this.modalService.open({
      content: this.editModal,
      context: { user: { name: this.editedName, email: this.editedEmail } },
      size: 'lg',
    });

    ref.afterClosed$.subscribe(result => {
      if (result) {
        console.log('Saved:', result);
        // Save changes
      }
    });
  }
}
```

### Template with Close Handler

```typescript
import { Component, inject } from '@angular/core';
import { ModalService, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <tolle-button (click)="openConfirmModal()">Delete Item</tolle-button>

    <ng-template #confirmModal let-close="close">
      <div class="space-y-4">
        <p>Are you sure you want to delete this item?</p>
        <div class="flex justify-end gap-2">
          <tolle-button variant="outline" (click)="close(false)">Cancel</tolle-button>
          <tolle-button variant="destructive" (click)="close(true)">Delete</tolle-button>
        </div>
      </div>
    </ng-template>
  `,
})
export class ExampleComponent {
  private modalService = inject(ModalService);

  openConfirmModal() {
    const ref = this.modalService.open({
      content: this.confirmModal,
      size: 'sm',
    });

    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.deleteItem();
      }
    });
  }

  deleteItem() {
    // Delete logic
  }
}
```

## Component Content

For complex modals, use a component. Pass data via the `data` property and access it via `ModalRef`.

### Modal Component

```typescript
// edit-user-modal.component.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalRef, ButtonComponent, InputComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [ButtonComponent, InputComponent, FormsModule],
  template: `
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Edit User</h3>
      <div class="space-y-2">
        <tolle-input label="Name" [(ngModel)]="user.name"></tolle-input>
        <tolle-input label="Email" type="email" [(ngModel)]="user.email"></tolle-input>
      </div>
      <div class="flex justify-end gap-2">
        <tolle-button variant="outline" (click)="cancel()">Cancel</tolle-button>
        <tolle-button (click)="save()">Save</tolle-button>
      </div>
    </div>
  `,
})
export class EditUserModalComponent {
  private modalRef = inject(ModalRef);

  // Data passed from the parent component
  data = this.modalRef.modal.data as { name: string; email: string };

  user = { ...this.data };

  cancel() {
    this.modalRef.close();
  }

  save() {
    this.modalRef.close(this.user);
  }
}
```

### Opening the Component Modal

```typescript
// parent.component.ts
import { Component, inject } from '@angular/core';
import { ModalService, ButtonComponent } from '@tolle_/tolle-ui';
import { EditUserModalComponent } from './edit-user-modal.component';

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [ButtonComponent],
  template: ` <tolle-button (click)="openEditModal()">Edit User</tolle-button> `,
})
export class ParentComponent {
  private modalService = inject(ModalService);

  openEditModal() {
    const ref = this.modalService.open({
      content: EditUserModalComponent,
      data: { name: 'John Doe', email: 'john@example.com' },
      size: 'lg',
    });

    ref.afterClosed$.subscribe(result => {
      if (result) {
        console.log('Updated user:', result);
        // Update user in database
      }
    });
  }
}
```

## Fullscreen Modal

Use for complex workflows or multi-step processes:

```typescript
openFullscreenModal() {
  this.modalService.open({
    title: 'Create New Project',
    content: CreateProjectComponent,
    size: 'fullscreen',
    backdropClose: false,
    showCloseButton: true
  });
}
```

## Non-Closable Modal

For blocking modals that require user action:

```typescript
showRequiredConsent() {
  this.modalService.open({
    title: 'Terms of Service',
    content: 'You must accept the terms to continue.',
    size: 'lg',
    backdropClose: false,
    showCloseButton: false
  });

  // User must click the action button to close
}
```

## Passing Data to Components

```typescript
// Parent component
openUserModal(user: User) {
  const ref = this.modalService.open({
    content: UserDetailComponent,
    data: {
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    }
  });
}

// Inside UserDetailComponent
data = this.modalRef.modal.data as { userId: string; userName: string };
```

## Close and Get Result

```typescript
// Open modal and wait for result
const ref = this.modalService.open({
  title: 'Select Item',
  content: ItemPickerComponent,
  size: 'lg'
});

// Subscribe to close event
ref.afterClosed$.subscribe((result: Item | null) => {
  if (result) {
    console.log('Selected item:', result);
    this.selectedItem = result;
  }
});

// Close from inside the modal component
close(item: Item) {
  this.modalRef.close(item);
}

// Close without result
close() {
  this.modalRef.close();
}
```

## Close All Modals

```typescript
closeAllModals() {
  this.modalService.closeAll();
}
```

## Use Cases

### Confirmation Dialog

```typescript
import { Component, inject } from '@angular/core';
import { ModalService, ModalRef, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <tolle-button variant="destructive" (click)="confirmDelete()"> Delete Account </tolle-button>
  `,
})
export class ExampleComponent {
  private modalService = inject(ModalService);

  confirmDelete() {
    const ref = this.modalService.open({
      title: 'Delete Account',
      content:
        'This action cannot be undone. Your account and all data will be permanently removed.',
      size: 'sm',
      backdropClose: false,
    });

    ref.afterClosed$.subscribe(confirmed => {
      if (confirmed) {
        this.deleteAccount();
      }
    });
  }

  deleteAccount() {
    // Delete logic
  }
}
```

### Form Dialog

```typescript
// form-modal.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalRef, ButtonComponent, InputComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [ButtonComponent, InputComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
      <h3 class="text-lg font-semibold">Create New User</h3>

      <tolle-input
        label="Name"
        formControlName="name"
        [error]="form.get('name')?.invalid && form.get('name')?.touched"
        errorMessage="Name is required">
      </tolle-input>

      <tolle-input
        label="Email"
        type="email"
        formControlName="email"
        [error]="form.get('email')?.invalid && form.get('email')?.touched"
        errorMessage="Valid email is required">
      </tolle-input>

      <div class="flex justify-end gap-2 pt-4">
        <tolle-button variant="outline" type="button" (click)="cancel()">Cancel</tolle-button>
        <tolle-button type="submit" [disabled]="form.invalid">Create</tolle-button>
      </div>
    </form>
  `
})
export class FormModalComponent {
  private modalRef = inject(ModalRef);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  cancel() {
    this.modalRef.close();
  }

  submit() {
    if (this.form.valid) {
      this.modalRef.close(this.form.value);
    }
  }
}

// parent.component.ts
openFormModal() {
  const ref = this.modalService.open({
    content: FormModalComponent,
    size: 'lg'
  });

  ref.afterClosed$.subscribe(result => {
    if (result) {
      this.createUser(result);
    }
  });
}
```

### Multi-Step Wizard

```typescript
// wizard.component.ts
import { Component, inject, signal } from '@angular/core';
import { ModalRef, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <span>Step {{ step() }} of 3</span>
      </div>

      @switch (step()) {
        @case (1) {
          <div>
            <h3 class="mb-2 text-lg font-semibold">Personal Info</h3>
            <!-- Step 1 content -->
          </div>
        }
        @case (2) {
          <div>
            <h3 class="mb-2 text-lg font-semibold">Address</h3>
            <!-- Step 2 content -->
          </div>
        }
        @case (3) {
          <div>
            <h3 class="mb-2 text-lg font-semibold">Review</h3>
            <!-- Step 3 content -->
          </div>
        }
      }

      <div class="flex justify-between pt-4">
        <tolle-button variant="outline" (click)="prev()" [disabled]="step() === 1">
          Previous
        </tolle-button>
        <tolle-button (click)="next()">
          {{ step() === 3 ? 'Finish' : 'Next' }}
        </tolle-button>
      </div>
    </div>
  `,
})
export class WizardComponent {
  private modalRef = inject(ModalRef);
  step = signal(1);
  data = this.modalRef.modal.data as any;

  next() {
    if (this.step() === 3) {
      this.modalRef.close(this.data);
    } else {
      this.step.update(s => s + 1);
    }
  }

  prev() {
    this.step.update(s => s - 1);
  }
}

// Opening the wizard
const ref = this.modalService.open({
  content: WizardComponent,
  data: { name: '', address: '', city: '' },
  size: 'fullscreen',
  backdropClose: false,
  showCloseButton: true,
});
```

## Accessibility

The Modal component follows WAI-ARIA dialog (modal) pattern:

- **Roles**: Uses `role="dialog"` and `aria-modal="true"`.
- **Labels**:
  - Use `title` in config or `aria-label` for visible titles
  - Use `aria-describedby` if there is descriptive content
- **Keyboard Navigation**:
  - Escape: Close the modal
  - Tab/Shift+Tab: Navigate between focusable elements within the modal
- **Focus Management**:
  - Focus is automatically trapped within the modal when opened
  - Focus moves to the modal (or first focusable element) when opened
  - Focus returns to the element that triggered the modal when closed
- **Screen Readers**:
  - Background content is marked as `inert` (hidden from screen readers)
  - Modal content is announced when opened
- **Backdrop**: Click on backdrop to close (configurable via `backdropClose`)
