import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  QueueComponent,
  QueueItemComponent,
  type QueueCounts,
  type QueueItemStatus,
} from './queue.component';

@Component({
  standalone: true,
  imports: [CommonModule, QueueComponent, QueueItemComponent],
  template: `
    <tolle-queue [title]="title" (countsChange)="lastCounts = $event">
      <tolle-queue-item
        *ngIf="showFirst"
        label="Summarise the thread"
        [status]="firstStatus"
      ></tolle-queue-item>
      <tolle-queue-item label="Draft a reply" status="queued" (remove)="removed = 'draft'"></tolle-queue-item>
      <tolle-queue-item label="Send it" status="queued" [removable]="false"></tolle-queue-item>
    </tolle-queue>
  `,
})
class QueueHostComponent {
  @Input() title = 'Queue';
  @Input() showFirst = true;
  @Input() firstStatus: QueueItemStatus = 'running';
  removed: string | null = null;
  lastCounts: QueueCounts | null = null;
}

describe('QueueComponent', () => {
  let fixture: ComponentFixture<QueueHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [QueueHostComponent] }).compileComponents();

    fixture = TestBed.createComponent(QueueHostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  const countBadge = (): HTMLElement => host.querySelector('tolle-queue [aria-label$="items queued"]')!;
  const items = (): HTMLElement[] => Array.from(host.querySelectorAll('tolle-queue-item [role="listitem"]'));

  it('should create', () => {
    expect(fixture.debugElement.query(By.directive(QueueComponent))).toBeTruthy();
  });

  it('renders the title', () => {
    expect(host.querySelector('tolle-queue')!.textContent).toContain('Queue');

    fixture.componentRef.setInput('title', 'Up next');
    fixture.detectChanges();
    expect(host.querySelector('tolle-queue')!.textContent).toContain('Up next');
  });

  it('counts the queued items in the header', () => {
    expect(countBadge().textContent!.trim()).toBe('3');
  });

  it('recounts when an item leaves the queue', () => {
    fixture.componentRef.setInput('showFirst', false);
    fixture.detectChanges();

    expect(countBadge().textContent!.trim()).toBe('2');
    expect(items().length).toBe(2);
  });

  it('emits the per-status tallies', () => {
    expect(fixture.componentInstance.lastCounts).toEqual({
      total: 3,
      queued: 2,
      running: 1,
      done: 0,
    });
  });

  it('re-tallies when an item changes status', () => {
    fixture.componentRef.setInput('firstStatus', 'done');
    fixture.detectChanges();

    expect(fixture.componentInstance.lastCounts).toEqual({
      total: 3,
      queued: 2,
      running: 0,
      done: 1,
    });
  });

  it('applies the running status classes and spinner icon', () => {
    expect(items()[0].getAttribute('data-status')).toBe('running');
    expect(items()[0].className).toContain('border-info/40');
    expect(items()[0].querySelector('i')!.className).toContain('animate-spin');
  });

  it('applies the queued status classes and icon', () => {
    expect(items()[1].className).toContain('text-muted-foreground');
    expect(items()[1].querySelector('i')!.className).toContain('ri-time-line');
  });

  it('strikes through and greys a finished item', () => {
    fixture.componentRef.setInput('firstStatus', 'done');
    fixture.detectChanges();

    expect(items()[0].querySelector('span')!.className).toContain('line-through');
    expect(items()[0].querySelector('i')!.className).toContain('text-success');
  });

  it('emits remove when an item is dismissed', () => {
    const dismiss: HTMLButtonElement = items()[1].querySelector('button')!;
    dismiss.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.removed).toBe('draft');
    expect(dismiss.getAttribute('aria-label')).toBe('Remove from queue');
  });

  it('hides the dismiss button when removable is false', () => {
    expect(items()[2].querySelector('button')).toBeNull();
  });

  it('renders the item labels', () => {
    expect(items()[0].textContent).toContain('Summarise the thread');
    expect(items()[1].textContent).toContain('Draft a reply');
  });
});

describe('QueueComponent when empty', () => {
  let fixture: ComponentFixture<QueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [QueueComponent] }).compileComponents();

    fixture = TestBed.createComponent(QueueComponent);
    fixture.detectChanges();
  });

  it('shows a zero count and the empty message', () => {
    expect(fixture.nativeElement.textContent).toContain('Nothing queued.');
    expect(fixture.nativeElement.querySelector('[aria-label$="items queued"]').textContent.trim()).toBe('0');
  });

  it('accepts a custom empty message', () => {
    fixture.componentRef.setInput('emptyMessage', 'All caught up.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('All caught up.');
  });

  it('applies the sm size classes', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    const root: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(root.className).toContain('p-2');
    expect(root.className).toContain('text-xs');
  });
});
