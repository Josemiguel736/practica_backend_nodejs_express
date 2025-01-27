export class Carrito {
  constructor (items = [], price = 0) {
    this.items = []
    this.price = price
    this.totalCheckout = 0
  }

  getTotalItems () {
    return this.items.length
  }

  addItem (item) {
    this.checkItem(item)
    if (!item.name) {
      throw new Error('eee')
    }
    this.items.push(item)
    this.totalCheckout += item.price
  }

  getTotalCheckout () {
    return this.totalCheckout
  }

  removeItem (item) {
    const itemRemove = this.items.findIndex((i) => item.name === i.name)
    delete this.items[itemRemove]
    const newItems = []
    this.items = this.items.forEach(i => {
      if (i !== undefined) { newItems.push(i) }
    })
    this.items = newItems
    return this.items
  }

  checkItem (item) {}
}
