import { ExcelComponent } from '../../core/ExcelComponent';
import { createTable } from './table.template';
import { $ } from '../../core/DOM'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown'],
    })
  }

  toHTML() {
    return createTable(25)
  }

  onMousedown(event) {
    if (event.target.dataset.resize) {
      const $resizer = $(event.target)
      const $parent = $resizer.closest('[data-type="resizable"]')
      const coords = $parent.getCords()
      const type = $resizer.data.resize

      console.log(type);

      const cells = this.$root.findAll(`[data-col="${$parent.data.col}"]`)

      document.onmousemove = (e) => {
        if (type === 'col') {
          const delta = Math.floor(e.pageX - coords.right)
          const value = coords.width + delta
  
          $parent.$el.style.width = value + 'px'
          cells.forEach(el => el.style.width = value + 'px')
        } else {
          const delta = Math.floor(e.pageY - coords.bottom)
          const value = coords.height + delta

          $parent.$el.style.height = value + 'px'
        }
      }

      document.onmouseup = () => {
        document.onmousemove = null
      }
    }
  }
}
