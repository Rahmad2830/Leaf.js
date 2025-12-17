import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { signal, computed, defineScope, mount, unmount, effect } from '../src/index.js';

describe('Leaf.js - Reactive System', () => {
  describe('signal', () => {
    it('should create a signal with getter and setter', () => {
      const [count, setCount] = signal(0);
      
      expect(count()).toBe(0);
      
      setCount(5);
      expect(count()).toBe(5);
    });

    it('should notify subscribers when value changes', () => {
      const [count, setCount] = signal(0);
      let effectRan = 0;
      
      const cleanup = effect(() => {
        count();
        effectRan++;
      });
      
      expect(effectRan).toBe(1);
      
      setCount(1);
      expect(effectRan).toBe(2);
      
      cleanup();
    });
  });

  describe('computed', () => {
    it('should create computed value based on signals', () => {
      const [count, setCount] = signal(5);
      const doubled = computed(() => count() * 2);
      
      expect(doubled.value).toBe(10);
      
      setCount(10);
      expect(doubled.value).toBe(20);
    });

    it('should only recompute when dependencies change', () => {
      const [a, setA] = signal(1);
      const [b, setB] = signal(2);
      let computeCount = 0;
      
      const sum = computed(() => {
        computeCount++;
        return a() + b();
      });
      
      expect(sum.value).toBe(3);
      expect(computeCount).toBe(1);
      
      // Access again without changing dependencies
      expect(sum.value).toBe(3);
      expect(computeCount).toBe(1);
      
      setA(5);
      expect(sum.value).toBe(7);
      expect(computeCount).toBe(2);
    });
  });

  describe('effect', () => {
    it('should run effect function immediately', () => {
      let ran = false;
      
      effect(() => {
        ran = true;
      });
      
      expect(ran).toBe(true);
    });

    it('should cleanup effect when cleanup function is called', () => {
      const [count, setCount] = signal(0);
      let effectRan = 0;
      
      const cleanup = effect(() => {
        count();
        effectRan++;
      });
      
      expect(effectRan).toBe(1);
      
      cleanup();
      
      setCount(1);
      expect(effectRan).toBe(1); // Should not run after cleanup
    });
  });
});

