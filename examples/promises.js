import axios from 'axios'

const BASE_URL = 'https://httpbin.org'

export function succesfullRequest () {
  return axios.get(`${BASE_URL}/status/200`)
}

export function failedRequest () {
  return axios.get(`${BASE_URL}/status/403`)
}
