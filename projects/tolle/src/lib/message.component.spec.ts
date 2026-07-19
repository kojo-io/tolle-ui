import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  MessageComponent,
  MessageGroupComponent,
  MessageAvatarComponent,
  MessageContentComponent,
  MessageHeaderComponent,
  MessageFooterComponent
} from './message.component';

@Component({
  standalone: true,
  imports: [
    MessageComponent,
    MessageGroupComponent,
    MessageAvatarComponent,
    MessageContentComponent,
    MessageHeaderComponent,
    MessageFooterComponent
  ],
  template: `
    <tolle-message-group [align]="align">
      <tolle-message [align]="align">
        <tolle-message-avatar>AL</tolle-message-avatar>
        <tolle-message-content>
          <tolle-message-header>Ada Lovelace</tolle-message-header>
          <p>Hello there</p>
          <tolle-message-footer>Delivered</tolle-message-footer>
        </tolle-message-content>
      </tolle-message>
    </tolle-message-group>
  `
})
class MessageHostComponent {
  align: any = 'start';
}

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const row = (): HTMLElement => fixture.nativeElement.querySelector('div');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the row as a listitem', () => {
    expect(row().getAttribute('role')).toBe('listitem');
  });

  it('applies the start align variant by default', () => {
    expect(row().className).toContain('flex-row');
    expect(row().className).not.toContain('flex-row-reverse');
  });

  it('mirrors the row for the end align variant', () => {
    fixture.componentRef.setInput('align', 'end');
    fixture.detectChanges();

    expect(row().className).toContain('flex-row-reverse');
  });

  it('applies the sm size variant', () => {
    fixture.componentRef.setInput('size', 'sm');
    fixture.detectChanges();

    expect(row().className).toContain('gap-1.5');
    expect(row().className).toContain('text-sm');
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-message');
    fixture.detectChanges();

    expect(row().className).toContain('my-custom-message');
  });
});

describe('MessageGroupComponent', () => {
  let fixture: ComponentFixture<MessageGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageGroupComponent);
    fixture.detectChanges();
  });

  const group = (): HTMLElement => fixture.nativeElement.querySelector('div');

  it('stacks its messages in a column', () => {
    expect(group().className).toContain('flex-col');
    expect(group().getAttribute('role')).toBe('group');
  });

  it('aligns grouped messages to the end', () => {
    fixture.componentRef.setInput('align', 'end');
    fixture.detectChanges();

    expect(group().className).toContain('items-end');
  });

  it('tightens the gap for consecutive messages from one sender', () => {
    fixture.componentRef.setInput('spacing', 'tight');
    fixture.detectChanges();

    expect(group().className).toContain('gap-0.5');
    expect(group().className).not.toContain('gap-3');
  });
});

describe('Message sub-components', () => {
  let hostFixture: ComponentFixture<MessageHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageHostComponent]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(MessageHostComponent);
    hostFixture.detectChanges();
    host = hostFixture.nativeElement;
  });

  it('projects the avatar and anchors it to the row bottom', () => {
    const avatar: HTMLElement = host.querySelector('tolle-message-avatar div')!;

    expect(avatar.textContent!.trim()).toBe('AL');
    expect(avatar.className).toContain('self-end');
    expect(avatar.className).toContain('shrink-0');
  });

  it('projects the header and footer content', () => {
    const header: HTMLElement = host.querySelector('tolle-message-header div')!;
    const footer: HTMLElement = host.querySelector('tolle-message-footer div')!;

    expect(header.textContent!.trim()).toBe('Ada Lovelace');
    expect(footer.textContent!.trim()).toBe('Delivered');
  });

  it('projects arbitrary content into the content column', () => {
    const content: HTMLElement = host.querySelector('tolle-message-content div')!;

    expect(content.querySelector('p')!.textContent!.trim()).toBe('Hello there');
    expect(content.className).toContain('flex-1');
    expect(content.className).toContain('min-w-0');
  });

  it('aligns the content column to the start by default', () => {
    const content: HTMLElement = host.querySelector('tolle-message-content div')!;

    expect(content.className).toContain('items-start');
    expect(content.className).toContain('text-left');
  });

  it('re-renders OnPush sub-components when the parent message flips to end', () => {
    hostFixture.componentInstance.align = 'end';
    hostFixture.detectChanges();

    const content: HTMLElement = host.querySelector('tolle-message-content div')!;
    const header: HTMLElement = host.querySelector('tolle-message-header div')!;
    const footer: HTMLElement = host.querySelector('tolle-message-footer div')!;

    expect(content.className).toContain('items-end');
    expect(content.className).toContain('text-right');
    expect(header.className).toContain('flex-row-reverse');
    expect(footer.className).toContain('flex-row-reverse');
  });
});

describe('MessageContentComponent outside a message', () => {
  let fixture: ComponentFixture<MessageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageContentComponent);
    fixture.detectChanges();
  });

  it('falls back to start alignment without a parent message', () => {
    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.className).toContain('items-start');
  });

  it('still merges extra classes', () => {
    fixture.componentRef.setInput('class', 'my-custom-content');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(el.className).toContain('my-custom-content');
  });
});
