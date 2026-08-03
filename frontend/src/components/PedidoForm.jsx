import { useState } from 'react'
import { IconUser, IconMapPin, IconPackage, IconPlus } from './icons'
import { buscarEnderecoPorCep } from '../services/cepService'

const ITEM_VAZIO = { descricao: '', quantidade: 1 }

function formatarCep(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8)
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos
}

export default function PedidoForm({ onCriar }) {
  const [cliente, setCliente] = useState('')
  const [cep, setCep] = useState('')
  const [numero, setNumero] = useState('')
  const [endereco, setEndereco] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erroCep, setErroCep] = useState('')
  const [itens, setItens] = useState([{ ...ITEM_VAZIO }])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function handleCepChange(event) {
    const valorFormatado = formatarCep(event.target.value)
    setCep(valorFormatado)
    setErroCep('')

    const digitos = valorFormatado.replace(/\D/g, '')
    if (digitos.length !== 8) return

    setBuscandoCep(true)
    try {
      const dados = await buscarEnderecoPorCep(digitos)
      setEndereco(`${dados.logradouro}, ${dados.bairro} - ${dados.cidade}/${dados.uf}`)
    } catch {
      setErroCep('CEP não encontrado')
      setEndereco('')
    } finally {
      setBuscandoCep(false)
    }
  }

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
        enderecoEntrega: `${endereco}, nº ${numero} (CEP ${cep})`,
        itens: itens.map((item) => ({ ...item, quantidade: Number(item.quantidade) })),
      })
      setCliente('')
      setCep('')
      setNumero('')
      setEndereco('')
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

      <div className="relative">
        <IconUser className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cliente"
          value={cliente}
          onChange={(e) => setCliente(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative w-32 shrink-0">
          <input
            type="text"
            placeholder="CEP"
            value={cep}
            onChange={handleCepChange}
            required
            className="w-full border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm"
          />
          {buscandoCep && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <input
          type="text"
          placeholder="Número"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
          className="w-24 shrink-0 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <div className="relative flex-1 min-w-[180px]">
          <IconMapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Endereço (preenchido pelo CEP)"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm"
          />
        </div>
      </div>
      {erroCep && <p className="text-sm text-red-600">{erroCep}</p>}

      <div className="flex flex-col gap-2">
        {itens.map((item, index) => (
          <div key={index} className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[140px]">
              <IconPackage className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Item"
                value={item.descricao}
                onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm"
              />
            </div>
            <input
              type="number"
              min="1"
              value={item.quantidade}
              onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
              required
              className="w-20 shrink-0 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
            {itens.length > 1 && (
              <button
                type="button"
                onClick={() => removerItem(index)}
                className="shrink-0 px-2 text-red-600 text-sm"
              >
                Remover
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={adicionarItem}
          className="text-sm text-blue-600 self-start flex items-center gap-1"
        >
          <IconPlus className="w-3.5 h-3.5" />
          Adicionar item
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
