import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AttachmentComponent,
  AttachmentGroupComponent,
  AttachmentActionsComponent
} from './attachment.component';

@Component({
  standalone: true,
  imports: [AttachmentComponent, AttachmentGroupComponent, AttachmentActionsComponent],
  template: `
    <tolle-attachment-group>
      <tolle-attachment
        name="notes.txt"
        type="text/plain"
        [size]="1536"
        (open)="opens = opens + 1">
        <tolle-attachment-actions>
          <button type="button" id="download" (click)="downloads = downloads + 1">Download</button>
        </tolle-attachment-actions>
      </tolle-attachment>
    </tolle-attachment-group>
  `
})
class AttachmentHostComponent {
  opens = 0;
  downloads = 0;
}

describe('AttachmentComponent', () => {
  let component: AttachmentComponent;
  let fixture: ComponentFixture<AttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'notes.txt');
    fixture.componentRef.setInput('type', 'text/plain');
    fixture.detectChanges();
  });

  const card = (): HTMLElement => fixture.nativeElement.querySelector('div');
  const icon = (): HTMLElement | null => fixture.nativeElement.querySelector('span > i');
  const thumb = (): HTMLImageElement | null => fixture.nativeElement.querySelector('img');
  const meta = (): HTMLElement =>
    fixture.nativeElement.querySelectorAll('span.truncate')[1] as HTMLElement;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the card as a keyboard-reachable trigger', () => {
    expect(card().getAttribute('role')).toBe('button');
    expect(card().getAttribute('tabindex')).toBe('0');
    expect(card().getAttribute('aria-label')).toBe('notes.txt');
  });

  describe('byte formatting', () => {
    const cases: Array<[number, string]> = [
      [0, '0 B'],
      [512, '512 B'],
      [1023, '1023 B'],
      [1024, '1 KB'],
      [1536, '1.5 KB'],
      [2048, '2 KB'],
      [1048576, '1 MB'],
      [1572864, '1.5 MB'],
      [1073741824, '1 GB']
    ];

    for (const [bytes, expected] of cases) {
      it('formats ' + bytes + ' bytes as ' + expected, () => {
        fixture.componentRef.setInput('size', bytes);
        fixture.detectChanges();

        expect(component.formattedSize).toBe(expected);
        expect(meta().textContent!.trim()).toBe(expected);
      });
    }

    it('renders nothing for a negative size', () => {
      fixture.componentRef.setInput('size', -1);
      fixture.detectChanges();

      expect(component.formattedSize).toBe('');
    });
  });

  describe('icon and thumbnail branches', () => {
    it('shows a file icon chosen from the mime type', () => {
      expect(thumb()).toBeNull();
      expect(icon()!.className).toContain('ri-file-text-line');
    });

    it('shows a thumbnail for an image with a url', () => {
      fixture.componentRef.setInput('type', 'image/png');
      fixture.componentRef.setInput('url', 'data:image/png;base64,iVBORw0KGgo=');
      fixture.detectChanges();

      expect(component.isImage).toBe(true);
      expect(icon()).toBeNull();
      expect(thumb()!.getAttribute('alt')).toBe('notes.txt');
    });

    it('falls back to the image icon when an image has no url', () => {
      fixture.componentRef.setInput('type', 'image/png');
      fixture.detectChanges();

      expect(component.isImage).toBe(false);
      expect(thumb()).toBeNull();
      expect(icon()!.className).toContain('ri-image-line');
    });

    const iconCases: Array<[string, string]> = [
      ['application/pdf', 'ri-file-pdf-line'],
      ['video/mp4', 'ri-film-line'],
      ['audio/mpeg', 'ri-music-2-line'],
      ['application/zip', 'ri-file-zip-line'],
      ['text/csv', 'ri-file-text-line'],
      ['application/octet-stream', 'ri-file-line']
    ];

    for (const [type, expected] of iconCases) {
      it('picks ' + expected + ' for ' + type, () => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();

        expect(icon()!.className).toContain(expected);
      });
    }
  });

  describe('upload state', () => {
    const bar = (): HTMLElement | null =>
      fixture.nativeElement.querySelector('[role="progressbar"]');

    it('shows no progress bar while idle', () => {
      expect(bar()).toBeNull();
      expect(card().className).toContain('bg-card');
    });

    it('renders a progress bar while uploading', () => {
      fixture.componentRef.setInput('state', 'uploading');
      fixture.componentRef.setInput('progress', 40);
      fixture.detectChanges();

      expect(bar()!.getAttribute('aria-valuenow')).toBe('40');
      expect((bar()!.firstElementChild as HTMLElement).style.width).toBe('40%');
    });

    it('clamps out-of-range progress values', () => {
      fixture.componentRef.setInput('state', 'uploading');
      fixture.componentRef.setInput('progress', 140);
      fixture.detectChanges();

      expect(component.clampedProgress).toBe(100);
      expect(bar()!.getAttribute('aria-valuenow')).toBe('100');
    });

    it('shows the error label and destructive styling on failure', () => {
      fixture.componentRef.setInput('size', 1536);
      fixture.componentRef.setInput('state', 'error');
      fixture.detectChanges();

      expect(card().className).toContain('border-destructive');
      expect(meta().textContent!.trim()).toBe('Upload failed');
      expect(bar()).toBeNull();
    });
  });

  it('applies the sm density variant', () => {
    fixture.componentRef.setInput('density', 'sm');
    fixture.detectChanges();

    expect(card().className).toContain('p-1.5');
    expect(card().className).toContain('text-xs');
  });

  it('emits open when the card is clicked', () => {
    const emitted: Event[] = [];
    component.open.subscribe(e => emitted.push(e));

    card().click();

    expect(emitted.length).toBe(1);
  });

  it('emits remove from the built-in remove button without also opening', () => {
    const removes: Event[] = [];
    const opens: Event[] = [];
    component.remove.subscribe(e => removes.push(e));
    component.open.subscribe(e => opens.push(e));

    fixture.componentRef.setInput('removable', true);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Remove attachment');

    button.click();

    expect(removes.length).toBe(1);
    expect(opens.length).toBe(0);
  });

  it('merges extra classes passed through the class input', () => {
    fixture.componentRef.setInput('class', 'my-custom-attachment');
    fixture.detectChanges();

    expect(card().className).toContain('my-custom-attachment');
  });
});

