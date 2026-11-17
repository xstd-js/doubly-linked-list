import { DoublyLinkedListNode } from '../doubly-linked-list-node/doubly-linked-list-node.js';
import {
  DoublyLinkedListInternals,
  setDoublyLinkedListInternals,
} from './internals.private/doubly-linked-list-internals.js';

export interface DoublyLinkedListIterableOptions {
  readonly reverse?: boolean;
}

/**
 * A list optimized for quick addition/removal of values at random indexes.
 *
 * TRADEOFF: this list is not optimized for fast access based on index.
 */
export class DoublyLinkedList<GValue> {
  readonly #internals: DoublyLinkedListInternals<GValue>;

  constructor(values: Iterable<GValue> = []) {
    this.#internals = {
      first: null,
      last: null,
      size: 0,
      iterated: null,
      reverseIteration: false,
    };

    setDoublyLinkedListInternals(this, this.#internals);

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
    return this.#internals.first;
  }

  /**
   * Returns the last node of this list, if any.
   */
  get last(): DoublyLinkedListNode<GValue> | null {
    return this.#internals.last;
  }

  /**
   * Returns true if the list is empty.
   */
  isEmpty(): boolean {
    return this.#internals.first === null;
  }

  /**
   * Returns the size of this list, if any.
   *
   * COMPLEXITY: `O(1)`
   */
  get size(): number {
    return this.#internals.size;
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
   * Returns the node at `index`.
   *
   * If `index` is negative, starts from the end.
   *
   * COMPLEXITY: `O(n)`
   */
  nodeAt(index: number): DoublyLinkedListNode<GValue> | null {
    let node: DoublyLinkedListNode<GValue> | null;

    if (index < 0) {
      node = this.#internals.last;
      while (node !== null && index < -1) {
        index++;
        node = node.previous;
      }
    } else {
      node = this.#internals.first;
      while (node !== null && index > 0) {
        index--;
        node = node.next;
      }
    }

    return node;
  }

  /**
   * Returns the value at `index`.
   *
   * If `index` is negative, starts from the end.
   *
   * COMPLEXITY: `O(n)`
   */
  at(index: number): GValue | undefined {
    return this.nodeAt(index)?.value;
  }

  /**
   * Sets the value at `index`.
   *
   * If `index` is negative, starts from the end.
   *
   * COMPLEXITY: `O(n)`
   */
  set(index: number, value: GValue): void {
    if (index >= this.#internals.size || index < -this.#internals.size) {
      throw new Error(`Index ${index} is out of bounds.`);
    }
    this.nodeAt(index)!.value = value;
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
    if (this.#internals.first === null) {
      return undefined;
    } else {
      const value: GValue = this.#internals.first.value;
      this.#internals.first.remove();
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
    if (this.#internals.last === null) {
      return undefined;
    } else {
      const value: GValue = this.#internals.last.value;
      this.#internals.last.remove();
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
  *iterator({ reverse = false }: DoublyLinkedListIterableOptions = {}): Generator<
    DoublyLinkedListNode<GValue>
  > {
    this.#internals.reverseIteration = reverse;

    if (reverse) {
      let node: DoublyLinkedListNode<GValue> | null = this.#internals.last;

      while (node !== null) {
        this.#internals.iterated = node.previous;
        yield node;
        node = this.#internals.iterated;
      }
    } else {
      let node: DoublyLinkedListNode<GValue> | null = this.#internals.first;

      while (node !== null) {
        this.#internals.iterated = node.next;
        yield node;
        node = this.#internals.iterated;
      }
    }
  }

  /**
   * Returns the values present in this list.
   */
  *values(options?: DoublyLinkedListIterableOptions): Generator<GValue> {
    const iterator: Iterator<DoublyLinkedListNode<GValue>> = this.iterator(options);
    let result: IteratorResult<DoublyLinkedListNode<GValue>>;
    while (!(result = iterator.next()).done) {
      yield result.value.value;
    }
  }

  [Symbol.iterator](): Generator<DoublyLinkedListNode<GValue>> {
    return this.iterator();
  }

  /**
   * Iterates on the nodes of this list, using a callback.
   */
  forEachNode(
    callback: (value: DoublyLinkedListNode<GValue>) => void,
    options?: DoublyLinkedListIterableOptions,
  ): void {
    const iterator: Iterator<DoublyLinkedListNode<GValue>> = this.iterator(options);
    let result: IteratorResult<DoublyLinkedListNode<GValue>>;
    while (!(result = iterator.next()).done) {
      callback(result.value);
    }
  }

  /**
   * Iterates on the values of this list, using a callback.
   */
  forEach(callback: (value: GValue) => void, options?: DoublyLinkedListIterableOptions): void {
    this.forEachNode((node: DoublyLinkedListNode<GValue>): void => {
      callback(node.value);
    }, options);
  }

  get [Symbol.toStringTag](): string {
    return 'DoublyLinkedList';
  }
}
