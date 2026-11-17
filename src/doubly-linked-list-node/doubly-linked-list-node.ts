import { type DoublyLinkedList } from '../doubly-linked-list/doubly-linked-list.js';
import {
  DoublyLinkedListInternals,
  getDoublyLinkedListInternals,
} from '../doubly-linked-list/internals.private/doubly-linked-list-internals.js';

/**
 * A node inside a `DoublyLinkedList`.
 */
export class DoublyLinkedListNode<GValue> {
  value: GValue;

  #list: DoublyLinkedList<GValue> | null;
  #previous: DoublyLinkedListNode<GValue> | null;
  #next: DoublyLinkedListNode<GValue> | null;

  constructor(value: GValue) {
    this.value = value;
    this.#list = null;
    this.#previous = null;
    this.#next = null;
  }

  /**
   * Returns true if the node has no associated list.
   */
  get isolated(): boolean {
    return this.#list == null;
  }

  /**
   * Returns the node's list, if any.
   */
  get list(): DoublyLinkedList<GValue> | null {
    return this.#list;
  }

  /**
   * Returns the previous node relative to this one, if any.
   */
  get previous(): DoublyLinkedListNode<GValue> | null {
    return this.#previous;
  }

  /**
   * Returns the next node relative to this one, if any.
   */
  get next(): DoublyLinkedListNode<GValue> | null {
    return this.#next;
  }

  #expectedNotIsolated(): void {
    if (this.#list === null) {
      throw new Error('Not in a list.');
    }
  }

  /**
   * Detaches the node from its neighbor nodes and its list but doesn't modify this node's state.
   */
  #detach(): void {
    const listInternals: DoublyLinkedListInternals<GValue> = getDoublyLinkedListInternals<GValue>(
      this.#list!,
    );

    if (listInternals.iterated === this) {
      listInternals.iterated = listInternals.reverseIteration ? this.#previous : this.#next;
    }

    if (this.#previous === null) {
      // is first
      listInternals.first = this.#next;
    } else {
      this.#previous.#next = this.#next;
    }

    if (this.#next === null) {
      // is last
      listInternals.last = this.#previous;
    } else {
      this.#next.#previous = this.#previous;
    }

    listInternals.size--;
  }

  /**
   * Inserts this node at the beginning of `list`.
   */
  insertBeginning(list: DoublyLinkedList<GValue>): void {
    const listInternals: DoublyLinkedListInternals<GValue> =
      getDoublyLinkedListInternals<GValue>(list);

    if (this.#list === list && listInternals.first === this) {
      // node is already the first node of `list` => nothing to do
      return;
    }

    if (this.#list !== null) {
      this.#detach();
    }

    listInternals.size++;

    this.#list = list;
    this.#previous = null;
    this.#next = listInternals.first;

    if (listInternals.first === null) {
      // empty list
      listInternals.last = this;
    } else {
      listInternals.first.#previous = this;
    }

    listInternals.first = this;
  }

  /**
   * Inserts this node at the end of `list`.
   */
  insertEnd(list: DoublyLinkedList<GValue>): void {
    const listInternals: DoublyLinkedListInternals<GValue> =
      getDoublyLinkedListInternals<GValue>(list);

    if (this.#list === list && listInternals.last === this) {
      // node is already the last node of `list` => nothing to do
      return;
    }

    if (this.#list !== null) {
      this.#detach();
    }

    listInternals.size++;

    this.#list = list;
    this.#previous = listInternals.last;
    this.#next = null;

    if (listInternals.last === null) {
      // empty list
      listInternals.first = this;
    } else {
      listInternals.last.#next = this;
    }

    listInternals.last = this;
  }

  /**
   * Removes this node from its list.
   */
  remove(): void {
    if (this.#list == null) {
      // node is already isolated => nothing to do
      return;
    }

    this.#detach();

    this.#previous = null;
    this.#next = null;
    this.#list = null;
  }

  /**
   * Inserts `node` after this node.
   */
  insertAfter(node: DoublyLinkedListNode<GValue>): void {
    if (node === this || this.#next === node) {
      // node is already after this node => nothing to do
      return;
    }

    this.#expectedNotIsolated();

    if (node.#list !== null) {
      node.#detach();
    }

    const listInternals: DoublyLinkedListInternals<GValue> = getDoublyLinkedListInternals<GValue>(
      this.#list!,
    );

    if (
      listInternals.iterated !== null &&
      (listInternals.reverseIteration
        ? listInternals.iterated === this
        : listInternals.iterated.previous === this)
    ) {
      listInternals.iterated = node;
    }

    listInternals.size++;

    node.#list = this.#list;
    node.#previous = this;

    if (this.#next === null) {
      // is last
      node.#next = null;
      listInternals.last = node;
    } else {
      node.#next = this.#next;
      this.#next.#previous = node;
    }

    this.#next = node;
  }

  /**
   * Inserts many `nodes` after this node.
   */
  after(...nodes: DoublyLinkedListNode<GValue>[]): void {
    for (let i: number = nodes.length - 1; i >= 0; i--) {
      this.insertAfter(nodes[i]);
    }
  }

  /**
   * Inserts `node` before this node.
   */
  insertBefore(node: DoublyLinkedListNode<GValue>): void {
    if (node === this || this.#previous === node) {
      // node is already before this node => nothing to do
      return;
    }

    this.#expectedNotIsolated();

    if (node.#list !== null) {
      node.#detach();
    }

    const listInternals: DoublyLinkedListInternals<GValue> = getDoublyLinkedListInternals<GValue>(
      this.#list!,
    );

    if (
      listInternals.iterated !== null &&
      (listInternals.reverseIteration
        ? listInternals.iterated.next === this
        : listInternals.iterated === this)
    ) {
      listInternals.iterated = node;
    }

    listInternals.size++;

    node.#list = this.#list;
    node.#next = this;

    if (this.#previous === null) {
      // is first
      node.#previous = null;
      listInternals.first = node;
    } else {
      node.#previous = this.#previous;
      this.#previous.#next = node;
    }

    this.#previous = node;
  }

  /**
   * Inserts many `nodes` before this node.
   */
  before(...nodes: DoublyLinkedListNode<GValue>[]): void {
    for (let i: number = 0; i < nodes.length; i++) {
      this.insertBefore(nodes[i]);
    }
  }

  /**
   * Replaces this node with `node`.
   */
  replace(node: DoublyLinkedListNode<GValue>): void {
    if (node !== this) {
      this.insertAfter(node);
      this.remove();
    }

    // TODO optimize
    // if (node !== this) {
    //   this.#expectedNotIsolated();
    //
    //   // detaches the node from its list
    //   node.#fastRemove();
    //   node.#list = this.#list;
    //   node.#previous = this.#previous;
    //   node.#next = this.#next;
    //
    //   if (this.#next === null) {
    //     // is last
    //     setDoublyLinkedListLast(this.#list!, node);
    //   } else {
    //     this.#next.#previous = node;
    //   }
    //
    //   if (this.#previous === null) {
    //     // is first
    //     setDoublyLinkedListFirst(this.#list!, node);
    //   } else {
    //     this.#previous.#next = node;
    //   }
    //
    //   this.#previous = null;
    //   this.#next = null;
    //   this.#list = null;
    // }
  }

  /**
   * Replaces this node with many `nodes`.
   */
  replaceWith(...nodes: DoublyLinkedListNode<GValue>[]): void {
    this.after(...nodes);
    this.remove();
  }
}
