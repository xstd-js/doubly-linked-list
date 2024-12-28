import { describe, expect, it } from 'vitest';
import { DoublyLinkedList } from './doubly-linked-list.js';

describe('DoublyLinkedList', () => {
  it.todo('should work', () => {
    // TODO
    const list = new DoublyLinkedList<number>([0, 1, 2]);

    list.forEachNode((node) => {
      console.log(node.value);
      node.next?.remove();
      node.previous?.remove();
      node.remove();
    });
  });
});
