import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEditorComponent, EditorLanguage } from '../base-editor/base-editor.component';

/**
 * The signature shadcn-style example block: a bordered card with **Preview / Code**
 * tabs. Projected content is the live demo; `code` is shown in the CodeMirror editor.
 * Fully token-driven so it looks right in light and dark.
 *
 *   <app-preview [code]="myCode" language="html" align="center">
 *     <tolle-button>Click me</tolle-button>
 *   </app-preview>
 */
@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, BaseEditorComponent],
  template: `
    <div class="not-prose my-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <!-- Toolbar -->
      <div class="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
        <button
          type="button"
          (click)="tab = 'preview'"
          [class]="tabClass('preview')">
          <i class="ri-eye-line text-[13px]"></i> Preview
        </button>
        <button
          type="button"
          (click)="tab = 'code'"
          [class]="tabClass('code')">
          <i class="ri-code-s-slash-line text-[13px]"></i> Code
        </button>

        <div class="flex-1"></div>

        @if (tab === 'code') {
          <button
            type="button"
            (click)="copy()"
            class="mr-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <i [class]="copied ? 'ri-check-line' : 'ri-file-copy-line'"></i>
            {{ copied ? 'Copied' : 'Copy' }}
          </button>
        }
      </div>

      <!-- Preview -->
      @if (tab === 'preview') {
        <div
          [class]="'flex min-h-[240px] flex-wrap gap-4 bg-background p-8 preview-grid ' +
            (align === 'start' ? 'items-start justify-start' :
             align === 'stretch' ? 'items-stretch justify-center' :
             'items-center justify-center')">
          <ng-content></ng-content>
        </div>
      }

      <!-- Code -->
      @if (tab === 'code') {
        <div class="max-h-[520px] overflow-auto">
          <app-base-editor [code]="code" [language]="language" />
        </div>
      }
    </div>
  `,
  styles: [`
    /* Subtle dotted backdrop so the preview surface reads as a canvas. */
    .preview-grid {
      background-image: radial-gradient(rgb(var(--muted-foreground) / 0.15) 1px, transparent 1px);
      background-size: 16px 16px;
    }
  `],
})
export class ComponentPreviewComponent {
  /** Source code shown under the Code tab. */
  @Input() code = '';
  /** Editor language for syntax highlighting. @default 'html' */
  @Input() language: EditorLanguage = 'html';
  /** Alignment of the projected preview content. @default 'center' */
  @Input() align: 'center' | 'start' | 'stretch' = 'center';

  tab: 'preview' | 'code' = 'preview';
  copied = false;

  tabClass(which: 'preview' | 'code'): string {
    const active = this.tab === which;
    return (
      'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ' +
      (active
        ? 'bg-background text-foreground shadow-sm'
        : 'text-muted-foreground hover:text-foreground')
    );
  }

  copy(): void {
    if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(this.code);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1400);
  }
}
