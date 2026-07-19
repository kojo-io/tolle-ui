import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Where a freshly-mounted scroller should start. */
export type ScrollStartPosition = 'top' | 'bottom' | 'last-anchor';

/**
 * Scroll state for one `tolle-message-scroller`, shared with its viewport,
 * items and buttons.
 *
 * The governing rule is: **never move the reader against their intent.** Every
 * automatic scroll here is gated on the reader already being at the live edge.
 * The moment they scroll up, auto-scroll switches off and stays off until they
 * come back down or explicitly jump.
 *
 * Positions are read from and written to the DOM directly rather than mirrored
 * into component state — scroll events fire far too often to run change
 * detection on, and the values would be stale by the time they landed.
 */
@Injectable()
export class MessageScrollerService {
  /** The scrollable element, set by the viewport once it renders. */
  private viewport: HTMLElement | null = null;

  /** Rows registered as the start of a conversation turn, in DOM order. */
  private anchors: HTMLElement[] = [];

  private readonly atBottomSubject = new BehaviorSubject<boolean>(true);
  /** True while the reader is at (or within `threshold` of) the live edge. */
  readonly atBottom$ = this.atBottomSubject.asObservable();

  private readonly followingSubject = new BehaviorSubject<boolean>(true);
  /**
   * True while new content should pull the view along. Set false the instant
   * the reader scrolls away from the bottom.
   */
  readonly following$ = this.followingSubject.asObservable();

  /** Distance from the bottom, in px, still considered "at the live edge". */
  threshold = 32;

  get atBottom(): boolean {
    return this.atBottomSubject.value;
  }

  get isFollowing(): boolean {
    return this.followingSubject.value;
  }

  registerViewport(el: HTMLElement): void {
    this.viewport = el;
  }

  registerAnchor(el: HTMLElement): void {
    if (!this.anchors.includes(el)) this.anchors.push(el);
  }

  unregisterAnchor(el: HTMLElement): void {
    const i = this.anchors.indexOf(el);
    if (i > -1) this.anchors.splice(i, 1);
  }

  /**
   * Recomputes whether we're at the live edge. Called from the viewport's
   * scroll handler, which runs outside Angular — this only pushes through the
   * subjects when the boolean actually flips, so we re-enter change detection
   * once per state change instead of once per scroll event.
   */
  measure(): void {
    const el = this.viewport;
    if (!el) return;

    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distance <= this.threshold;

    if (atBottom !== this.atBottomSubject.value) this.atBottomSubject.next(atBottom);

    // Leaving the bottom stops following; returning resumes it. This is the
    // whole "don't fight the reader" contract in two lines.
    if (atBottom !== this.followingSubject.value) this.followingSubject.next(atBottom);
  }

  /** Jumps to the live edge and resumes following. */
  scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    const el = this.viewport;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    if (!this.followingSubject.value) this.followingSubject.next(true);
    if (!this.atBottomSubject.value) this.atBottomSubject.next(true);
  }

  /** Scrolls a specific row into view, e.g. jump-to-message from a search result. */
  scrollToItem(el: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
    el.scrollIntoView({ behavior, block: 'start' });
  }

  /**
   * Positions the transcript on open. `last-anchor` puts the newest turn at the
   * top of the viewport instead of dumping the reader at the absolute end, so a
   * long streamed answer starts from its beginning — with `peek` px of the
   * previous turn left visible for context.
   */
  applyStartPosition(position: ScrollStartPosition, peek: number): void {
    const el = this.viewport;
    if (!el) return;

    if (position === 'top') {
      el.scrollTop = 0;
      this.measure();
      return;
    }

    if (position === 'last-anchor') {
      const anchor = this.lastAnchorInDomOrder();
      if (anchor) {
        el.scrollTop = Math.max(0, anchor.offsetTop - el.offsetTop - peek);
        this.measure();
        return;
      }
      // No turns marked — fall through to the bottom.
    }

    el.scrollTop = el.scrollHeight;
    this.measure();
  }

  /**
   * Content grew. Follows only if the reader was already at the edge; uses
   * 'auto' so streamed tokens don't queue a smooth animation per chunk.
   */
  handleContentGrowth(): void {
    if (!this.followingSubject.value) {
      // Not following, but the scrollbar just changed size — re-measure so the
      // jump button's visibility stays honest.
      this.measure();
      return;
    }
    const el = this.viewport;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  /**
   * History was prepended above the current view. Restores the reader's exact
   * position by re-adding the height the new content introduced — otherwise the
   * transcript visibly lurches downward as older messages load in.
   */
  preserveOnPrepend(previousScrollHeight: number): void {
    const el = this.viewport;
    if (!el) return;
    const delta = el.scrollHeight - previousScrollHeight;
    if (delta > 0) el.scrollTop += delta;
  }

  /** Current scrollHeight, captured before a prepend so it can be compared after. */
  snapshotScrollHeight(): number {
    return this.viewport?.scrollHeight ?? 0;
  }

  /** The last registered anchor in document order (registration order can vary). */
  private lastAnchorInDomOrder(): HTMLElement | undefined {
    if (!this.anchors.length) return undefined;
    return [...this.anchors].sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    )[this.anchors.length - 1];
  }
}
