// leaf.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// --- INI ADALAH KODE LIBRARY ANDA (Disesuaikan sedikit agar bisa di-export) ---
const Leaf = (function(E){"use strict";let S=[];function x(t){t.deps&&(t.deps.forEach(e=>{e.delete(t)}),t.deps.clear())}function m(t){const e=()=>{x(e),S.push(e),t(),S.pop()};return e.deps=new Set,e(),()=>x(e)}function O(t){let e=t;const n=new Set;return[()=>{const r=S[S.length-1];return r&&(n.add(r),r.deps.add(n)),e},r=>{if(Object.is(e,r))return;e=r,new Set(n).forEach(i=>i())}]}const B={},k={};function P(t,e){B[t]=e({$stores:k})}function j(t,e){return k[t]||(k[t]=e()),k[t]}function M(t,e,n){const s=[];return n.forEach(o=>{const r=o(t,e,M,n);typeof r=="function"&&s.push(r)}),Array.from(t.children).forEach(o=>{const r=M(o,e,n);r&&s.push(r)}),()=>s.forEach(o=>o())}function u(t,e){const n=e.split(".");let s=t;for(const o of n)if(s=s[o],s===void 0)return;return s}function q(t){return t.charAt(0).toUpperCase()+t.slice(1)}function R(t,e){function n(o){if(o==="true")return!0;if(o==="false")return!1;if(o==="null")return null;if(o!=="undefined")return!isNaN(o)&&o.trim()!==""?Number(o):o}return t.map(o=>{const r=u(e,o);return r!==void 0?typeof r=="function"?r():r:n(o)})}function W(t=[],e){t.includes("prevent")&&e.preventDefault(),t.includes("stop")&&e.stopPropagation()}function Y(t,e){const n=t.dataset.text;return n?m(()=>{const o=u(e,n);t.textContent=typeof o=="function"?o():o}):void 0}const A=new WeakMap;function C(t,e){let n=A.get(t);if(!n)return;const s=n[e];s&&(t.removeEventListener(e,s),delete n[e],Object.keys(n).length===0&&A.delete(t))}function N(t,e,n){let s=A.get(t);s||(s={},A.set(t,s)),C(t,e),t.addEventListener(e,n),s[e]=n}function z(t,e){const n=t.dataset.on;if(!n)return;const[s,o]=n.split(":").map(d=>d.trim()),r=s.split("."),a=r[0],i=r.slice(1),l=t.dataset.param?t.dataset.param.split(",").map(d=>d.trim()):[];return N(t,a,d=>{if(W(i,d),!o)return;const b=u(e,o);if(typeof b=="function"){const w=R(l,e);b(...w,d)}else console.error(`[Listener] ${o} must be a function`)}),()=>C(t,a)}function K(t,e){const n=t.dataset.if;if(!n)return;const s=t.parentNode,o=document.createComment("if");s.insertBefore(o,t),s.removeChild(t);const r=m(()=>{const a=u(e,n);(typeof a=="function"?a():a)?t.isConnected||s.insertBefore(t,o):t.isConnected&&s.removeChild(t)});return()=>{r(),o.isConnected&&o.remove()}}function U(t,e,n,s){const o=new Map,r=[];let a=!1;const i=t.querySelector("template");if(!i)return;const l=t.dataset.for;if(!l)return;const y=t.parentNode,d=document.createComment("for");return y.insertBefore(d,t),y.removeChild(t),m(()=>{const w=u(e,l);w||console.error(`[data-for] ${l} is not found`);const V=typeof w=="function"?w():[],I=t.dataset.key;if(I){r.length&&(r.forEach(f=>{f.el.remove(),f.cleanup&&f.cleanup()}),r.length=0);const c=new Set;let p=d;V.forEach((f,v)=>{const g={$item:f,$index:v,...e},h=u(g,I);if(h==null){console.warn(`Invalid key: ${h}`);return}c.has(h)&&console.warn(`Duplicate key detected: ${h}. Rendering behavior may be unpredictable.`),c.add(h);const $=o.get(h);if($)$.scope.$item=f,$.scope.$index=v,y.insertBefore($.el,p.nextSibling),p=$.el;else{const L=i.content.cloneNode(!0).firstElementChild,et=n(L,g,s);o.set(h,{el:L,scope:g,cleanup:et}),y.insertBefore(L,p.nextSibling),p=L}}),o.forEach((f,v)=>{c.has(v)||(f.el.remove(),f.cleanup&&f.cleanup(),o.delete(v))})}else for(o.size&&(o.forEach(c=>{c.el.remove(),c.cleanup&&c.cleanup()}),o.clear()),a||console.warn(`[data-for="${l}"] does not have a data-key. Reuse DOM may be suboptimal.`),a=!0,V.forEach((c,p)=>{const f={$item:c,$index:p,...e};if(r[p])r[p].scope.$item=c,r[p].scope.$index=p;else{const g=i.content.cloneNode(!0).firstElementChild,h=n(g,f,s);r[p]={el:g,scope:f,cleanup:h},y.insertBefore(g,d.nextSibling)}});r.length>V.length;){const c=r.pop();c.el.remove(),c.cleanup&&c.cleanup()}})}function G(t,e){if(t.type==="checkbox"){Array.isArray(e)?t.checked=e.includes(t.value):t.checked=!!e;return}if(t.type==="radio"){t.checked=e===t.value;return}t.value=e??""}function X(t,e){return t.type==="checkbox"?Array.isArray(e())?t.checked?[...e(),t.value]:e().filter(n=>n!==t.value):t.checked:t.type==="radio"?t.checked?t.value:e():t.value}function F(t,e){const n=t.dataset.model;if(!n)return;const s=u(e,n),o=u(e,"set"+q(n));if(typeof s!="function"||typeof o!="function")throw new Error(`[model] "${n}" requires signal "${n}()" and setter "set${q(n)}()"`);const r=m(()=>{G(t,s())}),a=l=>{o(X(t,s))},i=t.tagName==="TEXTAREA"||t.tagName==="INPUT"&&!["checkbox","radio"].includes(t.type);return N(t,i?"input":"change",a),()=>{r(),C(t,i?"input":"change")}}function H(t,e){const n=t.dataset.init;if(!n)return;const s=u(e,n);if(typeof s=="function")s();else throw new Error(`[init] ${n} must be a function`)}function J(t,e){const n=t.dataset.bind;if(!n||!n.includes(":"))return;const[s,o]=n.split(":").map(i=>i.trim()),r=u(e,o);if(typeof r!="function")throw new Error(`[bind] ${o} is not a signal`);return m(()=>{const i=r();i==null?t.removeAttribute(s):i===!0?t.setAttribute(s,""):i===!1?t.removeAttribute(s):t.setAttribute(s,i)})}function Q(t,e){t.hasAttribute("data-init-hide")&&(t.removeAttribute("data-init-hide"),t.style.display="none");const n=t.dataset.show;if(!n)return;const s=u(e,n);if(typeof s!="function")throw new Error(`[show] ${n} must be a function`);const o=t.hasAttribute("data-animate"),r=t.dataset.animate||"opacity 0.5s ease, transform 0.5s ease";let a=!1;const i=()=>{s()||(t.style.display="none",a=!1)};o&&(t.style.transition=r,N(t,"transitionend",i));const l=m(()=>{if(!o){t.style.display=s()?"":"none";return}s()?(t.style.display="",t.style.opacity="0",t.style.transform="translateY(-10px)",requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="translateY(0)"})):a||(a=!0,t.style.opacity="0",t.style.transform="translateY(-10px)",t.style.transition=r)});return()=>{l(),o&&C(t,"transitionend")}}function Z(t,e){const n=[],s=t.dataset.class;return s?(s.split(",").forEach(r=>{if(!r.trim())return;const[a,...i]=r.split(":");if(a){if(i.length===0)throw new Error("[class] a class is required for adding class")}else throw new Error("[class] a function is required for adding class");const y=i.join(":").trim().replace(/^['"]|['"]$/g,""),d=m(()=>{const b=u(e,a.trim());if(typeof b=="function")y.split(/\s+/).forEach(w=>{w&&t.classList.toggle(w,b())});else throw new Error(`[class] ${a} must be a function`)});n.push(d)}),()=>n.forEach(r=>r())):void 0}const _=[Y,z,K,U,F,H,J,Q,Z],D=new WeakMap;function T(){document.querySelectorAll("[data-scope]").forEach(t=>{const e=B[t.dataset.scope];if(!e)throw new Error(`Scope ${t.dataset.scope} is not defined`);const n=D.get(t);n&&n.forEach(r=>r());const s=[],o=M(t,e,_);typeof o=="function"&&s.push(o),D.set(t,s)})}function tt(t){const e=D.get(t);e&&(e.forEach(n=>n()),D.delete(t))}return typeof document<"u"&&document.addEventListener("DOMContentLoaded",T),E.defineScope=P,E.defineStore=j,E.effect=m,E.mount=T,E.signal=O,E.unmount=tt,E})({});
// --- AKHIR KODE LIBRARY ---

describe('Leaf Library Tests', () => {
    
    // Cleanup DOM setelah setiap test
    afterEach(() => {
        document.body.innerHTML = '';
        Leaf.unmount(document.body); // Bersihkan event listeners jika ada
    });

    // --- 1. Reactivity Core Tests ---
    describe('Reactivity System', () => {
        it('should update signal value', () => {
            const [count, setCount] = Leaf.signal(0);
            expect(count()).toBe(0);
            setCount(5);
            expect(count()).toBe(5);
        });

        it('should trigger effect when signal changes', () => {
            const [count, setCount] = Leaf.signal(0);
            let dummy;
            
            Leaf.effect(() => {
                dummy = count();
            });

            expect(dummy).toBe(0);
            setCount(10);
            expect(dummy).toBe(10);
        });
    });

    // --- 2. Rendering & Scopes ---
    describe('Scope & Rendering', () => {
        it('should render data-text', () => {
            document.body.innerHTML = `
                <div data-scope="counter">
                    <span id="txt" data-text="count"></span>
                </div>
            `;

            Leaf.defineScope('counter', () => {
                const [count] = Leaf.signal(100);
                return { count };
            });

            Leaf.mount();
            
            const span = document.getElementById('txt');
            expect(span.textContent).toBe('100');
        });

        it('should update data-text reactively', () => {
            let externalSetCount;

            document.body.innerHTML = `
                <div data-scope="reactive">
                    <span id="txt" data-text="count"></span>
                </div>
            `;

            Leaf.defineScope('reactive', () => {
                const [count, setCount] = Leaf.signal('A');
                externalSetCount = setCount;
                return { count };
            });

            Leaf.mount();
            const span = document.getElementById('txt');
            
            expect(span.textContent).toBe('A');
            externalSetCount('B');
            expect(span.textContent).toBe('B');
        });
    });

    // --- 3. Events (data-on) ---
    describe('Event Handling (data-on)', () => {
        it('should handle click events', () => {
            document.body.innerHTML = `
                <div data-scope="clicker">
                    <button id="btn" data-on="click: increment"></button>
                    <span id="val" data-text="count"></span>
                </div>
            `;

            Leaf.defineScope('clicker', () => {
                const [count, setCount] = Leaf.signal(0);
                const increment = () => setCount(count() + 1);
                return { count, increment };
            });

            Leaf.mount();
            
            const btn = document.getElementById('btn');
            const val = document.getElementById('val');
            
            expect(val.textContent).toBe('0');
            btn.click();
            expect(val.textContent).toBe('1');
        });

        it('should handle event modifiers (prevent)', () => {
            document.body.innerHTML = `
                <div data-scope="form">
                    <form id="frm" data-on="submit.prevent: submitHandler">
                        <button type="submit">Submit</button>
                    </form>
                </div>
            `;

            const handlerSpy = vi.fn();

            Leaf.defineScope('form', () => {
                return { submitHandler: handlerSpy };
            });

            Leaf.mount();
            
            const form = document.getElementById('frm');
            const event = new Event('submit', { bubbles: true, cancelable: true });
            // Spy on preventDefault
            event.preventDefault = vi.fn(); 

            form.dispatchEvent(event);

            expect(handlerSpy).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    // --- 4. Conditionals (data-if) ---
    describe('Conditionals (data-if)', () => {
        it('should add/remove elements from DOM', () => {
            document.body.innerHTML = `
                <div data-scope="logic">
                    <div id="target" data-if="isVisible">Hello</div>
                </div>
            `;

            let toggle;

            Leaf.defineScope('logic', () => {
                const [isVisible, setIsVisible] = Leaf.signal(true);
                toggle = setIsVisible;
                return { isVisible };
            });

            Leaf.mount();
            expect(document.getElementById('target')).not.toBeNull();

            toggle(false);
            expect(document.getElementById('target')).toBeNull(); // Harus hilang dari DOM

            toggle(true);
            expect(document.getElementById('target')).not.toBeNull();
        });
    });

    // --- 5. Two-Way Binding (data-model) ---
    describe('Two-Way Binding (data-model)', () => {
        it('should sync input value with signal', () => {
            document.body.innerHTML = `
                <div data-scope="model-test">
                    <input id="inp" data-model="username" />
                    <span id="out" data-text="username"></span>
                </div>
            `;

            Leaf.defineScope('model-test', () => {
                // Perhatikan: Library mengharapkan convention "set" + CapitalizedName
                const [username, setUsername] = Leaf.signal('Alice');
                return { username, setUsername };
            });

            Leaf.mount();
            const input = document.getElementById('inp');
            const output = document.getElementById('out');

            // Initial state
            expect(input.value).toBe('Alice');
            expect(output.textContent).toBe('Alice');

            // DOM -> Signal
            input.value = 'Bob';
            input.dispatchEvent(new Event('input'));
            expect(output.textContent).toBe('Bob');
        });

        it('should throw error if setter is missing', () => {
            document.body.innerHTML = `<div data-scope="bad-model"><input data-model="val"></div>`;
            
            Leaf.defineScope('bad-model', () => {
                const [val] = Leaf.signal('');
                return { val }; // Lupa return setVal
            });

            // Expect mounting to throw because data-model requires setter
            expect(() => Leaf.mount()).toThrowError(/requires signal "val\(\)" and setter "setVal\(\)"/);
        });
    });

    // --- 6. List Rendering (data-for) ---
    describe('List Rendering (data-for)', () => {
        it('should render list of items', () => {
            document.body.innerHTML = `
                <div data-scope="list">
                    <ul data-for="items">
                        <template>
                            <li data-text="$item"></li>
                        </template>
                    </ul>
                </div>
            `;

            Leaf.defineScope('list', () => {
                const [items] = Leaf.signal(['Apple', 'Banana']);
                return { items };
            });

            Leaf.mount();
            const lis = document.querySelectorAll('li');
            expect(lis.length).toBe(2);
            expect(lis[0].textContent).toBe('Apple');
            expect(lis[1].textContent).toBe('Banana');
        });

        it('should update list when signal changes', () => {
            document.body.innerHTML = `
                <div data-scope="list-update">
                    <ul data-for="items">
                        <template>
                            <li data-text="$item"></li>
                        </template>
                    </ul>
                </div>
            `;

            let updateItems;

            Leaf.defineScope('list-update', () => {
                const [items, setItems] = Leaf.signal([]);
                updateItems = setItems;
                return { items };
            });

            Leaf.mount();
            expect(document.querySelectorAll('li').length).toBe(0);

            updateItems(['A', 'B', 'C']);
            expect(document.querySelectorAll('li').length).toBe(3);
        });
    });

    // --- 7. Attributes & Classes ---
    describe('Attributes and Classes', () => {
        it('should toggle class based on signal (data-class)', () => {
            document.body.innerHTML = `
                <div data-scope="style">
                    <div id="box" data-class="isActive: 'red'"></div>
                </div>
            `;

            let toggle;
            Leaf.defineScope('style', () => {
                const [isActive, setIsActive] = Leaf.signal(false);
                toggle = setIsActive;
                return { isActive };
            });

            Leaf.mount();
            const box = document.getElementById('box');
            
            expect(box.classList.contains('red')).toBe(false);
            toggle(true);
            expect(box.classList.contains('red')).toBe(true);
        });

        it('should bind attributes (data-bind)', () => {
            document.body.innerHTML = `
                <div data-scope="attr">
                    <button id="btn" data-bind="disabled: isDisabled"></button>
                </div>
            `;

            let setDisabled;
            Leaf.defineScope('attr', () => {
                const [isDisabled, setIsDisabled] = Leaf.signal(false);
                setDisabled = setIsDisabled;
                return { isDisabled };
            });

            Leaf.mount();
            const btn = document.getElementById('btn');
            
            expect(btn.hasAttribute('disabled')).toBe(false);
            setDisabled(true);
            expect(btn.hasAttribute('disabled')).toBe(true);
        });
    });
});
