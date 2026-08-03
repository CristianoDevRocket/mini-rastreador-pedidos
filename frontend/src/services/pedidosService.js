import api from './api'

export function listarPedidos(page = 0, size = 10) {
  return api.get('/pedidos', { params: { page, size } }).then((res) => res.data)
}

export function buscarPedido(id) {
  return api.get(`/pedidos/${id}`).then((res) => res.data)
}

export function criarPedido({ cliente, enderecoEntrega, itens }) {
  return api.post('/pedidos', { cliente, enderecoEntrega, itens }).then((res) => res.data)
}

export function atualizarStatus(id, status) {
  return api.patch(`/pedidos/${id}/status`, { status }).then((res) => res.data)
}
