import { Carrito } from './carrito.js'

describe('Testing class carrito', () => {
  const sushiItem = { name: 'sushiItem', price: 10 }
  const waterItem = { name: ' WaterItem ', price: 1.5 }

  describe('testeando getTotalItems y addItems', () => {
    let carrito
    beforeAll(() => {
      carrito = new Carrito()
    })
    it('Carrio debe tener una funcion getTotalItems que devuelva 0 en su inicializacion', () => {
      expect(carrito.getTotalItems()).toBe(0)
    })

    it('Carrio getTotalItems tiene que devolver 1 despues de añadir un elemento al carrito', () => {
      carrito.addItem({ name: 'Cosa' })
      expect(carrito.getTotalItems()).toBe(1)
    })

    it('Carrio getTotalItems tiene que devolver un error despues de añadir un elemento no valido al carrito', () => {
      expect(() => {
        carrito.addItem(1)
      }).toThrow()
    })
  })

  describe('Testeando getTotalCheckout', () => {
    let carrito
    beforeEach(() => {
      carrito = new Carrito()
    })
    it('Debe devolver 10 despues de añadir un sushiItem', () => {
      carrito.addItem(sushiItem)
      expect(carrito.getTotalCheckout()).toEqual(10)
    })

    it('Debe devolver 20 despues de añadir dos sushiItem', () => {
      carrito.addItem(sushiItem)
      carrito.addItem(sushiItem)
      expect(carrito.getTotalCheckout()).toEqual(20)
    })

    it('Debe devolver 11,50 despues de añadir un sushiItem y un waterItem', () => {
      carrito.addItem(sushiItem)
      carrito.addItem(waterItem)
      expect(carrito.getTotalCheckout()).toEqual(11.5)
    })

    it('Debe devolver 0 despues de añadir un sushiItem y un waterItem', () => {
      carrito.addItem(sushiItem)
      carrito.addItem(waterItem)
      expect(carrito.getTotalCheckout()).toEqual(11.5)
    })
  })

  describe('Testeando addiItems array', () => {
    let carrito
    beforeEach(() => {
      carrito = new Carrito()
    })
    it('Debe contener el item añadido en la propiedad carrito.items', () => {
      carrito.addItem(sushiItem)
      expect(carrito.items).toContain(sushiItem)
    })

    it('carrito.items debe debe de serr un array vacio si no se ha añadido ningun elemento', () => {
      expect(carrito.items).toBeEmpty()
    })

    it('Carrito debe llamar a una funcion checkItem antes de añadirlo', () => {
      const spy = jest.spyOn(carrito, 'checkItem')
      carrito.addItem(sushiItem)
      expect(spy).toHaveBeenCalled()
    })
    it('Carrito debe llamar aolo una vez a checkItem ', () => {
      const spy = jest.spyOn(carrito, 'checkItem')
      carrito.addItem(sushiItem)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('Carrito debe llamar a checkItem con el valor del item', () => {
      const spy = jest.spyOn(carrito, 'checkItem')
      carrito.addItem(sushiItem)
      expect(spy).toHaveBeenCalledWith(sushiItem)
    })
  })

  describe('Testeando removeItems', () => {
    let carrito
    beforeEach(() => {
      carrito = new Carrito()
    })
    it('Debe devolver un array vacio despues de añadir un elemento y eliminarlo', () => {
      carrito.addItem(sushiItem)
      expect(carrito.removeItem(sushiItem)).toBeEmpty()
    })
    it('Debe devolver un array con un elemento despues de añadir dos elementos y eliminar uno', () => {
      carrito.addItem(sushiItem)
      carrito.addItem(waterItem)
      expect(carrito.removeItem(sushiItem)).toHaveLength(1)
    })

    it('Debe devolver un array con un elemento despues de añadir dos elementos iguales y un tercero distintoy eliminar uno de los iguales', () => {
      carrito.addItem(sushiItem)
      carrito.addItem(sushiItem)
      carrito.addItem(waterItem)
      expect(carrito.removeItem(sushiItem)).toHaveLength(2)
    })
  })
})
