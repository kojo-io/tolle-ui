# Resizable Component Usage Guide

## Overview

The Resizable component provides a container that can be resized by dragging its edges or corners. The ResizablePanel and ResizablePanelItem components create split-pane layouts with draggable dividers.

## Import

```typescript
import {
  ResizableComponent,
  ResizablePanelComponent,
  ResizablePanelItemComponent,
  ResizableHandleComponent
} from '@tolle_/tolle-ui';
```

## Components

### ResizableComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `width` | `number` | `300` | Initial width in pixels |
| `height` | `number` | `200` | Initial height in pixels |
| `minWidth` | `number` | `50` | Minimum width |
| `minHeight` | `number` | `50` | Minimum height |
| `maxWidth` | `number` | - | Maximum width |
| `maxHeight` | `number` | - | Maximum height |
| `resizable` | `boolean` | `true` | Enable resizing |
| `directions` | `('right'\|'bottom'\|'both')[]` | `['right', 'bottom', 'both']` | Available resize directions |
| `class` | `string` | `''` | Additional CSS classes |
| `containerClass` | `string` | `''` | Container CSS classes |

**Outputs:**

| Output | Type | Description |
|--------|------|-------------|
| `resizeStart` | `EventEmitter<void>` | Emitted when resizing starts |
| `resize` | `EventEmitter<{width: number, height: number}>` | Emitted during resize |
| `resizeEnd` | `EventEmitter<{width: number, height: number}>` | Emitted when resizing ends |

### ResizablePanelComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `direction` | `'horizontal'\|'vertical'` | `'horizontal'` | Resize direction |
| `class` | `string` | `''` | Additional CSS classes |

### ResizablePanelItemComponent

**Inputs:**

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `size` | `number` | `1` | Flex size (percentage or flex value) |
| `minSize` | `number` | `10` | Minimum size (percentage) |
| `maxSize` | `number` | - | Maximum size (percentage) |
| `resizable` | `boolean` | `true` | Enable resizing |
| `class` | `string` | `''` | Additional CSS classes |

## Basic Usage

### Simple Resizable Container

```html
<resizable-component
  [width]="400"
  [height]="300"
  [minWidth]="200"
  [minHeight]="150"
>
  <div class="w-full h-full p-4 flex items-center justify-center bg-muted rounded-md">
    Resize me!
  </div>
</resizable-component>
```

### Horizontal Resize Only

```html
<resizable-component
  [width]="400"
  [height]="300"
  [directions]="['right']"
>
  <div class="w-full h-full p-4 bg-muted rounded-md">
    <p>Resize horizontally</p>
  </div>
</resizable-component>
```

### Vertical Resize Only

```html
<resizable-component
  [width]="400"
  [height]="300"
  [directions]="['bottom']"
>
  <div class="w-full h-full p-4 bg-muted rounded-md">
    <p>Resize vertically</p>
  </div>
</resizable-component>
```

## Resizable Panel Layout

### Horizontal Split

```html
<resizable-panel direction="horizontal">
  <resizable-panel-item [size]="30">
    <div class="h-full p-4 bg-muted">
      <h3 class="font-medium">Sidebar</h3>
      <p class="text-sm text-muted-foreground">Navigation content</p>
    </div>
  </resizable-panel-item>
  <resizable-panel-item [size]="70">
    <div class="h-full p-4">
      <h3 class="font-medium">Main Content</h3>
      <p class="text-sm">Main application content</p>
    </div>
  </resizable-panel-item>
</resizable-panel>
```

### Vertical Split

```html
<resizable-panel direction="vertical">
  <resizable-panel-item [size]="40">
    <div class="h-full p-4 bg-muted">
      <h3 class="font-medium">Top Panel</h3>
    </div>
  </resizable-panel-item>
  <resizable-panel-item [size]="60">
    <div class="h-full p-4">
      <h3 class="font-medium">Bottom Panel</h3>
    </div>
  </resizable-panel-item>
</resizable-panel>
```

## Three Panel Layout

```html
<resizable-panel direction="horizontal">
  <resizable-panel-item [size]="20">
    <div class="h-full p-3 bg-muted">
      <div class="text-sm font-medium">Left Panel</div>
    </div>
  </resizable-panel-item>
  <resizable-panel-item [size]="40">
    <div class="h-full p-3">
      <div class="text-sm">Middle Panel</div>
    </div>
  </resizable-panel-item>
  <resizable-panel-item [size]="40">
    <div class="h-full p-3">
      <div class="text-sm">Right Panel</div>
    </div>
  </resizable-panel-item>
</resizable-panel>
```

## Nested Panels

