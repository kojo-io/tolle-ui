import {
  Directive,
  Injectable,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  OnChanges,
  inject,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Writing direction of a subtree: explicit, or inferred from its text. */
export type Direction = 'ltr' | 'rtl' | 'auto';

/**
 * Publishes the application's current writing direction so components can adapt
 * without reading the DOM.
 *
 * Direction is not an input of most components, so an OnPush view would never be
 * marked dirty by a change. Subscribe to `direction$` and call `markForCheck()`
 * on emission wherever the rendered output depends on it.
 */
@Injectable({ providedIn: 'root' })
export class DirectionService {
  private directionSource = new BehaviorSubject<Direction>('ltr');

  /** Emits the current writing direction, starting with the present value. */
  readonly direction$ = this.directionSource.asObservable();

  /** The current writing direction. */
  get direction(): Direction {
    return this.directionSource.value;
  }

  /** Whether the current direction is explicitly right-to-left. */
  get isRtl(): boolean {
    return this.directionSource.value === 'rtl';
  }

  /** Sets the current direction, emitting only when it actually changes. */
  setDirection(direction: Direction): void {
    if (this.directionSource.value !== direction) this.directionSource.next(direction);
  }
}

/**
 * Sets the `dir` attribute on its host and publishes that direction to
 * `DirectionService`, so a whole chat surface can be flipped to RTL from one
 * place. Put it on the outermost element of the subtree you want to flip.
 * @new
 */
@Directive({
  selector: '[tolleDirection]',
  standalone: true,
})
export class DirectionDirective implements OnChanges {
  /** Writing direction applied to the host's `dir` attribute. @default 'ltr' */
  @Input() tolleDirection: Direction = 'ltr';
  /** Whether to publish this direction to the app-wide `DirectionService`. @default true */
  @Input() tolleDirectionPublish = true;

  /** Emitted with the direction whenever it changes. */
  @Output() directionChange = new EventEmitter<Direction>();

  private readonly service = inject(DirectionService);

  /** The resolved `dir` attribute value written onto the host. */
  @HostBinding('attr.dir')
  get dir(): Direction {
    return this.tolleDirection ?? 'ltr';
  }

  ngOnChanges(): void {
    const direction = this.dir;
    if (this.tolleDirectionPublish) this.service.setDirection(direction);
    this.directionChange.emit(direction);
  }
}
