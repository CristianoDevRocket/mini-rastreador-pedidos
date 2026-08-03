import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authService from '../services/authService'
import Logo from '../components/Logo'
import PasswordInput from '../components/PasswordInput'

export default function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setEnviando(true)

    try {
      await authService.register({ nome, email, senha })
      navigate('/login')
    } catch (error) {
      setErro(error.response?.data?.message ?? 'Não foi possível criar a conta')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3">
        <Logo className="mb-2" />
        <h1 className="text-xl font-semibold text-gray-900">Criar conta</h1>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <PasswordInput
          placeholder="Senha (mínimo 6 caracteres)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          minLength={6}
        />

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="bg-blue-600 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
        >
          {enviando ? 'Criando...' : 'Criar conta'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Já tem conta? <Link to="/login" className="text-blue-600">Entrar</Link>
        </p>
      </form>
    </div>
  )
}
