export function removeFromArray<T>(array: Array<T>, element: T): Array<T> {
  return array.filter(a => a != element);
}