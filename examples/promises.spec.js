import { succesfullRequest, failedRequest } from './promises.js'

describe('Async / Await style', () => {
  it('debe devolver un codigo 200', async () => {
    expect.assertions(1)
    const response = await succesfullRequest()
    expect(response.status).toBe(200)
  })
},
it('debe devolver un cofigo 403', async () => {
  expect.assertions(1)
  try {
    await failedRequest()
  } catch (error) {
    expect(error.response.status).toBe(403)
  }
})
)

describe('Calback Style', () => {
  it('Debe devolver un codigo 200 cuando llamamos a la funcion', (done) => {
    expect.assertions(1)
    succesfullRequest().then((res) => {
      expect(res.status).toBe(200)
      done()
    })
  })

  it('devolver 403', (done) => {
    expect.assertions(2)
    failedRequest().catch(error => {
      expect(error.message).toMatch(/403/)
      expect(error.status).toBe(403)
      done()
    })
  }, 10000) // Podemos configurar un timeout personalizado por defecto son 5 segundos
})

describe('promise style', () => {
  it('debe devolver un codigo 200', () => {
    expect.assertions(1)
    return succesfullRequest().then((response) => {
      expect(response.status).toBe(200)
    })
  })

  it('debe devolver un codigo 403', () => {
    expect.assertions(1)
    return failedRequest().catch((error) => {
      expect(error.status).toBe(403)
    })
  })
})
