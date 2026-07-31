import { useState } from 'react'
import StatusBadge from './StatusBadge'
import { TRANSICOES_VALIDAS } from '../constants/statusTransitions'

export default function PedidoCard({ pedido, onAtualizarStatus }) {
  const [atualizando, setAtualizando] = useState(false)
  const proximosStatus = TRANSICOES_VALIDAS[pedido.status]

  async function handleChange(event) {
    const novoStatus = event.target.value
    if (!novoStatus) return

    setAtualizando(true)
    try {
      await onAtualizarStatus(pedido.id, novoStatus)
    } finally {
      setAtualizando(false)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3 bg-white shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-900">#{pedido.id} — {pedido.cliente}</p>
          <p className="text-sm text-gray-500">{pedido.enderecoEntrega}</p>
        </div>
        <StatusBadge status={pedido.status} />
      </div>

      <ul className="text-sm text-gray-700 list-disc list-inside">
        {pedido.itens.map((item, index) => (
          <li key={index}>{item.quantidade}x {item.descricao}</li>
        ))}
      </ul>

      {proximosStatus.length > 0 && (
        <select
          onChange={handleChange}
          disabled={atualizando}
          defaultValue=""
          className="border border-gray-300 rounded-md px-2 py-1 text-sm disabled:opacity-50"
        >
          <option value="" disabled>Atualizar status...</option>
          {proximosStatus.map((status) => (
            <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>
          ))}
        </select>
      )}
    </div>
  )
}
