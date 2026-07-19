import { MessageScrollerService } from './message-scroller.service';

describe('MessageScrollerService', () => {
  let service: MessageScrollerService;
  let viewport: HTMLElement;

  /**
   * A stand-in for the scroll viewport. jsdom/Karma won't lay elements out, so
   * the geometry properties are defined directly — this is the contract the
   * service actually reads.
   */
  const makeViewport = (scrollHeight: number, clientHeight: number, scrollTop = 0) => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', { value: scrollHeight, writable: true });
    Object.defineProperty(el, 'clientHeight', { value: clientHeight, writable: true });
    Object.defineProperty(el, 'offsetTop', { value: 0, writable: true });
    // scrollTop must be redefined as a plain data property: the native accessor
    // clamps writes to 0 on a detached, non-scrollable element, so assignments
    // would silently do nothing.
    Object.defineProperty(el, 'scrollTop', { value: scrollTop, writable: true });
    el.scrollTo = ((opts: any) => {
      el.scrollTop = typeof opts === 'number' ? opts : opts.top;
    }) as any;
    return el;
  };

  beforeEach(() => {
    service = new MessageScrollerService();
    viewport = makeViewport(1000, 400, 600); // exactly at the bottom
    service.registerViewport(viewport);
  });

  describe('measuring the live edge', () => {
    it('starts at the bottom', () => {
      service.measure();
      expect(service.atBottom).toBe(true);
      expect(service.isFollowing).toBe(true);
    });

    it('treats being within the threshold as the live edge', () => {
      viewport.scrollTop = 580; // 20px from bottom, threshold is 32
      service.measure();

      expect(service.atBottom).toBe(true);
    });

    it('leaves the live edge past the threshold', () => {
      viewport.scrollTop = 400; // 200px from bottom
      service.measure();

      expect(service.atBottom).toBe(false);
    });

    it('stops following the moment the reader scrolls up', () => {
      expect(service.isFollowing).toBe(true);

      viewport.scrollTop = 100;
      service.measure();

      expect(service.isFollowing).toBe(false);
    });

    it('resumes following when the reader returns to the bottom', () => {
      viewport.scrollTop = 100;
      service.measure();
      expect(service.isFollowing).toBe(false);

      viewport.scrollTop = 600;
      service.measure();

      expect(service.isFollowing).toBe(true);
    });

    it('emits atBottom only when the value actually changes', () => {
      const seen: boolean[] = [];
      service.atBottom$.subscribe((v) => seen.push(v));

      service.measure(); // still at bottom
      service.measure();
      service.measure();

      // One replayed initial value, no duplicates for unchanged state.
      expect(seen).toEqual([true]);
    });
  });

  describe('content growth', () => {
    it('follows new content while at the live edge', () => {
      service.measure();
      (viewport as any).scrollHeight = 1400;

      service.handleContentGrowth();

      expect(viewport.scrollTop).toBe(1400);
    });

    it('does NOT move the reader who has scrolled up', () => {
      viewport.scrollTop = 100;
      service.measure();
      expect(service.isFollowing).toBe(false);

      (viewport as any).scrollHeight = 1400;
      service.handleContentGrowth();

      // The whole point: streamed content must not yank the view.
      expect(viewport.scrollTop).toBe(100);
    });

    it('re-measures while not following so the jump button stays correct', () => {
      // Max scrollTop here is scrollHeight - clientHeight = 600.
      viewport.scrollTop = 300; // 300px from the bottom
      service.measure();
      expect(service.atBottom).toBe(false);

      // Content shrinks (e.g. a streamed block collapsed), bringing the reader
      // back within the threshold without them moving at all.
      (viewport as any).scrollHeight = 720; // distance now 720 - 300 - 400 = 20
      service.handleContentGrowth();

      expect(service.atBottom).toBe(true);
    });
  });

  describe('prepended history', () => {
    it('restores the reader position by the height that was added above', () => {
      viewport.scrollTop = 300;
      const before = service.snapshotScrollHeight();

      (viewport as any).scrollHeight = 1500; // 500px of history added above
      service.preserveOnPrepend(before);

      // Without this the transcript would visibly lurch downward.
      expect(viewport.scrollTop).toBe(800);
    });

    it('does nothing when the content did not grow', () => {
      viewport.scrollTop = 300;

      service.preserveOnPrepend(1000);

      expect(viewport.scrollTop).toBe(300);
    });
  });

  describe('start position', () => {
    it('opens at the top when asked', () => {
      service.applyStartPosition('top', 0);
      expect(viewport.scrollTop).toBe(0);
    });

    it('opens at the bottom when asked', () => {
      viewport.scrollTop = 0;
      service.applyStartPosition('bottom', 0);
      expect(viewport.scrollTop).toBe(1000);
    });

    it('opens at the last anchor, leaving the peek visible above it', () => {
      const anchor = document.createElement('div');
      Object.defineProperty(anchor, 'offsetTop', { value: 700 });
      service.registerAnchor(anchor);

      service.applyStartPosition('last-anchor', 48);

      // Newest turn near the top of the viewport, previous turn peeking above.
      expect(viewport.scrollTop).toBe(652);
    });

    it('never scrolls above zero when the anchor is near the top', () => {
      const anchor = document.createElement('div');
      Object.defineProperty(anchor, 'offsetTop', { value: 10 });
      service.registerAnchor(anchor);

      service.applyStartPosition('last-anchor', 48);

      expect(viewport.scrollTop).toBe(0);
    });

    it('falls back to the bottom when no turns are marked', () => {
      viewport.scrollTop = 0;
      service.applyStartPosition('last-anchor', 48);

      expect(viewport.scrollTop).toBe(1000);
    });
  });

  describe('anchors', () => {
    it('ignores duplicate registrations', () => {
      const anchor = document.createElement('div');
      Object.defineProperty(anchor, 'offsetTop', { value: 500 });

      service.registerAnchor(anchor);
      service.registerAnchor(anchor);
      service.unregisterAnchor(anchor);

      // A single unregister must fully remove it, or a destroyed row would
      // keep being treated as a valid scroll target.
      viewport.scrollTop = 0;
      service.applyStartPosition('last-anchor', 0);
      expect(viewport.scrollTop).toBe(1000); // fell back to bottom
    });
  });

  it('scrollToBottom resumes following', () => {
    viewport.scrollTop = 0;
    service.measure();
    expect(service.isFollowing).toBe(false);

    service.scrollToBottom('auto');

    expect(viewport.scrollTop).toBe(1000);
    expect(service.isFollowing).toBe(true);
    expect(service.atBottom).toBe(true);
  });

  it('is inert with no viewport registered', () => {
    const bare = new MessageScrollerService();

    expect(() => {
      bare.measure();
      bare.handleContentGrowth();
      bare.scrollToBottom();
      bare.applyStartPosition('last-anchor', 48);
      bare.preserveOnPrepend(100);
    }).not.toThrow();
  });
});
