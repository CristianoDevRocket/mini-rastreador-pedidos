import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import * as pedidosService from '../services/pedidosService'
import PedidoCard from '../components/PedidoCard'
import PedidoForm from '../components/PedidoForm'

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const { logout } = useAuth()

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
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Rastreador de Pedidos</h1>
        <button onClick={logout} className="text-sm text-gray-500">Sair</button>
      </header>

      <main className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
        <PedidoForm onCriar={handleCriar} />

        <section className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-900">Pedidos</h2>
          {carregando && <p className="text-sm text-gray-500">Carregando...</p>}
          {!carregando && pedidos.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum pedido cadastrado ainda.</p>
          )}
          {pedidos.map((pedido) => (
            <PedidoCard key={pedido.id} pedido={pedido} onAtualizarStatus={handleAtualizarStatus} />
          ))}
        </section>
      </main>
    </div>
  )
}
