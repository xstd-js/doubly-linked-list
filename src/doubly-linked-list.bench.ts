import { bench, describe } from 'vitest';
import { DoublyLinkedListNode } from './doubly-linked-list-node.js';
import { DoublyLinkedList } from './doubly-linked-list.js';

describe('DoublyLinkedList', (): void => {
  let array: number[];
  let list: DoublyLinkedList<number>;

  for (const size of [1e1, 1e2, 1e3, 1e4, 1e5, 1e6]) {
    describe(`size=${size.toExponential()}`, (): void => {
      const index = Math.floor(size / 2);

      describe('insert', (): void => {
        bench(
          'array',
          (): void => {
            array.splice(1, 0, Math.random());
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
            },
          },
        );

        bench(
          'list',
          (): void => {
            list.first?.insertAfter(new DoublyLinkedListNode(Math.random()));
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
              list = new DoublyLinkedList<number>(array);
            },
          },
        );
      });

      describe('remove', (): void => {
        bench(
          'array',
          (): void => {
            array.splice(1, 1);
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
            },
          },
        );

        bench(
          'list',
          (): void => {
            list.first?.next?.remove();
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
              list = new DoublyLinkedList<number>(array);
            },
          },
        );
      });

      describe('set', (): void => {
        bench(
          'array',
          (): void => {
            array[index] = Math.random();
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
            },
          },
        );

        bench(
          'list',
          (): void => {
            list.set(index, Math.random());
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
              list = new DoublyLinkedList<number>(array);
            },
          },
        );
      });

      describe('unshift', (): void => {
        bench(
          'array',
          (): void => {
            array.unshift(Math.random());
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
            },
          },
        );

        bench(
          'list',
          (): void => {
            list.unshift(Math.random());
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
              list = new DoublyLinkedList<number>(array);
            },
          },
        );
      });

      describe('shift', (): void => {
        bench(
          'array',
          (): void => {
            array.shift();
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
            },
          },
        );

        bench(
          'list',
          (): void => {
            list.shift();
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
              list = new DoublyLinkedList<number>(array);
            },
          },
        );
      });

      describe('push', (): void => {
        bench(
          'array',
          (): void => {
            array.push(Math.random());
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
            },
          },
        );

        bench(
          'list',
          (): void => {
            list.push(Math.random());
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
              list = new DoublyLinkedList<number>(array);
            },
          },
        );
      });

      describe('pop', (): void => {
        bench(
          'array',
          (): void => {
            array.pop();
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
            },
          },
        );

        bench(
          'list',
          (): void => {
            list.pop();
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
              list = new DoublyLinkedList<number>(array);
            },
          },
        );
      });

      describe('iterate', (): void => {
        bench(
          'array',
          (): void => {
            let i: number = 0;
            for (const value of array) {
              i += value;
            }
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
            },
          },
        );

        bench(
          'list',
          (): void => {
            let i: number = 0;
            for (const value of list.values()) {
              i += value;
            }
          },
          {
            setup: () => {
              array = Array.from({ length: size }, (_, i: number): number => i);
              list = new DoublyLinkedList<number>(array);
            },
          },
        );
      });
    });
  }
});
