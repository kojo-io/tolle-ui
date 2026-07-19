import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectionDirective, DirectionService, type Direction } from './direction.component';

@Component({
  standalone: true,
  imports: [DirectionDirective],
  template: `
    <div [tolleDirection]="direction" [tolleDirectionPublish]="publish" (directionChange)="seen.push($event)">
      <p>Chat surface</p>
    </div>
  `
})
class DirectionHostComponent {
  direction: Direction = 'ltr';
  publish = true;
  seen: Direction[] = [];
}

describe('DirectionDirective', () => {
  let fixture: ComponentFixture<DirectionHostComponent>;
  let host: DirectionHostComponent;
  let service: DirectionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectionHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectionHostComponent);
    host = fixture.componentInstance;
    service = TestBed.inject(DirectionService);
    fixture.detectChanges();
  });

  const target = (): HTMLElement => fixture.nativeElement.querySelector('div');

  it('sets the dir attribute on its host element', () => {
    expect(target().getAttribute('dir')).toBe('ltr');
  });

  it('updates the dir attribute when the direction changes', () => {
    host.direction = 'rtl';
    fixture.detectChanges();

    expect(target().getAttribute('dir')).toBe('rtl');
  });

  it('supports the auto direction', () => {
    host.direction = 'auto';
    fixture.detectChanges();

    expect(target().getAttribute('dir')).toBe('auto');
  });

  it('leaves projected content in place', () => {
    expect(target().querySelector('p')!.textContent!.trim()).toBe('Chat surface');
  });

  it('emits directionChange for the initial value and every change', () => {
    expect(host.seen).toEqual(['ltr']);

    host.direction = 'rtl';
    fixture.detectChanges();

    expect(host.seen).toEqual(['ltr', 'rtl']);
  });

  it('publishes the direction to the service by default', () => {
    host.direction = 'rtl';
    fixture.detectChanges();

    expect(service.direction).toBe('rtl');
    expect(service.isRtl).toBe(true);
  });

  it('does not publish when publishing is turned off', () => {
    host.publish = false;
    host.direction = 'rtl';
    fixture.detectChanges();

    expect(target().getAttribute('dir')).toBe('rtl');
    expect(service.direction).toBe('ltr');
  });
});

describe('DirectionService', () => {
  let service: DirectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectionService);
  });

  it('starts left-to-right', () => {
    expect(service.direction).toBe('ltr');
    expect(service.isRtl).toBe(false);
  });

  it('replays the current direction to late subscribers', () => {
    service.setDirection('rtl');

    const seen: Direction[] = [];
    service.direction$.subscribe(d => seen.push(d));

    expect(seen).toEqual(['rtl']);
  });

  it('emits every distinct change', () => {
    const seen: Direction[] = [];
    service.direction$.subscribe(d => seen.push(d));

    service.setDirection('rtl');
    service.setDirection('auto');

    expect(seen).toEqual(['ltr', 'rtl', 'auto']);
  });

  it('does not emit when the direction is set to its current value', () => {
    service.setDirection('rtl');

    const seen: Direction[] = [];
    service.direction$.subscribe(d => seen.push(d));
    service.setDirection('rtl');

    expect(seen).toEqual(['rtl']);
  });
});
