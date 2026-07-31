export default function Logo({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 7l9-4 9 4-9 4-9-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M3 7v10l9 4 9-4V7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M12 11v10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span className="font-semibold text-gray-900 text-lg">Rastreador de Pedidos</span>
    </div>
  )
}
