# Scroll Area Component Usage Guide

## Overview

The ScrollArea component provides a custom-styled scrollable area. It hides native scrollbars while maintaining full scrolling functionality.

## Import

```typescript
import { ScrollAreaComponent } from '@tolle_/tolle-ui';
```

## ScrollAreaComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `class` | `string` | `''` | Additional CSS classes |
| `height` | `string` | `'100%'` | Height of the scroll area |
| `orientation` | `'vertical'\|'horizontal'\|'both'` | `'both'` | Scroll direction |

## Basic Usage

### Vertical Scroll Area

```html
<scroll-area-component height="300px">
  <div class="p-4">
    <p>Long content goes here...</p>
    <p>More content...</p>
    <p>Even more content...</p>
  </div>
</scroll-area-component>
```

### Horizontal Scroll Area

```html
<scroll-area-component
  height="200px"
  orientation="horizontal"
>
  <div class="flex gap-4 p-4">
    <div class="h-24 w-48 bg-muted rounded"></div>
    <div class="h-24 w-48 bg-muted rounded"></div>
    <div class="h-24 w-48 bg-muted rounded"></div>
    <div class="h-24 w-48 bg-muted rounded"></div>
  </div>
</scroll-area-component>
```

### Both Directions

```html
<scroll-area-component
  height="300px"
  orientation="both"
>
  <div class="p-4" style="width: 1000px;">
    <p>Content that needs scrolling in both directions...</p>
  </div>
</scroll-area-component>
```

## Scroll Area Sizes

### Small Height

```html
<scroll-area-component height="150px">
  <div class="p-4 space-y-2">
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
  </div>
</scroll-area-component>
```

### Medium Height

```html
<scroll-area-component height="250px">
  <div class="p-4 space-y-2">
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
    <div class="h-8 bg-muted rounded"></div>
  </div>
</scroll-area-component>
```

### Full Height

```html
<scroll-area-component height="100%">
  <div class="p-4 space-y-4">
    <div class="h-20 bg-muted rounded"></div>
    <div class="h-20 bg-muted rounded"></div>
  </div>
</scroll-area-component>
```

## Scroll Area with Custom Content

### List with Scroll

```html
<scroll-area-component height="300px">
  <div class="space-y-1">
    <div class="flex items-center gap-3 p-3 hover:bg-accent rounded cursor-pointer">
      <div class="h-8 w-8 bg-primary rounded flex items-center justify-center text-primary-foreground">
        1
      </div>
      <div>
        <div class="font-medium">First Item</div>
        <div class="text-sm text-muted-foreground">Description</div>
      </div>
    </div>
    <div class="flex items-center gap-3 p-3 hover:bg-accent rounded cursor-pointer">
      <div class="h-8 w-8 bg-primary rounded flex items-center justify-center text-primary-foreground">
        2
      </div>
      <div>
        <div class="font-medium">Second Item</div>
        <div class="text-sm text-muted-foreground">Description</div>
      </div>
    </div>
    <div class="flex items-center gap-3 p-3 hover:bg-accent rounded cursor-pointer">
      <div class="h-8 w-8 bg-primary rounded flex items-center justify-center text-primary-foreground">
        3
      </div>
      <div>
        <div class="font-medium">Third Item</div>
        <div class="text-sm text-muted-foreground">Description</div>
      </div>
    </div>
  </div>
</scroll-area-component>
```

### Grid with Scroll

```html
<scroll-area-component height="300px">
  <div class="grid grid-cols-2 gap-4 p-4">
    <div class="h-32 bg-muted rounded-lg"></div>
    <div class="h-32 bg-muted rounded-lg"></div>
    <div class="h-32 bg-muted rounded-lg"></div>
    <div class="h-32 bg-muted rounded-lg"></div>
    <div class="h-32 bg-muted rounded-lg"></div>
    <div class="h-32 bg-muted rounded-lg"></div>
  </div>
</scroll-area-component>
```

## Scroll Area in Card

```html
<tolle-card class="w-full max-w-md">
  <tolle-card-header>
    <tolle-card-title>Recent Files</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="p-0">
    <scroll-area-component height="300px">
      <div class="space-y-1 p-2">
        <div class="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
          <i class="ri-file-text-line text-muted-foreground"></i>
          <div class="flex-1 min-w-0">
            <div class="font-medium truncate">Document.pdf</div>
            <div class="text-xs text-muted-foreground">2 MB</div>
          </div>
        </div>
        <div class="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
          <i class="ri-image-line text-muted-foreground"></i>
          <div class="flex-1 min-w-0">
            <div class="font-medium truncate">Image.png</div>
            <div class="text-xs text-muted-foreground">1.5 MB</div>
          </div>
        </div>
        <div class="flex items-center gap-3 p-2 hover:bg-accent rounded cursor-pointer">
          <i class="ri-video-line text-muted-foreground"></i>
          <div class="flex-1 min-w-0">
            <div class="font-medium truncate">Video.mp4</div>
            <div class="text-xs text-muted-foreground">10 MB</div>
          </div>
        </div>
      </div>
    </scroll-area-component>
  </tolle-card-content>
</tolle-card>
```

