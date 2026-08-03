import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import * as pedidosService from '../services/pedidosService'
import PedidoCard from '../components/PedidoCard'
import PedidoForm from '../components/PedidoForm'
import Logo from '../components/Logo'
import { IconLogout, IconSearch } from '../components/icons'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [buscaId, setBuscaId] = useState('')
  const { logout } = useAuth()

  const pedidosFiltrados = buscaId.trim() === ''
    ? pedidos
    : pedidos.filter((pedido) => String(pedido.id).includes(buscaId.trim()))

  const carregarPedidos = useCallback(async () => {
    const dados = await pedidosService.listarPedidos()
    setPedidos(dados)
  }, [])

  useEffect(() => {
    carregarPedidos().finally(() => setCarregando(false))
  }, [carregarPedidos])

  async function handleCriar(pedido) {
    await pedidosService.criarPedido(pedido)
    await carregarPedidos()
  }

  async function handleAtualizarStatus(id, status) {
    await pedidosService.atualizarStatus(id, status)
    await carregarPedidos()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
        <Logo />
        <button onClick={logout} className="text-sm text-gray-500 flex items-center gap-1.5">
          <IconLogout className="w-4 h-4" />
          Sair
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 flex flex-col gap-6">
        <PedidoForm onCriar={handleCriar} />

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900">Pedidos</h2>
            <div className="relative w-48">
              <IconSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por ID"
                value={buscaId}
                onChange={(e) => setBuscaId(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-1.5 text-sm"
              />
            </div>
          </div>

          {carregando && <p className="text-sm text-gray-500">Carregando...</p>}
          {!carregando && pedidos.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum pedido cadastrado ainda.</p>
          )}
          {!carregando && pedidos.length > 0 && pedidosFiltrados.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum pedido encontrado com esse ID.</p>
          )}
          {pedidosFiltrados.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} onAtualizarStatus={handleAtualizarStatus} />
          ))}
        </section>
      </main>
    </div>
  )
}
