import {
  SET_DOUBLY_LINKED_LIST_FIRST,
  SET_DOUBLY_LINKED_LIST_LAST,
  SET_DOUBLY_LINKED_LIST_SIZE
} from './doubly-linked-list-linker.private.js';
import { DoublyLinkedListNode } from './doubly-linked-list-node.js';

/**
 * A list optimized for quick addition/removal of values at random indexes.
 *
 * TRADEOFF: this list if not optimized for fast access based on index.
 */
export class DoublyLinkedList<GValue> {
  #first: DoublyLinkedListNode<GValue> | null;
  #last: DoublyLinkedListNode<GValue> | null;
  #size: number; // computed

  constructor(values: Iterable<GValue> = []) {
    this.#first = null;
    this.#last = null;
    this.#size = 0;

    SET_DOUBLY_LINKED_LIST_FIRST.set(this, (node: DoublyLinkedListNode<GValue> | null): void => {
      this.#first = node;
    });

    SET_DOUBLY_LINKED_LIST_LAST.set(this, (node: DoublyLinkedListNode<GValue> | null): void => {
      this.#last = node;
    });

    SET_DOUBLY_LINKED_LIST_SIZE.set(this, (size: number): void => {
      this.#size = size;
    });

    const iterator: Iterator<GValue> = values[Symbol.iterator]();
    let result: IteratorResult<GValue>;
    while (!(result = iterator.next()).done) {
      new DoublyLinkedListNode<GValue>(result.value).insertEnd(this);
      // this.push(result.value);
    }
  }

  /**
   * Returns the first node of this list, if any.
   */
  get first(): DoublyLinkedListNode<GValue> | null {
    return this.#first;
  }

  /**
   * Returns the last node of this list, if any.
   */
  get last(): DoublyLinkedListNode<GValue> | null {
    return this.#last;
  }

  /**
   * returns true if the list is empty.
   */
  isEmpty(): boolean {
    return this.#first === null;
  }

  /**
   * Returns the size this list, if any.
   *
   * COMPLEXITY: `O(1)`
   */
  get size(): number {
    return this.#size;
    // let size: number = 0;
    //
    // let node: DoublyLinkedListNode<GValue> | null = this.#first;
    // while (node !== null) {
    //   size++;
    //   node = node.next;
    // }
    //
    // return size;
  }

  /**
   * Returns the value at `index`.
   *
   * If `index` is negative, starts from the end.
   *
   * COMPLEXITY: `O(n)`
   */
  at(index: number): GValue | undefined {
    let node: DoublyLinkedListNode<GValue> | null;

    if (index < 0) {
      node = this.#last;
      while (node !== null && index < -1) {
        index++;
        node = node.previous;
      }
    } else {
      node = this.#first;
      while (node !== null && index > 0) {
        index--;
        node = node.next;
      }
    }

    return node?.value;
  }

  /**
   * Inserts `values` at the beginning of the list.
   */
  unshift(...values: readonly GValue[]): void {
    for (let i: number = values.length - 1; i >= 0; i--) {
      new DoublyLinkedListNode<GValue>(values[i]).insertBeginning(this);
    }
  }

  /**
   * Removes and returns the first value of the list, or `undefined` if the list is empty.
   */
  shift(): GValue | undefined {
    if (this.#first === null) {
      return undefined;
    } else {
      const value: GValue = this.#first.value;
      this.#first.remove();
      return value;
    }
  }

  /**
   * Inserts `values` at the end of the list.
   */
  push(...values: readonly GValue[]): void {
    for (let i: number = 0; i < values.length; i++) {
      new DoublyLinkedListNode<GValue>(values[i]).insertEnd(this);
    }
  }

  /**
   * Removes and returns the last value of the list, or `undefined` if the list is empty.
   */
  pop(): GValue | undefined {
    if (this.#last === null) {
      return undefined;
    } else {
      const value: GValue = this.#last.value;
      this.#last.remove();
      return value;
    }
  }

  /**
   * Creates an iterator on the nodes of the list.
   *
   * This iterator is resilient to mutations on the list occurring while iterating.
   *
   * COMPLEXITY: `O(n)`
   */
  *iterator(): IterableIterator<DoublyLinkedListNode<GValue>> {
    const done: DoublyLinkedListNode<GValue>[] = [];
    let node: DoublyLinkedListNode<GValue> | null = this.#first;

    main: while (node !== null) {
      done.push(node);
      yield node;

      while (node.list !== this) {
        if (done.length === 0) {
          node = this.#first;
          continue main;
        } else {
          node = done.pop()!;
        }
      }

      node = node.next;
    }
  }

  /**
   * Returns the values present in this list.
   */
  *values(): IterableIterator<GValue> {
    const iterator: Iterator<DoublyLinkedListNode<GValue>> = this.iterator();
    let result: IteratorResult<DoublyLinkedListNode<GValue>>;
    while (!(result = iterator.next()).done) {
      yield result.value.value;
    }
  }

  [Symbol.iterator](): IterableIterator<DoublyLinkedListNode<GValue>> {
    return this.iterator();
  }

  /**
   * Iterates on the nodes of this list, using a callback.
   */
  forEachNode(callback: (value: DoublyLinkedListNode<GValue>) => void): void {
    const iterator: Iterator<DoublyLinkedListNode<GValue>> = this.iterator();
    let result: IteratorResult<DoublyLinkedListNode<GValue>>;
    while (!(result = iterator.next()).done) {
      callback(result.value);
    }
  }

  /**
   * Iterates on the values of this list, using a callback.
   */
  forEach(callback: (value: GValue) => void): void {
    this.forEachNode((node: DoublyLinkedListNode<GValue>): void => {
      callback(node.value);
    });
  }
}