describe('Attachment group and actions', () => {
  let hostFixture: ComponentFixture<AttachmentHostComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentHostComponent]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(AttachmentHostComponent);
    hostFixture.detectChanges();
    host = hostFixture.nativeElement;
  });

  it('wraps attachments in a flex row', () => {
    const group: HTMLElement = host.querySelector('tolle-attachment-group div')!;

    expect(group.className).toContain('flex-wrap');
    expect(group.className).toContain('gap-2');
  });

  it('reveals the actions slot on card hover by default', () => {
    const actions: HTMLElement = host.querySelector('tolle-attachment-actions div')!;

    expect(actions.className).toContain('opacity-0');
    expect(actions.className).toContain('group-hover/attachment:opacity-100');
  });

  it('does not fire the card trigger when an action is clicked', () => {
    const download: HTMLButtonElement = host.querySelector('#download')!;

    download.click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.downloads).toBe(1);
    expect(hostFixture.componentInstance.opens).toBe(0);
  });

  it('still fires the card trigger for a click on the card itself', () => {
    const card: HTMLElement = host.querySelector('tolle-attachment > div')!;

    card.click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.opens).toBe(1);
    expect(hostFixture.componentInstance.downloads).toBe(0);
  });

  it('formats the projected attachment size for display', () => {
    const attachment: HTMLElement = host.querySelector('tolle-attachment')!;

    expect(attachment.textContent).toContain('notes.txt');
    expect(attachment.textContent).toContain('1.5 KB');
  });
});
