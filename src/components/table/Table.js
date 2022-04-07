import { ExcelComponent } from '../../core/ExcelComponent';
import { createTable } from './table.template';
import { TableSelection } from './TableSelection';
import { shouldResize, isCell } from './table.functions';
import { range } from '../../core/utils';
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
    if (shouldResize(event)) {
      const $resizer = $(event.target)
      const $parent = $resizer.closest('[data-type="resizable"]')
      const coords = $parent.getCords()
      const type = $resizer.data.resize

      $resizer.css({
        opacity: 1,
      })

      const cells = this.$root.findAll(`[data-col="${$parent.data.col}"]`)

      document.onmousemove = (e) => {
        if (type === 'col') {
          const delta = Math.floor(e.pageX - coords.right)
          const value = coords.width + delta

          $parent.css({
            width: value + 'px',
          })

          cells.forEach(el => el.style.width = value + 'px')
        } else {
          const delta = Math.floor(e.pageY - coords.bottom)
          const value = coords.height + delta

          $parent.css({
            height: value + 'px',
          })
        }
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null

        $resizer.css({
          opacity: 0,
        })
      }
    } else if (isCell) {
      const $target = $(event.target)

      if (event.shiftKey) {
        const target = $target.id(true);
        const current = this.selection.current.id(true);

        const cols = range(current.col, target.col);
        const rows = range(current.row, target.row);

        const ids = cols.reduce((acc, col) => {
          rows.forEach(row => acc.push(`${row}:${col}`))
          return acc
        }, [])

        const $cells = ids.map(id => this.$root.find(`[data-id="${id}"]`))
        this.selection.selectGroup($cells)
      } else {
        this.selection.select($target)
      }
    }
  }

  prepare() {
    console.log('prepare');
  }

  init() {
    console.log('init');
    super.init()
    this.selection = new TableSelection()
    const $cell = this.$root.find('[data-id="0:0"]')
    this.selection.select($cell)
  }
}
