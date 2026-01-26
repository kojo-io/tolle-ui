# Original Design Specification: Tolle UI Docs

This document captures the precise design tokens, spacings, and layout principles of the "Original" branch. **Restore these values exactly** when merging AI-native features back.

## 1. Global Navigation (Sidebar)

### Layout & Spacing
- **Width**: `64` (256px) when expanded, `16` (64px) when collapsed.
- **Container Padding**: `py-4 px-3` (16px, 12px).
- **Group Margins**: `mb-6` (24px) between navigation groups.
- **Item Margins**: `mb-2` (8px) below group titles. `gap-1` (4px) between items.

### Typography
- **Group Titles**: `text-xs font-semibold uppercase tracking-wider text-muted-foreground/70`.
- **Items**: `text-sm font-medium`.
- **Sub-Items**: `text-sm transition-colors`.

### Colors & States
- **Background**: `bg-background`.
- **Default Item**: `text-muted-foreground`.
- **Hover State**: `hover:bg-accent hover:text-accent-foreground`.
- **Active Item (Default)**: `bg-primary/80 text-primary-foreground`.
- **Sub-Item Indicators**: `w-1.5 h-1.5 rounded-full bg-border` (indicator dot).

---

## 2. API Reference (Prop Table)

### Border & Shape
- **Wrapper**: `rounded-lg border border-neutral-200 dark:border-neutral-800`.
- **Alignment**: `my-6` (24px) vertical margin.

### Thead (Header)
- **Background**: `bg-neutral-50 dark:bg-neutral-900`.
- **Border**: `border-b border-neutral-200 dark:border-neutral-800`.
- **Text**: `font-semibold px-6 py-3`.

### Tbody (Content)
- **Background**: `bg-white dark:bg-transparent`.
- **Dividers**: `divide-y divide-neutral-200 dark:divide-neutral-800`.
- **Row Hover**: `hover:bg-neutral-50 dark:hover:bg-neutral-900/50`.
- **Padding**: `px-6 py-4` (24px, 16px).

### Code & Data Types
- **Name**: `font-mono font-medium text-foreground`.
- **Type/Tags**: `text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-foreground`.
- **Default/Description**: `text-muted-foreground`.

---

## 3. Page Structure

- **Wrapper Padding**: `px-4 md:px-8 pt-4` (Main container).
- **Headers**: `h1.text-4xl font-extrabold tracking-tight mb-4`.
- **Description**: `p.text-xl text-muted-foreground mb-6`.
- **Sections**: `mb-16` / `mb-12 border-b ... pb-8`.

### Sidebar Header
- **Logo Container**: `h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm`.
- **Logo Icon**: `ri-flashlight-fill text-xl`.
- **Metadata**: `text-[10px] text-muted-foreground uppercase font-bold tracking-tighter`.
