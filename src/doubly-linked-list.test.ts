import { describe, expect, it, test, vi } from 'vitest';
import { DoublyLinkedListNode } from './doubly-linked-list-node.js';
import { DoublyLinkedList } from './doubly-linked-list.js';

describe('DoublyLinkedList', (): void => {
  describe('constructor', (): void => {
    it('should accept no argument', (): void => {
      const list = new DoublyLinkedList<number>();

      expect(list.size).toBe(0);
    });

    it('should accept an iterable as argument', (): void => {
      const list = new DoublyLinkedList<number>([0, 1, 2]);

      expect(list.size).toBe(3);
      expect(list.at(0)).toBe(0);
      expect(list.at(1)).toBe(1);
      expect(list.at(2)).toBe(2);
    });
  });

  describe('properties', (): void => {
    describe('first', (): void => {
      it('should have expected value null', (): void => {
        const list = new DoublyLinkedList<number>([]);

        expect(list.first).toBe(null);
      });

      it('should have expected value 0', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.first?.value).toBe(0);
      });
    });

    describe('last', (): void => {
      it('should have expected value null', (): void => {
        const list = new DoublyLinkedList<number>([]);

        expect(list.last).toBe(null);
      });

      it('should have expected value 0', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.last?.value).toBe(2);
      });
    });

    describe('size', (): void => {
      it('should have expected size 0', (): void => {
        const list = new DoublyLinkedList<number>([]);

        expect(list.size).toBe(0);
      });

      it('should have expected size 3', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.size).toBe(3);
      });
    });
  });

  describe('methods', (): void => {
    describe('isEmpty', (): void => {
      it('should be empty if it has no value', (): void => {
        const list = new DoublyLinkedList<number>([]);

        expect(list.isEmpty()).toBe(true);
      });

      it('should not be empty if it has values', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.isEmpty()).toBe(false);
      });
    });

    describe('at', (): void => {
      it('should have expected values', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.at(0)).toBe(0);
        expect(list.at(1)).toBe(1);
        expect(list.at(2)).toBe(2);
      });

      it('should support negative index', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.at(-1)).toBe(2);
        expect(list.at(-2)).toBe(1);
        expect(list.at(-3)).toBe(0);
      });

      it('should support out-of-range index', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.at(4)).toBe(undefined);
        expect(list.at(-4)).toBe(undefined);
      });
    });

    describe('unshift', (): void => {
      it('should push values at the beginning of the list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        list.unshift(-3, -2, -1);

        expect(list.size).toBe(6);
        expect(list.at(0)).toBe(-3);
        expect(list.at(1)).toBe(-2);
        expect(list.at(2)).toBe(-1);
        expect(list.at(3)).toBe(0);
        expect(list.at(4)).toBe(1);
        expect(list.at(5)).toBe(2);
      });
    });

    describe('shift', (): void => {
      it('should remove a value at the beginning of the list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.shift()).toBe(0);
        expect(list.size).toBe(2);
        expect(list.at(0)).toBe(1);
        expect(list.at(1)).toBe(2);
      });

      it('should return undefined if not value can be removed', (): void => {
        const list = new DoublyLinkedList<number>([]);

        expect(list.shift()).toBe(undefined);
      });
    });

    describe('push', (): void => {
      it('should push values at the end of the list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        list.push(3, 4, 5);

        expect(list.size).toBe(6);
        expect(list.at(0)).toBe(0);
        expect(list.at(1)).toBe(1);
        expect(list.at(2)).toBe(2);
        expect(list.at(3)).toBe(3);
        expect(list.at(4)).toBe(4);
        expect(list.at(5)).toBe(5);
      });
    });

    describe('pop', (): void => {
      it('should remove a value at the end of the list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.pop()).toBe(2);
        expect(list.at(0)).toBe(0);
        expect(list.at(1)).toBe(1);
      });

      it('should return undefined if not value can be removed', (): void => {
        const list = new DoublyLinkedList<number>([]);

        expect(list.pop()).toBe(undefined);
      });
    });

    describe('iterator', (): void => {
      it('should be iterable', async (): Promise<void> => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        let i: number = 0;
        for (const node of list.iterator()) {
          expect(node.value).toBe(i++);
        }

        expect(i).toBe(3);
      });

      describe('mutationTolerant', (): void => {
        it('should be iterable', async (): Promise<void> => {
          const list = new DoublyLinkedList<number>([0, 1, 2]);

          let i: number = 0;
          for (const node of list.iterator({ mutationTolerant: true })) {
            expect(node.value).toBe(i++);
          }

          expect(i).toBe(3);
        });

        it('should be resilient to mutations', async (): Promise<void> => {
          const list = new DoublyLinkedList<number>([0, 1, 2]);

          let i: number = 0;
          for (const node of list.iterator({ mutationTolerant: true })) {
            expect(node.value).toBe(i++);
            node.remove();
          }
          expect(i).toBe(3);
        });
      });

      describe('reverse', (): void => {
        it('should be iterable', async (): Promise<void> => {
          const list = new DoublyLinkedList<number>([0, 1, 2]);

          let i: number = 0;
          for (const node of list.iterator({ reverse: true })) {
            expect(node.value).toBe(2 - i);
            i++;
          }
          expect(i).toBe(3);
        });

        describe('mutationTolerant', (): void => {
          it('should be iterable', async (): Promise<void> => {
            const list = new DoublyLinkedList<number>([0, 1, 2]);

            let i: number = 0;
            for (const node of list.iterator({ reverse: true, mutationTolerant: true })) {
              expect(node.value).toBe(2 - i);
              i++;
            }
            expect(i).toBe(3);
          });

          it('should be resilient to mutations', async (): Promise<void> => {
            const list = new DoublyLinkedList<number>([0, 1, 2]);

            let i: number = 0;
            for (const node of list.iterator({ reverse: true, mutationTolerant: true })) {
              expect(node.value).toBe(2 - i);
              i++;
              node.remove();
            }
            expect(i).toBe(3);
          });
        });
      });
    });

    describe('values', (): void => {
      it('should be iterable', async (): Promise<void> => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        let i: number = 0;
        for (const value of list.values()) {
          expect(value).toBe(i++);
        }
        expect(i).toBe(3);
      });
    });

    describe('[Symbol.iterator]', (): void => {
      it('should be iterable', async (): Promise<void> => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        let i: number = 0;
        for (const node of list) {
          expect(node.value).toBe(i++);
        }
        expect(i).toBe(3);
      });
    });

    describe('forEachNode', (): void => {
      it('should be iterable', async (): Promise<void> => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        const spy = vi.fn();

        list.forEachNode(spy);

        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, list.first);
        expect(spy).toHaveBeenNthCalledWith(2, list.first!.next);
        expect(spy).toHaveBeenNthCalledWith(3, list.first!.next!.next);
      });
    });

    describe('forEach', (): void => {
      it('should emits expected values', async (): Promise<void> => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        const spy = vi.fn();

        list.forEach(spy);

        expect(spy).toHaveBeenCalledTimes(3);
        expect(spy).toHaveBeenNthCalledWith(1, 0);
        expect(spy).toHaveBeenNthCalledWith(2, 1);
        expect(spy).toHaveBeenNthCalledWith(3, 2);
      });
    });
  });

  describe('Emitter', (): void => {
    test('exemple-01', async (): Promise<void> => {
      interface Listener<GValue> {
        (value: GValue): void;
      }

      class Emitter<GValue> {
        readonly #listeners = new DoublyLinkedList<Listener<GValue>>();

        listen(listener: Listener<GValue>): () => void {
          const node = new DoublyLinkedListNode<Listener<GValue>>(listener);
          node.insertEnd(this.#listeners);

          return (): void => {
            node.remove();
          };
        }

        dispatch(value: GValue): void {
          for (const listener of this.#listeners.values({ mutationTolerant: true })) {
            listener(value);
          }
        }
      }

      const emitter = new Emitter<number>();

      emitter.listen((value: number): void => {
        console.log('listener-01', value);
      });

      const stopListener = emitter.listen((value: number): void => {
        console.log('listener-02', value);
      });

      emitter.dispatch(0);
      // logs:
      //   listener-01 0
      //   listener-02 0

      stopListener();

      emitter.dispatch(1);
      // logs:
      //   listener-01 1
    });
  });
});
