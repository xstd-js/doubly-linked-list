import { describe, expect, it } from 'vitest';
import { DoublyLinkedListNode } from './doubly-linked-list-node.js';
import { DoublyLinkedList } from './doubly-linked-list.js';

describe('DoublyLinkedListNode', (): void => {
  describe('constructor', (): void => {
    it('should accept a value as argument', (): void => {
      const node = new DoublyLinkedListNode<number>(0);

      expect(node.value).toBe(0);
    });
  });

  describe('properties', (): void => {
    describe('isolated', (): void => {
      it('should be isolated if it has no siblings or list', (): void => {
        const node = new DoublyLinkedListNode<number>(0);

        expect(node.isolated).toBe(true);
      });

      it('should not be isolated if it belongs to a list list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.first?.isolated).toBe(false);
      });
    });

    describe('list', (): void => {
      it('should not have a list if it is isolated', (): void => {
        const node = new DoublyLinkedListNode<number>(0);

        expect(node.list).toBe(null);
      });

      it('should belong to the list that created this node', (): void => {
        const list = new DoublyLinkedList<number>([0]);

        expect(list.first?.list).toBe(list);
      });
    });

    describe('previous', (): void => {
      it('should not have "previous" if it is isolated', (): void => {
        const node = new DoublyLinkedListNode<number>(0);

        expect(node.previous).toBe(null);
      });

      it('should not have "previous" if it is the first element of a list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.first?.previous).toBe(null);
      });

      it('should have "previous" if it is not the first element of a list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.last?.previous?.value).toBe(1);
      });
    });

    describe('next', (): void => {
      it('should not have "next" if it is isolated', (): void => {
        const node = new DoublyLinkedListNode<number>(0);

        expect(node.next).toBe(null);
      });

      it('should not have "next" if it is the last element of a list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.last?.next).toBe(null);
      });

      it('should have "next" if it is not the last element of a list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        expect(list.first?.next?.value).toBe(1);
      });
    });
  });

  describe('methods', (): void => {
    describe('insertBeginning', (): void => {
      it('should insert this node at the beginning of an empty list', (): void => {
        const node = new DoublyLinkedListNode<number>(0);
        const list = new DoublyLinkedList<number>([]);

        node.insertBeginning(list);

        expect(list.first).toBe(node);
      });

      it('should insert this node at the beginning of a non empty list', (): void => {
        const node = new DoublyLinkedListNode<number>(0);
        const list = new DoublyLinkedList<number>([1]);

        node.insertBeginning(list);

        expect(list.first).toBe(node);
        expect(list.at(1)).toBe(1);
      });

      it('should not insert this node at the beginning of a list if it is already the first node', (): void => {
        const list = new DoublyLinkedList<number>([0, 1]);

        const node = list.first!;
        node.insertBeginning(list);

        expect(list.first).toBe(node);
      });
    });

    describe('insertEnd', (): void => {
      it('should insert this node at the end of an empty list', (): void => {
        const node = new DoublyLinkedListNode<number>(0);
        const list = new DoublyLinkedList<number>([]);

        node.insertEnd(list);

        expect(list.last).toBe(node);
      });

      it('should insert this node at the end of a non empty list', (): void => {
        const node = new DoublyLinkedListNode<number>(1);
        const list = new DoublyLinkedList<number>([0]);

        node.insertEnd(list);

        expect(list.last).toBe(node);
        expect(list.at(0)).toBe(0);
      });

      it('should not insert this node at the end of a list if it is already the last node', (): void => {
        const list = new DoublyLinkedList<number>([0, 1]);

        const node = list.last!;
        node.insertEnd(list);

        expect(list.last).toBe(node);
      });
    });

    describe('remove', (): void => {
      it('should not remove this node if it is isolated', (): void => {
        const node = new DoublyLinkedListNode<number>(0);

        expect(node.isolated).toBe(true);
        node.remove();
        expect(node.isolated).toBe(true);
      });

      it('should be removable from a list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1]);

        const node = list.first!;

        expect(node.list).toBe(list);
        expect(node.previous).toBe(null);
        expect(node.next?.value).toBe(1);
        node.remove();
        expect(node.list).toBe(null);
        expect(node.previous).toBe(null);
        expect(node.next).toBe(null);
      });
    });

    describe('insertAfter', (): void => {
      it('should insert this node after another node', (): void => {
        const list = new DoublyLinkedList<number>([0]);

        const nodeA = new DoublyLinkedListNode<number>(1);
        expect(nodeA.list).toBe(null);
        list.first!.insertAfter(nodeA);
        expect(list.first!.next).toBe(nodeA);

        const nodeB = new DoublyLinkedListNode<number>(2);
        nodeA.insertAfter(nodeB);
        expect(nodeA.next).toBe(nodeB);
        expect(nodeB.previous).toBe(nodeA);

        const nodeC = new DoublyLinkedListNode<number>(1.5);
        nodeA.insertAfter(nodeC);
        expect(nodeA.next).toBe(nodeC);
        expect(nodeC.previous).toBe(nodeA);
        expect(nodeB.previous).toBe(nodeC);
        expect(nodeC.next).toBe(nodeB);
      });

      it('should support swaping', (): void => {
        const list = new DoublyLinkedList<number>([0, 1]);

        const nodeA = list.first!;
        const nodeB = list.last!;

        nodeB.insertAfter(nodeA);

        expect(list.size).toBe(2);
        expect(list.first).toBe(nodeB);
        expect(list.last).toBe(nodeA);
      });

      it('should prevent insertion if the node is isolated', (): void => {
        const nodeA = new DoublyLinkedListNode<number>(0);
        const nodeB = new DoublyLinkedListNode<number>(1);

        expect(() => nodeA.insertAfter(nodeB)).toThrow();
      });

      it('should skip insertion if the node is inserted after itself', (): void => {
        const list = new DoublyLinkedList<number>([0]);

        const node = list.first!;

        node.insertAfter(node);

        expect(list.first).toBe(node);
      });
    });

    describe('after', (): void => {
      it('should insert nodes after a node', (): void => {
        const list = new DoublyLinkedList<number>([0]);

        const nodeA = new DoublyLinkedListNode<number>(1);
        const nodeB = new DoublyLinkedListNode<number>(2);

        list.first!.after(nodeA, nodeB);

        expect(list.first!.next).toBe(nodeA);
        expect(list.first!.next!.next).toBe(nodeB);
      });
    });

    describe('insertBefore', (): void => {
      it('should insert this node before another node', (): void => {
        const list = new DoublyLinkedList<number>([0]);

        const nodeA = new DoublyLinkedListNode<number>(1);
        expect(nodeA.list).toBe(null);
        list.last!.insertBefore(nodeA);
        expect(list.last!.previous).toBe(nodeA);

        const nodeB = new DoublyLinkedListNode<number>(2);
        nodeA.insertBefore(nodeB);
        expect(nodeA.previous).toBe(nodeB);
        expect(nodeB.next).toBe(nodeA);

        const nodeC = new DoublyLinkedListNode<number>(1.5);
        nodeA.insertBefore(nodeC);
        expect(nodeA.previous).toBe(nodeC);
        expect(nodeC.next).toBe(nodeA);
        expect(nodeB.next).toBe(nodeC);
        expect(nodeC.previous).toBe(nodeB);
      });

      it('should prevent insertion if the node is isolated', (): void => {
        const nodeA = new DoublyLinkedListNode<number>(0);
        const nodeB = new DoublyLinkedListNode<number>(1);

        expect(() => nodeA.insertBefore(nodeB)).toThrow();
      });

      it('should skip insertion if the node is inserted before itself', (): void => {
        const list = new DoublyLinkedList<number>([0]);

        const node = list.last!;

        node.insertBefore(node);

        expect(list.last).toBe(node);
      });
    });

    describe('before', (): void => {
      it('should insert nodes before a node', (): void => {
        const list = new DoublyLinkedList<number>([0]);

        const nodeA = new DoublyLinkedListNode<number>(1);
        const nodeB = new DoublyLinkedListNode<number>(2);

        list.first!.before(nodeA, nodeB);

        expect(list.first).toBe(nodeA);
        expect(list.first!.next).toBe(nodeB);
      });
    });

    describe('replace', (): void => {
      it('should replace a node with another one', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        const nodeA = list.first!.next!;
        const nodeB = new DoublyLinkedListNode<number>(3);

        nodeA.replace(nodeB);

        expect(list.size).toBe(3);
        expect(list.first!.next).toBe(nodeB);
        expect(nodeA.isolated).toBe(true);
      });

      it('should replace a node with another one from the same list', (): void => {
        const list = new DoublyLinkedList<number>([0, 1]);

        const nodeA = list.first!;
        const nodeB = list.last!;

        nodeA.replace(nodeB);

        expect(list.size).toBe(1);
        expect(list.first).toBe(nodeB);
        expect(nodeA.isolated).toBe(true);
      });

      it('should prevent replacement if the node is isolated', (): void => {
        const nodeA = new DoublyLinkedListNode<number>(0);
        const nodeB = new DoublyLinkedListNode<number>(1);

        expect(() => nodeA.replace(nodeB)).toThrow();
      });

      it('should skip insertion if the node is replaced by itself', (): void => {
        const list = new DoublyLinkedList<number>([0]);

        const node = list.first!;

        node.replace(node);

        expect(list.first).toBe(node);
        expect(node.isolated).toBe(false);
      });
    });

    describe('replaceWith', (): void => {
      it('should replace a node other nodes', (): void => {
        const list = new DoublyLinkedList<number>([0, 1, 2]);

        const nodeA = list.first!.next!;
        const nodeB = new DoublyLinkedListNode<number>(3);
        const nodeC = new DoublyLinkedListNode<number>(4);

        nodeA.replaceWith(nodeB, nodeC);

        expect(list.size).toBe(4);
        expect(list.first!.next).toBe(nodeB);
        expect(list.first!.next!.next).toBe(nodeC);
        expect(nodeA.isolated).toBe(true);
      });
    });
  });
});