describe('Leaf.js - DOM Directives', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmount(container);
      document.body.removeChild(container);
    }
  });

  describe('data-text directive', () => {
    it('should bind signal value to text content', () => {
      const [message, setMessage] = signal('Hello');
      
      defineScope('test', () => ({
        message
      }));
      
      container.innerHTML = '<div data-scope="test"><span data-text="message"></span></div>';
      mount();
      
      const span = container.querySelector('span');
      expect(span.textContent).toBe('Hello');
      
      setMessage('World');
      expect(span.textContent).toBe('World');
    });
    
    //not supported yet
    // it('should handle nested properties', () => {
    //   const [user, setUser] = signal({ name: 'John' });
      
    //   defineScope('test', () => ({
    //     user
    //   }));
      
    //   container.innerHTML = '<div data-scope="test"><span data-text="user.name"></span></div>';
    //   mount();
      
    //   const span = container.querySelector('span');
    //   expect(span.textContent).toBe('John');
    // });
  });

  describe('data-if directive', () => {
    it('should toggle element visibility based on signal', () => {
      const [visible, setVisible] = signal(true);
      
      defineScope('test', () => ({
        visible
      }));
      
      container.innerHTML = '<div data-scope="test"><div data-if="visible">Content</div></div>';
      mount();
      
      const div = container.querySelector('[data-if]');
      expect(div.style.display).toBe('');
      
      setVisible(false);
      expect(div.style.display).toBe('none');
      
      setVisible(true);
      expect(div.style.display).toBe('');
    });
  });

  describe('data-on directive', () => {
    it('should handle click events', () => {
      const mockFn = vi.fn();
      
      defineScope('test', () => ({
        handleClick: mockFn
      }));
      
      container.innerHTML = '<div data-scope="test"><button data-on="click:handleClick">Click</button></div>';
      mount();
      
      const button = container.querySelector('button');
      button.click();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle event modifiers', () => {
      const mockFn = vi.fn();
      
      defineScope('test', () => ({
        handleSubmit: mockFn
      }));
      
      container.innerHTML = `
        <div data-scope="test">
          <form data-on="submit.prevent:handleSubmit">
            <button type="submit">Submit</button>
          </form>
        </div>
      `;
      mount();
      
      const form = container.querySelector('form');
      const event = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
      
      expect(event.defaultPrevented).toBe(true);
      expect(mockFn).toHaveBeenCalled();
    });

    it('should pass parameters to event handler', () => {
      const mockFn = vi.fn();
      
      defineScope('test', () => ({
        handleClick: mockFn,
        id: () => 123
      }));
      
      container.innerHTML = '<div data-scope="test"><button data-on="click:handleClick" data-param="id">Click</button></div>';
      mount();
      
      const button = container.querySelector('button');
      button.click();
      
      expect(mockFn).toHaveBeenCalledWith(123, expect.any(Event));
    });
  });

  describe('data-model directive', () => {
    it('should create two-way binding for text input', () => {
      const [value, setValue] = signal('');
      
      defineScope('test', () => ({
        value,
        setValue
      }));
      
      container.innerHTML = '<div data-scope="test"><input data-model="value" /></div>';
      mount();
      
      const input = container.querySelector('input');
      
      setValue('Hello');
      expect(input.value).toBe('Hello');
      
      input.value = 'World';
      input.dispatchEvent(new Event('input'));
      expect(value()).toBe('World');
    });

    it('should handle checkbox binding', () => {
      const [checked, setChecked] = signal(false);
      
      defineScope('test', () => ({
        checked,
        setChecked
      }));
      
      container.innerHTML = '<div data-scope="test"><input type="checkbox" data-model="checked" /></div>';
      mount();
      
      const checkbox = container.querySelector('input');
      
      setChecked(true);
      expect(checkbox.checked).toBe(true);
      
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change'));
      expect(checked()).toBe(false);
    });

    it('should handle radio button binding', () => {
      const [selected, setSelected] = signal('option1');
      
      defineScope('test', () => ({
        selected,
        setSelected
      }));
      
      container.innerHTML = `
        <div data-scope="test">
          <input type="radio" data-model="selected" value="option1" />
          <input type="radio" data-model="selected" value="option2" />
        </div>
      `;
      mount();
      
      const radios = container.querySelectorAll('input[type="radio"]');
      
      expect(radios[0].checked).toBe(true);
      expect(radios[1].checked).toBe(false);
      
      radios[1].checked = true;
      radios[1].dispatchEvent(new Event('change'));
      expect(selected()).toBe('option2');
    });
  });
  
  //dont know why its failed
  describe('data-for directive', () => {
    it('should render list items', () => {
      const [items, setItems] = signal(['Item 1', 'Item 2', 'Item 3']);
      
      defineScope('test', () => ({
        items
      }));
      
      container.innerHTML = `
        <div data-scope="test">
          <ul data-for="items">
            <template>
              <li data-text="$item"></li>
            </template>
          </ul>
        </div>
      `;
      mount();
      
      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(3);
      expect(listItems[0].textContent).toBe('Item 1');
      expect(listItems[1].textContent).toBe('Item 2');
      expect(listItems[2].textContent).toBe('Item 3');
    });

    it('should update when array changes', () => {
      const [items, setItems] = signal(['A', 'B']);
      
      defineScope('test', () => ({
        items
      }));
      
      container.innerHTML = `
        <div data-scope="test">
          <ul data-for="items">
            <template>
              <li data-text="$item"></li>
            </template>
          </ul>
        </div>
      `;
      mount();
      
      expect(container.querySelectorAll('li')).toHaveLength(2);
      
      setItems(['A', 'B', 'C']);
      expect(container.querySelectorAll('li')).toHaveLength(3);
    });
    
    //dont know why its error
    it('should provide $index variable', () => {
      const [items] = signal(['A', 'B', 'C']);
      
      defineScope('test', () => ({
        items
      }));
      
      container.innerHTML = `
        <div data-scope="test">
          <ul data-for="items">
            <template>
              <li data-text="$index"></li>
            </template>
          </ul>
        </div>
      `;
      mount();
      
      const listItems = container.querySelectorAll('li');
      expect(listItems[0].textContent).toBe('0');
      expect(listItems[1].textContent).toBe('1');
      expect(listItems[2].textContent).toBe('2');
    });
  });

  describe('data-bind directive', () => {
    it('should bind signal to attribute', () => {
      const [disabled, setDisabled] = signal(true);
      
      defineScope('test', () => ({
        disabled
      }));
      
      container.innerHTML = '<div data-scope="test"><button data-bind="disabled:disabled">Button</button></div>';
      mount();
      
      const button = container.querySelector('button');
      expect(button.hasAttribute('disabled')).toBe(true);
      
      setDisabled(false);
      expect(button.hasAttribute('disabled')).toBe(false);
    });

    it('should handle string attribute values', () => {
      const [className, setClassName] = signal('active');
      
      defineScope('test', () => ({
        className
      }));
      
      container.innerHTML = '<div data-scope="test"><div data-bind="class:className"></div></div>';
      mount();
      
      const div = container.querySelector('[data-bind]');
      expect(div.getAttribute('class')).toBe('active');
      
      setClassName('inactive');
      expect(div.getAttribute('class')).toBe('inactive');
    });
  });

  describe('data-init directive', () => {
    it('should call init function on mount', () => {
      const mockInit = vi.fn();
      
      defineScope('test', () => ({
        init: mockInit
      }));
      
      container.innerHTML = '<div data-scope="test" data-init="init"></div>';
      mount();
      
      expect(mockInit).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Leaf.js - Lifecycle', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
    }
  });

  describe('mount/unmount', () => {
    it('should cleanup effects on unmount', () => {
      const [count, setCount] = signal(0);
      let effectRuns = 0;
      
      defineScope('test', () => ({
        count: () => {
          effectRuns++;
          return count();
        }
      }));
      
      container.innerHTML = '<div data-scope="test"><span data-text="count"></span></div>';
      mount();
      
      const initialRuns = effectRuns;
      
      setCount(1);
      expect(effectRuns).toBeGreaterThan(initialRuns);
      
      const runsBeforeUnmount = effectRuns;
      unmount(container.querySelector('[data-scope]'));
      
      setCount(2);
      expect(effectRuns).toBe(runsBeforeUnmount); // Should not increase after unmount
    });
  });
});

// Helper function to simulate effect (not exported by Leaf, so we recreate it)
function effect(fn) {
  let cleanup;
  const deps = new Set();
  
  const runner = () => {
    if (cleanup) cleanup();
    deps.forEach(dep => dep.delete(runner));
    deps.clear();
    
    const result = fn();
    
    return result;
  };
  
  runner.deps = deps;
  runner();
  
  return () => {
    deps.forEach(dep => dep.delete(runner));
    deps.clear();
  };
}