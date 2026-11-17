import { bench, describe } from 'vitest';
import { DoublyLinkedListNode } from '../doubly-linked-list-node/doubly-linked-list-node.js';
import { DoublyLinkedList } from './doubly-linked-list.js';

describe('DoublyLinkedList', (): void => {
  let array: number[];
  let set: Set<number>;
  let list: DoublyLinkedList<number>;

  for (const size of [1e1, 1e2, 1e3, 1e4, 1e5, 1e6]) {
    describe(`size=${size.toExponential()}`, (): void => {
      const index = Math.floor(size / 2);

      const setupArray = () => {
        array = Array.from({ length: size }, (_, i: number): number => i);
      };

      const setupSet = () => {
        set = new Set<number>(Array.from({ length: size }, (_, i: number): number => i));
      };

      const setupDoublyLinkedList = () => {
        list = new DoublyLinkedList<number>(
          Array.from({ length: size }, (_, i: number): number => i),
        );
      };

      describe('insert', (): void => {
        bench(
          'array',
          (): void => {
            array.splice(1, 0, Math.random());
          },
          {
            setup: setupArray,
          },
        );

        bench(
          'set',
          (): void => {
            set.add(Math.random());
          },
          {
            setup: setupSet,
          },
        );

        bench(
          'list',
          (): void => {
            list.first?.insertAfter(new DoublyLinkedListNode(Math.random()));
          },
          {
            setup: setupDoublyLinkedList,
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
            setup: setupArray,
          },
        );

        bench(
          'set',
          (): void => {
            set.delete(set.values().next().value!);
          },
          {
            setup: setupSet,
          },
        );

        bench(
          'list',
          (): void => {
            list.first?.next?.remove();
          },
          {
            setup: setupDoublyLinkedList,
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
            setup: setupArray,
          },
        );

        bench.skip(
          'set',
          (): void => {
            throw new Error('Not applicable');
          },
          {
            setup: setupSet,
          },
        );

        bench(
          'list',
          (): void => {
            list.set(index, Math.random());
          },
          {
            setup: setupDoublyLinkedList,
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
            setup: setupArray,
          },
        );

        bench.skip(
          'set',
          (): void => {
            throw new Error('Not applicable');
          },
          {
            setup: setupSet,
          },
        );

        bench(
          'list',
          (): void => {
            list.unshift(Math.random());
          },
          {
            setup: setupDoublyLinkedList,
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
            setup: setupArray,
          },
        );

        bench.skip(
          'set',
          (): void => {
            throw new Error('Not applicable');
          },
          {
            setup: setupSet,
          },
        );

        bench(
          'list',
          (): void => {
            list.shift();
          },
          {
            setup: setupDoublyLinkedList,
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
            setup: setupArray,
          },
        );

        bench.skip(
          'set',
          (): void => {
            throw new Error('Not applicable');
          },
          {
            setup: setupSet,
          },
        );

        bench(
          'list',
          (): void => {
            list.push(Math.random());
          },
          {
            setup: setupDoublyLinkedList,
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
            setup: setupArray,
          },
        );

        bench.skip(
          'set',
          (): void => {
            throw new Error('Not applicable');
          },
          {
            setup: setupSet,
          },
        );

        bench(
          'list',
          (): void => {
            list.pop();
          },
          {
            setup: setupDoublyLinkedList,
          },
        );
      });

      describe.only('iterate', (): void => {
        bench(
          'array',
          (): void => {
            let i: number = 0;
            for (const value of array) {
              i += value;
            }
          },
          {
            setup: setupArray,
          },
        );

        bench(
          'set',
          (): void => {
            let i: number = 0;
            for (const value of list.values()) {
              i += value;
            }
          },
          {
            setup: setupSet,
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
            setup: setupDoublyLinkedList,
          },
        );
      });
    });
  }
});
