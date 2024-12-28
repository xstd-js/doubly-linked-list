import { DoublyLinkedListNode } from './doubly-doubly-linked-list-node.js';
import { DoublyLinkedList } from './doubly-doubly-linked-list.js';

export const SET_DOUBLY_LINKED_LIST_FIRST = new WeakMap<
  DoublyLinkedList<any>,
  (node: DoublyLinkedListNode<any> | null) => void
>();

export function setDoublyLinkedListFirst<GValue>(
  list: DoublyLinkedList<GValue>,
  node: DoublyLinkedListNode<GValue> | null
): void {
  SET_DOUBLY_LINKED_LIST_FIRST.get(list)!(node);
}

export const SET_DOUBLY_LINKED_LIST_LAST = new WeakMap<
  DoublyLinkedList<any>,
  (node: DoublyLinkedListNode<any> | null) => void
>();

export function setDoublyLinkedListLast<GValue>(
  list: DoublyLinkedList<GValue>,
  node: DoublyLinkedListNode<GValue> | null
): void {
  SET_DOUBLY_LINKED_LIST_LAST.get(list)!(node);
}

export const SET_DOUBLY_LINKED_LIST_SIZE = new WeakMap<DoublyLinkedList<any>, (size: number) => void>();

export function setDoublyLinkedListSize(list: DoublyLinkedList<any>, size: number): void {
  SET_DOUBLY_LINKED_LIST_SIZE.get(list)!(size);
}

export function decrementDoublyLinkedListSize(list: DoublyLinkedList<any>): void {
  setDoublyLinkedListSize(list, list.size - 1);
}

function incrementDoublyLinkedListSize(list: DoublyLinkedList<any>): void {
  setDoublyLinkedListSize(list, list.size + 1);
}

export function updateDoublyLinkedListSizeFromNodeMutation<GValue>(
  removeFromList: DoublyLinkedList<GValue> | null,
  addedToList: DoublyLinkedList<GValue>
): void {
  if (removeFromList !== addedToList) {
    if (removeFromList !== null) {
      decrementDoublyLinkedListSize(removeFromList);
    }
    incrementDoublyLinkedListSize(addedToList);
  }
}
