import { Users } from './user'
import axios from 'axios'

jest.mock('axios')
describe('User class test', () => {
  let result
  beforeAll(async () => {
    const mockUsers = Array.from({length:10}, () =>({name: "Clementine",age:20 }))
    mockUsers[5].name = "pepe"
    axios.get.mockResolvedValue({data:mockUsers})
    result = await Users.all()
  })
  afterAll(() => {
  })
  it('Al llamar al metodo all devuelva un array de 10 elementos', async () => {
    expect.assertions(1)
    // const result = await Users.all()
    expect(result).toBeArrayOfSize(10)
  })

  it('Al llamar al metodo all el 3 se llama clementina', async () => {
    expect.assertions(1)
    // const result = await Users.all()
    expect(result[2].name).toMatch(/Clementine/)
  })

  it('Al llamar al metodo all el 6 se llama pepe', async () => {
    expect.assertions(1)
    // const result = await Users.all()
    expect(result[5].name).toMatch(/pepe/)
  })
})