## Scroll Area with Nested Content

### Comment Thread

```html
<scroll-area-component height="400px">
  <div class="space-y-4 p-4">
    <div class="flex gap-3">
      <div class="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
        A
      </div>
      <div>
        <div class="font-medium">Alice</div>
        <p class="text-sm mt-1">This is a comment.</p>
      </div>
    </div>
    <div class="flex gap-3">
      <div class="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground">
        B
      </div>
      <div>
        <div class="font-medium">Bob</div>
        <p class="text-sm mt-1">This is a reply to Alice's comment.</p>
      </div>
    </div>
    <div class="flex gap-3">
      <div class="h-10 w-10 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground">
        C
      </div>
      <div>
        <div class="font-medium">Charlie</div>
        <p class="text-sm mt-1">Another comment in the thread.</p>
      </div>
    </div>
  </div>
</scroll-area-component>
```

## Scroll Area with Sticky Header

```html
<div class="flex flex-col" style="height: 300px;">
  <div class="flex items-center gap-2 p-3 border-b bg-background">
    <div class="font-medium">Files</div>
  </div>
  <scroll-area-component class="flex-1">
    <div class="p-2 space-y-1">
      <div class="flex items-center gap-2 p-2 hover:bg-accent rounded">
        <i class="ri-file-text-line text-muted-foreground"></i>
        <span>Document.pdf</span>
      </div>
      <div class="flex items-center gap-2 p-2 hover:bg-accent rounded">
        <i class="ri-image-line text-muted-foreground"></i>
        <span>Image.png</span>
      </div>
    </div>
  </scroll-area-component>
</div>
```

## Scroll Area with Custom Scrollbar

### CSS for Scrollbar

```css
/* Custom scrollbar styles */
::ng-deep .scroll-area::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::ng-deep .scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

::ng-deep .scroll-area::-webkit-scrollbar-thumb {
  background: #e5e5e5;
  border-radius: 10px;
}

.dark ::ng-deep .scroll-area::-webkit-scrollbar-thumb {
  background: #262626;
}

::ng-deep .scroll-area::-webkit-scrollbar-thumb:hover {
  background: #d4d4d4;
}

.dark ::ng-deep .scroll-area::-webkit-scrollbar-thumb:hover {
  background: #404040;
}
```

## Scroll Area in Modal

```html
<tolle-alert-dialog-content class="max-w-2xl">
  <tolle-alert-dialog-header>
    <tolle-alert-dialog-title>Terms of Service</tolle-alert-dialog-title>
  </tolle-alert-dialog-header>

  <tolle-alert-dialog-content class="max-h-[400px]">
    <scroll-area-component height="300px">
      <div class="space-y-4 p-4 text-sm">
        <p>Term 1:...</p>
        <p>Term 2:...</p>
        <p>Term 3:...</p>
      </div>
    </scroll-area-component>
  </tolle-alert-dialog-content>

  <tolle-alert-dialog-footer>
    <button variant="outline">Decline</button>
    <button>Accept</button>
  </tolle-alert-dialog-footer>
</tolle-alert-dialog-content>
```

## Scroll Area with Auto Scroll

### Auto Scroll to Bottom

```html
<scroll-area-component
  height="300px"
  #scrollArea
>
  <div class="space-y-2 p-4">
    <div *ngFor="let message of messages">
      <div class="flex items-start gap-2">
        <div class="h-8 w-8 bg-primary rounded-full flex-shrink-0 flex items-center justify-center text-primary-foreground text-xs">
          {{ message.user.charAt(0) }}
        </div>
        <div>
          <div class="text-xs font-medium">{{ message.user }}</div>
          <div class="text-sm">{{ message.text }}</div>
        </div>
      </div>
    </div>
  </div>
</scroll-area-component>
```

```typescript
@ViewChild('scrollArea') scrollArea!: ScrollAreaComponent;

ngAfterViewChecked() {
  this.scrollToBottom();
}

scrollToBottom() {
  const container = this.scrollArea.el.nativeElement.querySelector('div');
  container.scrollTop = container.scrollHeight;
}
```
