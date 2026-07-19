import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

/** One registered `tolle-command-item`, as seen by the service. */
export interface CommandItemState {
  id: string;
  /** Text the query is matched against — the item's label plus any `keywords`. */
  searchText: string;
  value: any;
  disabled: boolean;
  /** Registration order, used to keep the visible list in DOM order. */
  order: number;
}

/**
 * Coordinates a `tolle-command` and its descendants: owns the query, decides
 * which items survive filtering, and tracks the active (highlighted) item for
 * `aria-activedescendant`.
 *
 * Provided on `CommandComponent`, so each command menu gets its own instance.
 */
@Injectable()
export class CommandService {
  private readonly items = new Map<string, CommandItemState>();
  private nextOrder = 0;

  private readonly querySubject = new BehaviorSubject<string>('');
  /** Current search query. */
  readonly query$ = this.querySubject.asObservable();

  private readonly visibleSubject = new BehaviorSubject<string[]>([]);
  /** Ids of the items surviving the current query, in DOM order. */
  readonly visible$ = this.visibleSubject.asObservable();

  private readonly activeIdSubject = new BehaviorSubject<string | null>(null);
  /** Id of the highlighted item, or null when nothing matches. */
  readonly activeId$ = this.activeIdSubject.asObservable();

  private readonly selectedSubject = new Subject<any>();
  /** Emits the value of the item the user chose. */
  readonly selected$ = this.selectedSubject.asObservable();

  /**
   * When set, filtering is left entirely to the consumer — every registered
   * item stays visible regardless of the query. Use for server-side search.
   */
  shouldFilter = true;

  get query(): string {
    return this.querySubject.value;
  }

  get visibleIds(): string[] {
    return this.visibleSubject.value;
  }

  get activeId(): string | null {
    return this.activeIdSubject.value;
  }

  /**
   * True when there is nothing to show.
   *
   * With built-in filtering that means items exist but the query excluded them
   * all. With `shouldFilter = false` the consumer renders the result set itself,
   * so "no items registered" IS the empty result — requiring items to exist
   * would make `tolle-command-empty` permanently invisible in that mode.
   */
  get isEmpty(): boolean {
    if (!this.shouldFilter) return this.items.size === 0;
    return this.items.size > 0 && this.visibleSubject.value.length === 0;
  }

  register(item: Omit<CommandItemState, 'order'>): void {
    this.items.set(item.id, { ...item, order: this.nextOrder++ });
    this.recompute();
  }

  /** Keeps the stored search text/value in sync when an item's inputs change. */
  update(id: string, patch: Partial<Omit<CommandItemState, 'id' | 'order'>>): void {
    const existing = this.items.get(id);
    if (!existing) return;
    this.items.set(id, { ...existing, ...patch });
    this.recompute();
  }

  unregister(id: string): void {
    this.items.delete(id);
    this.recompute();
  }

  setQuery(query: string): void {
    this.querySubject.next(query);
    this.recompute();
  }

  isVisible(id: string): boolean {
    return this.visibleSubject.value.includes(id);
  }

  /** Moves the highlight by `delta` positions, wrapping at both ends. */
  move(delta: number): void {
    const ids = this.visibleSubject.value;
    if (!ids.length) return;
    const current = ids.indexOf(this.activeIdSubject.value ?? '');
    // From "nothing active", ArrowUp should land on the last item, not the second.
    const start = current < 0 ? (delta > 0 ? -1 : 0) : current;
    const next = (start + delta + ids.length) % ids.length;
    this.activeIdSubject.next(ids[next]);
  }

  setActive(id: string | null): void {
    if (id !== null && !this.isVisible(id)) return;
    this.activeIdSubject.next(id);
  }

  /** Selects the highlighted item, if there is one. */
  selectActive(): void {
    const id = this.activeIdSubject.value;
    if (!id) return;
    const item = this.items.get(id);
    if (!item || item.disabled) return;
    this.selectedSubject.next(item.value);
  }

  selectById(id: string): void {
    const item = this.items.get(id);
    if (!item || item.disabled) return;
    this.selectedSubject.next(item.value);
  }

  /** Recomputes the visible set and keeps the highlight on something valid. */
  private recompute(): void {
    const q = this.querySubject.value.trim().toLowerCase();

    const visible = [...this.items.values()]
      .filter((item) => !this.shouldFilter || !q || item.searchText.toLowerCase().includes(q))
      .sort((a, b) => a.order - b.order)
      .map((item) => item.id);

    this.visibleSubject.next(visible);

    // If the highlight fell out of the visible set (or there was none), move it
    // to the first selectable item so Enter always has a sensible target.
    const active = this.activeIdSubject.value;
    if (!active || !visible.includes(active)) {
      const firstEnabled = visible.find((id) => !this.items.get(id)?.disabled) ?? null;
      this.activeIdSubject.next(firstEnabled);
    }
  }
}