```html
<resizable-panel direction="horizontal">
  <resizable-panel-item [size]="25">
    <div class="h-full p-3 bg-muted">Sidebar</div>
  </resizable-panel-item>
  <resizable-panel direction="vertical">
    <resizable-panel-item [size]="30">
      <div class="h-full p-3">
        <div class="text-sm">Top Content</div>
      </div>
    </resizable-panel-item>
    <resizable-panel-item [size]="70">
      <div class="h-full p-3">
        <div class="text-sm">Bottom Content</div>
      </div>
    </resizable-panel-item>
  </resizable-panel>
</resizable-panel>
```

## With Resize Handles

### Custom Handles

```html
<resizable-panel direction="horizontal">
  <resizable-panel-item [size]="50">
    <div class="h-full p-4 bg-muted">Left Side</div>
  </resizable-panel-item>
  <resizable-panel-item [size]="50">
    <div class="h-full p-4">Right Side</div>
  </resizable-panel-item>
</resizable-panel>
```

## Resizable Component with Outputs

```html
<resizable-component
  [width]="300"
  [height]="200"
  (resizeStart)="onResizeStart()"
  (resize)="onResize($event)"
  (resizeEnd)="onResizeEnd($event)"
>
  <div class="w-full h-full p-4 bg-muted rounded">
    <p>Current size: {{ currentWidth }} x {{ currentHeight }}</p>
  </div>
</resizable-component>
```

```typescript
currentWidth = 300;
currentHeight = 200;

onResizeStart() {
  console.log('Resize started');
}

onResize(event: { width: number; height: number }) {
  this.currentWidth = event.width;
  this.currentHeight = event.height;
}

onResizeEnd(event: { width: number; height: number }) {
  console.log('Resize ended:', event);
}
```

## Resizable Panel with Min/Max Constraints

```html
<resizable-panel direction="horizontal">
  <resizable-panel-item
    [size]="40"
    [minSize]="20"
    [maxSize]="60"
  >
    <div class="h-full p-4 bg-muted">Sidebar (20-60%)</div>
  </resizable-panel-item>
  <resizable-panel-item
    [size]="60"
    [minSize]="40"
  >
    <div class="h-full p-4">Main Content</div>
  </resizable-panel-item>
</resizable-panel>
```

## Resizable Panel in Card

```html
<tolle-card>
  <tolle-card-header>
    <tolle-card-title>Split View</tolle-card-title>
  </tolle-card-header>
  <tolle-card-content class="p-0">
    <resizable-panel direction="horizontal">
      <resizable-panel-item [size]="30">
        <div class="h-full p-4 bg-muted">
          <h4 class="font-medium mb-2">Navigation</h4>
          <ul class="space-y-1 text-sm">
            <li>Home</li>
            <li>Profile</li>
            <li>Settings</li>
          </ul>
        </div>
      </resizable-panel-item>
      <resizable-panel-item [size]="70">
        <div class="h-full p-4">
          <h4 class="font-medium mb-2">Content</h4>
          <p class="text-sm">Main content area</p>
        </div>
      </resizable-panel-item>
    </resizable-panel>
  </tolle-card-content>
</tolle-card>
```

## Resizable Panel in Full Screen Layout

```html
<div class="h-screen flex flex-col">
  <div class="h-16 border-b flex items-center px-4">
    <div class="font-medium">App Header</div>
  </div>
  <resizable-panel direction="horizontal" class="flex-1">
    <resizable-panel-item [size]="20">
      <div class="h-full p-3 bg-muted">Sidebar</div>
    </resizable-panel-item>
    <resizable-panel-item [size]="80">
      <div class="h-full p-4">
        <h2 class="text-xl font-medium">Dashboard</h2>
        <p class="text-sm mt-2">Main content area</p>
      </div>
    </resizable-panel-item>
  </resizable-panel>
</div>
```

## Resizable with Code Editor Layout

```html
<resizable-panel direction="vertical">
  <resizable-panel-item [size]="60">
    <div class="h-full p-3">
      <div class="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
        <span>editor.tsx</span>
      </div>
      <pre class="font-mono text-sm bg-muted p-4 rounded overflow-auto h-[300px]">
// Code editor content
const hello = "world";
      </pre>
    </div>
  </resizable-panel-item>
  <resizable-panel-item [size]="40">
    <div class="h-full p-3 bg-muted">
      <div class="flex items-center gap-2 mb-2 text-xs">
        <span class="font-medium">Console</span>
      </div>
      <div class="text-xs font-mono">
        <div>> npm run dev</div>
        <div>> Vite ready</div>
      </div>
    </div>
  </resizable-panel-item>
</resizable-panel>
```

## Resizable Panel with Default Sizes

```html
<resizable-panel direction="horizontal" class="w-full">
  <resizable-panel-item [size]="25">
    <div class="h-full p-3 bg-muted">Menu</div>
  </resizable-panel-item>
  <resizable-panel-item [size]="75">
    <div class="h-full p-3">
      <div class="flex justify-between mb-4">
        <h3 class="font-medium">Main</h3>
      </div>
      <p class="text-sm">Content</p>
    </div>
  </resizable-panel-item>
</resizable-panel>
```
