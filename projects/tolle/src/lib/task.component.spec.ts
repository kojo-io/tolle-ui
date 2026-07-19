import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  TaskComponent,
  TaskTriggerComponent,
  TaskContentComponent,
  TaskItemComponent,
  TaskItemFileComponent,
  type TaskStatus,
} from './task.component';

@Component({
  standalone: true,
  imports: [
    TaskComponent,
    TaskTriggerComponent,
    TaskContentComponent,
    TaskItemComponent,
    TaskItemFileComponent,
  ],
  template: `
    <tolle-task [status]="status" [title]="title" [open]="open" (openChange)="lastOpen = $event">
      <tolle-task-trigger></tolle-task-trigger>
      <tolle-task-content>
        <tolle-task-item>
          Searched <tolle-task-item-file>utils/cn.ts</tolle-task-item-file>
        </tolle-task-item>
      </tolle-task-content>
    </tolle-task>
  `,
})
class TaskHostComponent {
  @Input() status: TaskStatus = 'pending';
  @Input() title = 'Read the codebase';
  @Input() open = false;
  lastOpen: boolean | null = null;
}

describe('TaskComponent', () => {
  let fixture: ComponentFixture<TaskHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TaskHostComponent] }).compileComponents();

    fixture = TestBed.createComponent(TaskHostComponent);
    fixture.detectChanges();
    host = fixture.nativeElement;
  });

  const root = (): HTMLElement => host.querySelector('tolle-task > div')!;
  const triggerButton = (): HTMLButtonElement => host.querySelector('tolle-task-trigger button')!;
  const statusIcon = (): HTMLElement => host.querySelector('tolle-task-trigger i[data-status]')!;
  const content = (): HTMLElement | null => host.querySelector('tolle-task-content div');

  it('should create', () => {
    expect(fixture.debugElement.query(By.directive(TaskComponent))).toBeTruthy();
  });

  it('renders the title through the trigger', () => {
    expect(triggerButton().textContent).toContain('Read the codebase');
  });

  it('reflects the title when it changes on the parent', () => {
    fixture.componentRef.setInput('title', 'Wrote the migration');
    fixture.detectChanges();

    expect(triggerButton().textContent).toContain('Wrote the migration');
  });

  it('uses the pending status classes by default', () => {
    expect(root().getAttribute('data-status')).toBe('pending');
    expect(root().className).toContain('border-border');
    expect(statusIcon().className).toContain('text-muted-foreground');
    expect(statusIcon().className).toContain('ri-circle-line');
  });

  it('switches to the in-progress status classes and icon', () => {
    fixture.componentRef.setInput('status', 'in-progress');
    fixture.detectChanges();

    expect(root().className).toContain('border-info/40');
    expect(statusIcon().className).toContain('text-info');
    expect(statusIcon().className).toContain('animate-spin');
  });

  it('switches to the completed status classes and icon', () => {
    fixture.componentRef.setInput('status', 'completed');
    fixture.detectChanges();

    expect(root().className).toContain('border-success/40');
    expect(statusIcon().className).toContain('text-success');
    expect(statusIcon().className).toContain('ri-checkbox-circle-fill');
  });

  it('switches to the error status classes and icon', () => {
    fixture.componentRef.setInput('status', 'error');
    fixture.detectChanges();

    expect(root().className).toContain('border-destructive/40');
    expect(statusIcon().className).toContain('text-destructive');
    expect(statusIcon().className).toContain('ri-error-warning-fill');
  });

  it('keeps the content collapsed until the task is opened', () => {
    expect(content()).toBeNull();
    expect(triggerButton().getAttribute('aria-expanded')).toBe('false');
  });

  it('reveals the content when the trigger is clicked', () => {
    triggerButton().click();
    fixture.detectChanges();

    expect(content()).toBeTruthy();
    expect(triggerButton().getAttribute('aria-expanded')).toBe('true');
  });

  it('emits openChange when the trigger toggles the task', () => {
    triggerButton().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastOpen).toBe(true);

    triggerButton().click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastOpen).toBe(false);
    expect(content()).toBeNull();
  });

  it('does not emit openChange for its own initial state', () => {
    expect(fixture.componentInstance.lastOpen).toBeNull();
  });

  it('opens from the open input', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(content()).toBeTruthy();
  });

  it('projects task items and file chips into the content', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const item: HTMLElement = host.querySelector('tolle-task-item div')!;
    expect(item.textContent).toContain('Searched');
    expect(item.className).toContain('text-muted-foreground');

    const file: HTMLElement = host.querySelector('tolle-task-item-file span')!;
    expect(file.textContent).toContain('utils/cn.ts');
    expect(file.className).toContain('rounded-md');
    expect(file.querySelector('i')!.className).toContain('ri-file-line');
  });
});

describe('TaskItemFileComponent', () => {
  it('accepts a custom leading icon', () => {
    TestBed.configureTestingModule({ imports: [TaskItemFileComponent] });
    const fixture = TestBed.createComponent(TaskItemFileComponent);
    fixture.componentRef.setInput('icon', 'ri-folder-line');
    fixture.detectChanges();

    const icon: HTMLElement = fixture.nativeElement.querySelector('i');
    expect(icon.className).toContain('ri-folder-line');
  });

  it('merges extra classes onto the chip', () => {
    TestBed.configureTestingModule({ imports: [TaskItemFileComponent] });
    const fixture = TestBed.createComponent(TaskItemFileComponent);
    fixture.componentRef.setInput('class', 'my-chip');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span').className).toContain('my-chip');
  });
});
