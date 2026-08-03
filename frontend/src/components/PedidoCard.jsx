import { useState } from 'react'
import StatusTrilha from './StatusTrilha'
import { TRANSICOES_VALIDAS } from '../constants/statusTransitions'
import { IconUser, IconMapPin, IconPackage } from './icons'

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
      <div>
        <p className="font-semibold text-gray-900 flex items-center gap-1.5">
          <IconUser className="w-4 h-4 text-gray-400" />
          #{pedido.id} — {pedido.cliente}
        </p>
        <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
          <IconMapPin className="w-4 h-4 text-gray-400" />
          {pedido.enderecoEntrega}
        </p>
      </div>

      <ul className="text-sm text-gray-700 flex flex-col gap-1">
        {pedido.itens.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <IconPackage className="w-4 h-4 text-gray-400" />
            {item.quantidade}x {item.descricao}
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-100 pt-3">
        <StatusTrilha status={pedido.status} />
      </div>

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
