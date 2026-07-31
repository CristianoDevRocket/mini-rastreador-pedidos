import { useState } from 'react'

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7-10.5-7-10.5-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path d="M10.6 10.6a2 2 0 002.8 2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M6.6 6.6C4 8.3 1.5 12 1.5 12s4 7 10.5 7c2 0 3.7-.5 5.1-1.2M17.4 17.4C19.5 15.9 22.5 12 22.5 12s-1.2-2.1-3.3-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function PasswordInput({ value, onChange, placeholder, required, minLength }) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="relative">
      <input
        type={visivel ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm"
      />
      <button
        type="button"
        onClick={() => setVisivel((atual) => !atual)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {visivel ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}
