import { ApplicationRef, Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import {
  AlertDialogComponent,
  AlertDialogTriggerComponent,
  AlertDialogPortalComponent,
  AlertDialogContentComponent,
  AlertDialogHeaderComponent,
  AlertDialogFooterComponent,
  AlertDialogTitleComponent,
  AlertDialogDescriptionComponent,
  AlertDialogActionComponent,
  AlertDialogCancelComponent,
} from './alert-dialog.component';

@Component({
  standalone: true,
  imports: [
    AlertDialogComponent,
    AlertDialogTriggerComponent,
    AlertDialogPortalComponent,
    AlertDialogContentComponent,
    AlertDialogHeaderComponent,
    AlertDialogFooterComponent,
    AlertDialogTitleComponent,
    AlertDialogDescriptionComponent,
    AlertDialogActionComponent,
    AlertDialogCancelComponent,
  ],
  template: `
    <tolle-alert-dialog (openChange)="openEvents.push($event)">
      <tolle-alert-dialog-trigger>
        <button type="button">Open</button>
      </tolle-alert-dialog-trigger>
      <tolle-alert-dialog-portal>
        <tolle-alert-dialog-content size="md">
          <tolle-alert-dialog-header>
            <tolle-alert-dialog-title>Delete account</tolle-alert-dialog-title>
            <tolle-alert-dialog-description>This cannot be undone.</tolle-alert-dialog-description>
          </tolle-alert-dialog-header>
          <tolle-alert-dialog-footer>
            <tolle-alert-dialog-cancel (cancelled)="cancelled = true">
              <button type="button">Cancel</button>
            </tolle-alert-dialog-cancel>
            <tolle-alert-dialog-action (confirmed)="confirmed = true">
              <button type="button">Continue</button>
            </tolle-alert-dialog-action>
          </tolle-alert-dialog-footer>
        </tolle-alert-dialog-content>
      </tolle-alert-dialog-portal>
    </tolle-alert-dialog>
  `,
})
class HostComponent {
  openEvents: boolean[] = [];
  cancelled = false;
  confirmed = false;
}

describe('AlertDialogComponent family', () => {
  let fixture: ComponentFixture<HostComponent>;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  const trigger = () => fixture.nativeElement.querySelector('tolle-alert-dialog-trigger button') as HTMLButtonElement;
  const flush = () => TestBed.inject(ApplicationRef).tick();
  const cancelButton = () => overlayContainerElement.querySelector('tolle-alert-dialog-cancel button') as HTMLButtonElement | null;
  const actionButton = () => overlayContainerElement.querySelector('tolle-alert-dialog-action button') as HTMLButtonElement | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    overlayContainer = TestBed.inject(OverlayContainer);
    overlayContainerElement = overlayContainer.getContainerElement();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('is closed until the trigger is clicked', () => {
    expect(overlayContainerElement.textContent).not.toContain('Delete account');

    trigger().click();
    flush();

    expect(overlayContainerElement.textContent).toContain('Delete account');
    expect(fixture.componentInstance.openEvents).toEqual([true]);
  });

  it('does not close on backdrop click — alert-dialog semantics require an explicit choice', () => {
    trigger().click();
    flush();

    const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop.click();
    flush();

    expect(overlayContainerElement.textContent).toContain('Delete account');
  });

  it('emits cancelled and starts closing when Cancel is clicked', fakeAsync(() => {
    trigger().click();
    flush();

    cancelButton()!.click();
    flush();

    expect(fixture.componentInstance.cancelled).toBe(true);
    tick(300); // fallback disposal timeout
    expect(overlayContainerElement.textContent).not.toContain('Delete account');
  }));

  it('emits confirmed and starts closing when the action button is clicked', fakeAsync(() => {
    trigger().click();
    flush();

    actionButton()!.click();
    flush();

    expect(fixture.componentInstance.confirmed).toBe(true);
    tick(300);
    expect(overlayContainerElement.textContent).not.toContain('Delete account');
  }));

  it('waits for the exit animation before disposing the overlay on close', fakeAsync(() => {
    trigger().click();
    flush();
    expect(overlayContainerElement.textContent).toContain('Delete account');

    cancelButton()!.click();
    flush();
    // Still present immediately — the exit animation hasn't had a chance to play yet.
    expect(overlayContainerElement.textContent).toContain('Delete account');

    tick(300); // the fallback timeout, in case animationend never fires
    expect(overlayContainerElement.textContent).not.toContain('Delete account');
  }));
});
