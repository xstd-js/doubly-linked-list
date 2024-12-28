import {
  decrementDoublyLinkedListSize,
  setDoublyLinkedListFirst,
  setDoublyLinkedListLast,
  updateDoublyLinkedListSizeFromNodeMutation
} from './doubly-doubly-linked-list-linker.private.js';
import { DoublyLinkedList } from './doubly-doubly-linked-list.js';

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
   * Removes the node from its neighbour nodes and its list, but doesn't modify this node's state.
   */
  #fastRemove(): boolean {
    if (this.#list === null) {
      return false;
    } else {
      if (this.#previous === null) {
        // is first
        setDoublyLinkedListFirst(this.#list, this.#next);
      } else {
        this.#previous.#next = this.#next;
      }

      if (this.#next === null) {
        // is last
        setDoublyLinkedListLast(this.#list, this.#next);
      } else {
        this.#next.#previous = this.#previous;
      }

      return true;
    }
  }

  /**
   * Inserts this node at the beginning of `list`.
   */
  insertBeginning(list: DoublyLinkedList<GValue>): void {
    if (this.#list !== list || list.first !== this) {
      updateDoublyLinkedListSizeFromNodeMutation<GValue>(this.#list, list);

      this.#fastRemove();

      this.#list = list;
      this.#previous = null;
      this.#next = list.first;

      if (list.first === null) {
        // empty list
        setDoublyLinkedListLast(list, this);
      } else {
        list.first.#previous = this;
      }

      setDoublyLinkedListFirst(list, this);
    }
  }

  /**
   * Inserts this node at the end of `list`.
   */
  insertEnd(list: DoublyLinkedList<GValue>): void {
    if (this.#list !== list || list.last !== this) {
      updateDoublyLinkedListSizeFromNodeMutation<GValue>(this.#list, list);

      this.#fastRemove();

      this.#list = list;
      this.#previous = list.last;
      this.#next = null;

      if (list.last === null) {
        // empty list
        setDoublyLinkedListFirst(list, this);
      } else {
        list.last.#next = this;
      }

      setDoublyLinkedListLast(list, this);
    }
  }

  /**
   * Removes this node from its list.
   */
  remove(): void {
    if (this.#fastRemove()) {
      decrementDoublyLinkedListSize(this.#list!);
      this.#previous = null;
      this.#next = null;
      this.#list = null;
    }
  }

  /**
   * Inserts `node` after this node.
   */
  insertAfter(node: DoublyLinkedListNode<GValue>): void {
    if (node !== this) {
      this.#expectedNotIsolated();

      updateDoublyLinkedListSizeFromNodeMutation<GValue>(node.#list, this.#list!);

      // detaches the node from its list
      node.#fastRemove();
      node.#list = this.#list;
      node.#previous = this;

      if (this.#next === null) {
        // is last
        node.#next = null;
        setDoublyLinkedListLast(this.#list!, node);
      } else {
        node.#next = this.#next;
        this.#next.#previous = node;
      }

      this.#next = node;
    }
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
    if (node !== this) {
      this.#expectedNotIsolated();

      updateDoublyLinkedListSizeFromNodeMutation<GValue>(node.#list, this.#list!);

      // detaches the node from its list
      node.#fastRemove();
      node.#list = this.#list;
      node.#next = this;

      if (this.#previous === null) {
        // is first
        node.#previous = null;
        setDoublyLinkedListFirst(this.#list!, node);
      } else {
        node.#previous = this.#previous;
        this.#previous.#next = node;
      }

      this.#previous = node;
    }
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
      this.#expectedNotIsolated();

      // detaches the node from its list
      node.#fastRemove();

      node.#list = this.#list;
      node.#previous = this.#previous;
      node.#next = this.#next;

      if (this.#next === null) {
        // is last
        setDoublyLinkedListLast(this.#list!, node);
      } else {
        this.#next.#previous = node;
      }

      if (this.#previous === null) {
        // is first
        setDoublyLinkedListFirst(this.#list!, node);
      } else {
        this.#previous.#next = node;
      }

      this.#previous = null;
      this.#next = null;
      this.#list = null;
    }
  }

  /**
   * Replaces this node with many `nodes`.
   */
  replaceWith(...nodes: DoublyLinkedListNode<GValue>[]): void {
    this.after(...nodes);
    this.remove();
  }
}
