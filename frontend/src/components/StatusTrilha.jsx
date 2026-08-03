import { IconClipboard, IconChefHat, IconTruck, IconCheckCircle, IconXCircle } from './icons'

const ETAPAS = [
  { status: 'RECEBIDO', label: 'Recebido', Icon: IconClipboard },
  { status: 'EM_PREPARO', label: 'Em preparo', Icon: IconChefHat },
  { status: 'SAIU_PARA_ENTREGA', label: 'Saiu p/ entrega', Icon: IconTruck },
  { status: 'ENTREGUE', label: 'Entregue', Icon: IconCheckCircle },
]

export default function StatusTrilha({ status }) {
  if (status === 'CANCELADO') {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium py-2">
        <IconXCircle className="w-5 h-5" />
        Pedido cancelado
      </div>
    )
  }

  const etapaAtualIndex = ETAPAS.findIndex((etapa) => etapa.status === status)

  return (
    <div className="overflow-x-auto">
      <div className="flex items-start min-w-[280px]">
        {ETAPAS.map((etapa, index) => {
          const concluida = index < etapaAtualIndex
          const atual = index === etapaAtualIndex
          const { Icon } = etapa

          return (
            <div key={etapa.status} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1 w-16 sm:w-20">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${
                    concluida
                      ? 'bg-green-500 border-green-500 text-white'
                      : atual
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-gray-300 text-gray-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] text-center leading-tight ${
                    atual ? 'text-blue-600 font-medium' : concluida ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {etapa.label}
                </span>
              </div>

              {index < ETAPAS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 mb-4 ${concluida ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
