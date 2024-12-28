import { DoublyLinkedList } from './doubly-linked-list.js';

export function doublyLinkedListDebug() {
  // const list = new Set([0, 1, 2]);

  // a.forEach((i) => {
  //   console.log(i);
  //   a.add(i + 4);
  // });

  // list.forEach((i) => {
  //   console.log(i);
  //   list.delete(i);
  //   list.delete(i + 1);
  // });

  const list = new DoublyLinkedList<number>([0, 1, 2]);

  list.forEachNode((node) => {
    console.log(node.value);
    node.next?.remove();
    node.previous?.remove();
    node.remove();
  });

  // const list = new DoublyLinkedList<number>();
  // list.push(0);
  // list.push(1);
  // console.log(list);
}
