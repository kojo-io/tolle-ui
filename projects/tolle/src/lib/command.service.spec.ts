import { CommandService } from './command.service';

describe('CommandService', () => {
  let service: CommandService;

  /** Registers an item with sensible defaults so tests stay readable. */
  const add = (id: string, searchText: string, extra: Partial<{ value: any; disabled: boolean }> = {}) =>
    service.register({
      id,
      searchText,
      value: extra.value ?? id,
      disabled: extra.disabled ?? false,
    });

  beforeEach(() => {
    service = new CommandService();
  });

  it('keeps every item visible when the query is empty', () => {
    add('a', 'Profile');
    add('b', 'Settings');

    expect(service.visibleIds).toEqual(['a', 'b']);
  });

  it('filters case-insensitively on the item search text', () => {
    add('a', 'Profile');
    add('b', 'Settings');

    service.setQuery('SET');

    expect(service.visibleIds).toEqual(['b']);
  });

  it('matches on keywords folded into search text', () => {
    add('a', 'Profile account user');

    service.setQuery('account');

    expect(service.visibleIds).toEqual(['a']);
  });

  it('preserves registration order rather than match order', () => {
    add('a', 'alpha item');
    add('b', 'beta item');
    add('c', 'gamma item');

    service.setQuery('item');

    expect(service.visibleIds).toEqual(['a', 'b', 'c']);
  });

  it('leaves everything visible when shouldFilter is false', () => {
    service.shouldFilter = false;
    add('a', 'Profile');
    add('b', 'Settings');

    service.setQuery('zzzz');

    expect(service.visibleIds).toEqual(['a', 'b']);
  });

  it('reports empty only once items exist and none match', () => {
    expect(service.isEmpty).toBe(false); // nothing registered yet

    add('a', 'Profile');
    service.setQuery('zzzz');

    expect(service.isEmpty).toBe(true);
  });

  describe('isEmpty with manual filtering', () => {
    beforeEach(() => {
      service.shouldFilter = false;
    });

    it('is empty when the consumer renders no items', () => {
      // With shouldFilter=false the consumer filters and renders the results
      // itself, so zero registered items IS the empty result set.
      expect(service.isEmpty).toBe(true);
    });

    it('is not empty once the consumer renders results', () => {
      add('a', 'Profile');

      expect(service.isEmpty).toBe(false);
    });

    it('becomes empty again when the consumer removes every item', () => {
      add('a', 'Profile');
      expect(service.isEmpty).toBe(false);

      service.unregister('a');

      expect(service.isEmpty).toBe(true);
    });

    it('stays non-empty for a query that matches nothing, since it does not filter', () => {
      add('a', 'Profile');

      service.setQuery('zzzz');

      expect(service.visibleIds).toEqual(['a']);
      expect(service.isEmpty).toBe(false);
    });
  });

  describe('active item', () => {
    it('activates the first item on registration', () => {
      add('a', 'Profile');
      add('b', 'Settings');

      expect(service.activeId).toBe('a');
    });

    it('skips a disabled first item when choosing the default', () => {
      add('a', 'Profile', { disabled: true });
      add('b', 'Settings');

      expect(service.activeId).toBe('b');
    });

    it('wraps forward past the end', () => {
      add('a', 'one');
      add('b', 'two');

      service.move(1); // a -> b
      service.move(1); // b -> wraps to a

      expect(service.activeId).toBe('a');
    });

    it('wraps backward to the last item', () => {
      add('a', 'one');
      add('b', 'two');
      add('c', 'three');

      service.move(-1); // from 'a', wraps to 'c'

      expect(service.activeId).toBe('c');
    });

    it('moves the highlight when filtering excludes the active item', () => {
      add('a', 'Profile');
      add('b', 'Settings');
      expect(service.activeId).toBe('a');

      service.setQuery('Settings');

      expect(service.activeId).toBe('b');
    });

    it('clears the highlight when nothing matches', () => {
      add('a', 'Profile');

      service.setQuery('zzzz');

      expect(service.activeId).toBeNull();
    });

    it('ignores setActive for a filtered-out item', () => {
      add('a', 'Profile');
      add('b', 'Settings');
      service.setQuery('Profile');

      service.setActive('b');

      expect(service.activeId).toBe('a');
    });
  });

  describe('selection', () => {
    it('emits the active item value on selectActive', () => {
      add('a', 'Profile', { value: { id: 1 } });
      const spy = jasmine.createSpy('selected');
      service.selected$.subscribe(spy);

      service.selectActive();

      expect(spy).toHaveBeenCalledWith({ id: 1 });
    });

    it('does not emit for a disabled item', () => {
      add('a', 'Profile', { disabled: true });
      const spy = jasmine.createSpy('selected');
      service.selected$.subscribe(spy);

      service.selectById('a');

      expect(spy).not.toHaveBeenCalled();
    });

    it('does not emit when nothing is active', () => {
      const spy = jasmine.createSpy('selected');
      service.selected$.subscribe(spy);

      service.selectActive();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('recomputes visibility after an item unregisters', () => {
    add('a', 'Profile');
    add('b', 'Settings');

    service.unregister('a');

    expect(service.visibleIds).toEqual(['b']);
    expect(service.activeId).toBe('b');
  });

  it('re-filters when an item updates its search text', () => {
    add('a', 'Profile');
    service.setQuery('billing');
    expect(service.visibleIds).toEqual([]);

    service.update('a', { searchText: 'Billing settings' });

    expect(service.visibleIds).toEqual(['a']);
  });
});
