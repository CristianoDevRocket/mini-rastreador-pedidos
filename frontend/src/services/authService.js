import api from './api'

export function register({ nome, email, senha }) {
  return api.post('/auth/register', { nome, email, senha }).then((res) => res.data)
}

export function login({ email, senha }) {
  return api.post('/auth/login', { email, senha }).then((res) => res.data)
}
