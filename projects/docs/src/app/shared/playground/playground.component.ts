import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseEditorComponent, EditorLanguage } from '../base-editor/base-editor.component';

/**
 * Interactive playground: a live preview + generated code (Preview / Code tabs) with
 * an always-visible configuration panel beside it. Consumers project a `[preview]`
 * slot (the live component, bound to control state) and a `[controls]` slot (the
 * knobs). Fully token-driven so it matches the rest of the modern docs.
 */
@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, BaseEditorComponent],
  template: `
    <div class="not-prose my-8 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div class="flex flex-col lg:flex-row">

        <!-- Preview / Code -->
        <div class="flex min-w-0 flex-1 flex-col">
          <div class="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
            <button type="button" (click)="activeTab = 'preview'" [class]="tabClass('preview')">
              <i class="ri-eye-line text-[13px]"></i> Preview
            </button>
            <button type="button" (click)="activeTab = 'code'" [class]="tabClass('code')">
              <i class="ri-code-s-slash-line text-[13px]"></i> Code
            </button>
            <div class="flex-1"></div>
            @if (activeTab === 'code') {
              <button type="button" (click)="copy()"
                class="mr-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <i [class]="copied ? 'ri-check-line' : 'ri-file-copy-line'"></i>
                {{ copied ? 'Copied' : 'Copy' }}
              </button>
            }
          </div>

          @if (activeTab === 'preview') {
            <div class="preview-grid flex min-h-[340px] flex-1 items-center justify-center overflow-auto bg-background p-6 md:p-10">
              <div class="w-full">
                <ng-content select="[preview]"></ng-content>
              </div>
            </div>
          } @else {
            <div class="min-h-[340px] max-h-[560px] overflow-auto">
              <app-base-editor [code]="code" [language]="language" />
            </div>
          }
        </div>

        <!-- Configuration -->
        <div class="w-full shrink-0 border-t border-border bg-muted/30 p-5 lg:w-72 lg:border-l lg:border-t-0">
          <div class="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <i class="ri-equalizer-line text-sm"></i> Configuration
          </div>
          <div class="space-y-5">
            <ng-content select="[controls]"></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .preview-grid {
      background-image: radial-gradient(rgb(var(--muted-foreground) / 0.15) 1px, transparent 1px);
      background-size: 16px 16px;
    }
  `],
})
export class PlaygroundComponent {
  @Input() code: string = '';
  @Input() language: EditorLanguage = 'html';

  activeTab: 'preview' | 'code' = 'preview';
  copied = false;

  tabClass(which: 'preview' | 'code'): string {
    const active = this.activeTab === which;
    return (
      'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ' +
      (active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')
    );
  }

  copy(): void {
    if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(this.code);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1400);
  }
}
