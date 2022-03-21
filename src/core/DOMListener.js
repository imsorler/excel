export class DOMListener {
  constructor($root) {
    if (!$root) {
      throw new Error('not root element')
    }
    this.$root = $root
  }
}
