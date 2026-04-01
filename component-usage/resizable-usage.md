# Resizable Component Usage Guide

## Overview

The Resizable component provides a container that can be resized by dragging its edges or corners. The ResizablePanel and ResizablePanelItem components create split-pane layouts with draggable dividers.

## Import

```typescript
import {
  ResizableComponent,
  ResizablePanelComponent,
  ResizablePanelItemComponent
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

### Basic Resizable Example

```html
<div class="w-full h-[300px] rounded-lg border border-input overflow-hidden">
      <tolle-resizable-panel direction="horizontal" class="h-full">
        <tolle-resizable-panel-item [size]="30" class="bg-muted/30 flex items-center justify-center">
          <div class="text-sm font-medium">Sidebar</div>
        </tolle-resizable-panel-item>
        
        <tolle-resizable-panel-item [size]="70" class="bg-background flex items-center justify-center">
          <div class="text-sm font-medium">Main Content</div>
        </tolle-resizable-panel-item>
      </tolle-resizable-panel>
    </div>
```

