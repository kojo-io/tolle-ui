# Modal Component Usage Guide

## Overview

The Modal component provides a dialog overlay for displaying content that requires user attention. The ModalService allows programmatic control of modals.

## Import

```typescript
import {
  ModalComponent,
  ModalService
} from '@tolle_/tolle-ui';
```

## ModalComponent

### Constructor

| Parameter | Type | Description |
|-----------|------|-------------|
| `ref` | `ModalRef` | Reference to the modal |

### Component Properties

| Property | Type | Description |
|----------|------|-------------|
| `contentType` | `'template'\|'string'\|'component'` | Type of content being displayed |
| `content` | `any` | The content to display |

## ModalService

**Methods:**

| Method | Returns | Description |
|--------|---------|-------------|
| `open(config: Modal)` | `ModalRef<R>` | Open a new modal |
| `closeAll()` | `void` | Close all modals |

## ModalRef

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `afterClosed$` | `Observable<R>` | Observable for when modal closes |
| `modal` | `Modal` | Modal configuration |

**Methods:**

| Method | Returns | Description |
|--------|---------|-------------|
| `close(result?: R)` | `void` | Close the modal |

## Modal Configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | `string\|Type<any>\|TemplateRef<any>` | - | Content to display |
| `title` | `string` | - | Modal title |
| `size` | `'xs'\|'sm'\|'default'\|'lg'\|'fullscreen'` | `'default'` | Modal size |
| `backdropClose` | `boolean` | `true` | Close on backdrop click |
| `data` | `any` | - | Data for component content |
| `context` | `any` | - | Context for template content |
| `showCloseButton` | `boolean` | `true` | Show close button |

## Basic Usage

### String Content Modal

```typescript
// Component
constructor(private modalService: ModalService) {}

openModal() {
  const modalRef = this.modalService.open({
    content: 'This is a simple modal with string content.',
    title: 'Simple Modal'
  });
}
```

### Component Content Modal

```typescript
@Component({
  selector: 'app-modal-content',
  template: `
    <p>This is a component inside a modal.</p>
    <button tolleButton (click)="ref.close()">Close</button>
  `
})
export class ModalContentComponent {
  constructor(public ref: ModalRef) {}
}

// In parent component
openComponentModal() {
  const modalRef = this.modalService.open({
    content: ModalContentComponent,
    title: 'Component Modal'
  });
}
```

### Template Content Modal

```typescript
@ViewChild('modalTemplate') modalTemplate!: TemplateRef<any>;

openTemplateModal() {
  const modalRef = this.modalService.open({
    content: this.modalTemplate,
    title: 'Template Modal'
  });
}
```

```html
<ng-template #modalTemplate>
  <p>This is a template inside a modal.</p>
</ng-template>
```

## Modal Sizes

### Extra Small (xs)

```typescript
this.modalService.open({
  content: 'Small modal',
  size: 'xs'
});
```

### Small (sm)

```typescript
this.modalService.open({
  content: 'Small modal',
  size: 'sm'
});
```

### Default

```typescript
this.modalService.open({
  content: 'Default modal',
  size: 'default'
});
```

### Large (lg)

```typescript
this.modalService.open({
  content: 'Large modal',
  size: 'lg'
});
```

### Fullscreen

```typescript
this.modalService.open({
  content: 'Fullscreen modal',
  size: 'fullscreen'
});
```

## Modal with Form

### Reactive Form in Modal

```typescript
openFormModal() {
  const modalRef = this.modalService.open({
    content: FormModalContentComponent,
    title: 'Edit User',
    data: { user: this.selectedUser }
  });

  modalRef.afterClosed$.subscribe(result => {
    if (result) {
      console.log('Form submitted:', result);
    }
  });
}

@Component({
  selector: 'app-form-modal',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="space-y-4">
        <tolle-input formControlName="name" label="Name" />
        <tolle-input formControlName="email" label="Email" type="email" />
      </div>
      <div class="mt-4 flex gap-2">
        <button tolleButton variant="outline" type="button" (click)="ref.close()">
          Cancel
        </button>
        <button tolleButton type="submit">
          Save
        </button>
      </div>
    </form>
  `
})
export class FormModalContentComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(
    public ref: ModalRef,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const user = this.ref.modal.data?.user;
    if (user) {
      this.form.patchValue(user);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.ref.close(this.form.value);
    }
  }
}
```

## Modal with Backdrop

### Non-Closable Modal

```typescript
this.modalService.open({
  content: 'This modal cannot be closed by clicking outside.',
  backdropClose: false,
  showCloseButton: false
});
```

## Modal with Confirmation

### Delete Confirmation

```typescript
confirmDelete() {
  const modalRef = this.modalService.open({
    content: `
      <p>Are you sure you want to delete this item?</p>
      <p class="text-sm text-muted-foreground">This action cannot be undone.</p>
    `,
    title: 'Confirm Delete',
    backdropClose: false,
    showCloseButton: true
  });

  // Custom implementation for confirmation
}
```

## Modal with Async Content

```typescript
async openAsyncModal() {
  const content = await this.loadData();

  this.modalService.open({
    content: content,
    title: 'Loaded Content'
  });
}

async loadData() {
  // Simulate API call
  return await new Promise(resolve => {
    setTimeout(() => resolve('<p>Loaded data</p>'), 1000);
  });
}
```

## Modal in Component

```html
<button tolleButton (click)="openModal()">Open Modal</button>
```

## Multiple Modals

```typescript
// Stack of modals
openFirstModal() {
  this.modalService.open({
    content: 'First modal',
    title: 'Modal 1'
  });
}

openSecondModal() {
  this.modalService.open({
    content: 'Second modal',
    title: 'Modal 2'
  });
}

// Close all
closeAll() {
  this.modalService.closeAll();
}
```

## Modal with Custom Styling

### Full Width Modal

```typescript
this.modalService.open({
  content: `
    <div class="w-full">
      <!-- Full width content -->
    </div>
  `,
  size: 'default'
});
```

### Large Content Modal

```typescript
this.modalService.open({
  content: `
    <div class="max-h-[80vh] overflow-y-auto">
      <!-- Scrollable content -->
    </div>
  `,
  size: 'lg'
});
```
