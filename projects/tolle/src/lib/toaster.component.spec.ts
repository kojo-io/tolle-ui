import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastContainerComponent } from './toaster.component';
import { ToastService, ToastVariant } from './toast.service';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  const container = (): HTMLElement =>
    fixture.nativeElement.querySelector('div');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('moves itself to <body> so no ancestor stacking context can clamp it', () => {
    expect(fixture.nativeElement.parentElement).toBe(document.body);
  });

  it('renders above the CDK overlay container so toasts sit over modals', () => {
    // .cdk-overlay-container is z-index 100 in theme.css; toasts must beat it.
    expect(container().className).toContain('z-[10000]');
  });

  // Regression: the always-mounted container used to swallow clicks in whichever
  // screen corner it was pinned to, making buttons there silently unclickable.
  it('does not intercept pointer events while empty', () => {
    expect(container().className).toContain('pointer-events-none');
  });

  it('re-enables pointer events on each toast so close/hover still work', () => {
    toastService.show({ description: 'hello' });
    fixture.detectChanges();

    const toast = container().querySelector('[role="status"]') as HTMLElement;
    expect(toast).toBeTruthy();
    expect(toast.className).toContain('pointer-events-auto');
  });

  describe('variants', () => {
    const variants: ToastVariant[] = ['default', 'destructive', 'success', 'warning', 'info'];

    // Regression: non-default variants used bg-*/10, a 10% alpha fill, so the
    // page showed straight through a floating toast.
    it('gives every variant an opaque surface', () => {
      for (const variant of variants) {
        const classes = component.getVariantClasses(variant);
        expect(classes).not.toContain('bg-destructive/10');
        expect(classes).not.toContain('bg-success/10');
      }
    });

    it('keeps the variant tint on a separate layer above the opaque surface', () => {
      expect(component.getTintClasses('destructive')).toContain('bg-destructive/10');
      expect(component.getTintClasses('default')).toBe('');
    });

    it('supports warning and info', () => {
      expect(component.getVariantClasses('warning')).toContain('border-warning/50');
      expect(component.getVariantClasses('info')).toContain('border-info/50');
      expect(component.icons.warning).toBeTruthy();
      expect(component.icons.info).toBeTruthy();
    });

    it('falls back to default for an unknown variant', () => {
      expect(component.getVariantClasses('nope')).toBe(component.getVariantClasses('default'));
      expect(component.getProgressClasses(undefined)).toBe('bg-primary');
    });
  });
});
