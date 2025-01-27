import avg from './avg'

describe('Funcion average', () => {
  it('debe devolver 1 para un array', () => {
    expect(avg([1, 1, 1])).toBe(1)
  })
  it('Debe devolver NAN para un array vacio', () => {
    expect(avg([])).toBe(NaN)
  })
})
