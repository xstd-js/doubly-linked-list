import { type DoublyLinkedListNode } from '../../doubly-linked-list-node/doubly-linked-list-node.js';
import { type DoublyLinkedList } from '../doubly-linked-list.js';

export interface DoublyLinkedListInternals<GValue> {
  first: DoublyLinkedListNode<GValue> | null;
  last: DoublyLinkedListNode<GValue> | null;
  size: number; // computed
  iterated: DoublyLinkedListNode<GValue> | null;
  reverseIteration: boolean;
}

const DOUBLY_LINKED_LIST_INTERNALS_MAP = new WeakMap<
  DoublyLinkedList<any>,
  DoublyLinkedListInternals<any>
>();

export function setDoublyLinkedListInternals<GValue>(
  list: DoublyLinkedList<GValue>,
  internals: DoublyLinkedListInternals<GValue>,
): void {
  DOUBLY_LINKED_LIST_INTERNALS_MAP.set(list, internals);
}

export function getDoublyLinkedListInternals<GValue>(
  list: DoublyLinkedList<GValue>,
): DoublyLinkedListInternals<GValue> {
  return DOUBLY_LINKED_LIST_INTERNALS_MAP.get(list)!;
}
