import { useState } from 'react'

const ITEM_VAZIO = { descricao: '', quantidade: 1 }

export default function PedidoForm({ onCriar }) {
  const [cliente, setCliente] = useState('')
  const [enderecoEntrega, setEnderecoEntrega] = useState('')
  const [itens, setItens] = useState([{ ...ITEM_VAZIO }])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  function atualizarItem(index, campo, valor) {
    setItens((atuais) =>
      atuais.map((item, i) => (i === index ? { ...item, [campo]: valor } : item))
    )
  }

  function adicionarItem() {
    setItens((atuais) => [...atuais, { ...ITEM_VAZIO }])
  }

  function removerItem(index) {
    setItens((atuais) => atuais.filter((_, i) => i !== index))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      await onCriar({
        cliente,
        enderecoEntrega,
        itens: itens.map((item) => ({ ...item, quantidade: Number(item.quantidade) })),
      })
      setCliente('')
      setEnderecoEntrega('')
      setItens([{ ...ITEM_VAZIO }])
    } catch (error) {
      console.error('Falha ao criar pedido', error)
      setErro(error.response?.data?.message ?? 'Não foi possível criar o pedido. Verifique os dados e tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col gap-3">
      <h2 className="font-semibold text-gray-900">Novo pedido</h2>

      <input
        type="text"
        placeholder="Cliente"
        value={cliente}
        onChange={(e) => setCliente(e.target.value)}
        required
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
      />
      <input
        type="text"
        placeholder="Endereço de entrega"
        value={enderecoEntrega}
        onChange={(e) => setEnderecoEntrega(e.target.value)}
        required
        className="border border-gray-300 rounded-md px-3 py-2 text-sm"
      />

      <div className="flex flex-col gap-2">
        {itens.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Item"
              value={item.descricao}
              onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
              required
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="number"
              min="1"
              value={item.quantidade}
              onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
              required
              className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {itens.length > 1 && (
              <button
                type="button"
                onClick={() => removerItem(index)}
                className="px-2 text-red-600 text-sm"
              >
                Remover
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={adicionarItem}
          className="text-sm text-blue-600 self-start"
        >
          + Adicionar item
        </button>
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="bg-blue-600 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
      >
        {enviando ? 'Criando...' : 'Criar pedido'}
      </button>
    </form>
  )
}
