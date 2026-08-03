import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import * as pedidosService from '../services/pedidosService'
import PedidoCard from '../components/PedidoCard'
import PedidoForm from '../components/PedidoForm'
import Logo from '../components/Logo'
import { IconLogout, IconSearch } from '../components/icons'

const TAMANHO_PAGINA = 10

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [pagina, setPagina] = useState(0)
  const [totalPaginas, setTotalPaginas] = useState(0)
  const [carregando, setCarregando] = useState(true)

  const [buscaId, setBuscaId] = useState('')
  const [resultadoBusca, setResultadoBusca] = useState(null)
  const [buscando, setBuscando] = useState(false)
  const [erroBusca, setErroBusca] = useState('')

  const { logout } = useAuth()

  const carregarPagina = useCallback(async (numeroPagina) => {
    setCarregando(true)
    try {
      const resposta = await pedidosService.listarPedidos(numeroPagina, TAMANHO_PAGINA)
      setPedidos(resposta.content)
      setPagina(resposta.page)
      setTotalPaginas(resposta.totalPages)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarPagina(0)
  }, [carregarPagina])

  useEffect(() => {
    if (buscaId.trim() === '') {
      setResultadoBusca(null)
      setErroBusca('')
      return
    }

    const timeout = setTimeout(async () => {
      setBuscando(true)
      setErroBusca('')
      try {
        const pedido = await pedidosService.buscarPedido(buscaId.trim())
        setResultadoBusca(pedido)
      } catch {
        setResultadoBusca(null)
        setErroBusca('Nenhum pedido encontrado com esse ID.')
      } finally {
        setBuscando(false)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [buscaId])

  async function handleCriar(pedido) {
    await pedidosService.criarPedido(pedido)
    setBuscaId('')
    await carregarPagina(0)
  }

  async function handleAtualizarStatus(id, status) {
    await pedidosService.atualizarStatus(id, status)
    if (buscaId.trim() !== '') {
      setResultadoBusca(await pedidosService.buscarPedido(id))
    } else {
      await carregarPagina(pagina)
    }
  }

  const emModoBusca = buscaId.trim() !== ''

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

          {emModoBusca ? (
            <>
              {buscando && <p className="text-sm text-gray-500">Buscando...</p>}
              {erroBusca && <p className="text-sm text-gray-500">{erroBusca}</p>}
              {resultadoBusca && (
                <PedidoCard pedido={resultadoBusca} onAtualizarStatus={handleAtualizarStatus} />
              )}
            </>
          ) : (
            <>
              {carregando && <p className="text-sm text-gray-500">Carregando...</p>}
              {!carregando && pedidos.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum pedido cadastrado ainda.</p>
              )}
              {pedidos.map((pedido) => (
                <PedidoCard key={pedido.id} pedido={pedido} onAtualizarStatus={handleAtualizarStatus} />
              ))}

              {totalPaginas > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => carregarPagina(pagina - 1)}
                    disabled={pagina === 0 || carregando}
                    className="text-sm text-blue-600 disabled:text-gray-300"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-500">
                    Página {pagina + 1} de {totalPaginas}
                  </span>
                  <button
                    onClick={() => carregarPagina(pagina + 1)}
                    disabled={pagina + 1 >= totalPaginas || carregando}
                    className="text-sm text-blue-600 disabled:text-gray-300"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )
}
