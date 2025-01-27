import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com/'

export class Users {
  static all () {
    return axios.get(`${BASE_URL}users`).then(res => res.data)
  }

  static create (user) {
    return axios.post(`${BASE_URL}users`, user)
  }
}
