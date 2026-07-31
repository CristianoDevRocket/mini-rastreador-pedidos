const STYLES = {
  RECEBIDO: 'bg-blue-100 text-blue-800',
  EM_PREPARO: 'bg-amber-100 text-amber-800',
  SAIU_PARA_ENTREGA: 'bg-purple-100 text-purple-800',
  ENTREGUE: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-800',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STYLES[status]}`}>
      {status.replaceAll('_', ' ')}
    </span>
  )
}
