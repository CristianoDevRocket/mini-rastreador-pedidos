export async function buscarEnderecoPorCep(cep) {
  const cepLimpo = cep.replace(/\D/g, '')
  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
  const data = await response.json()

  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  return {
    logradouro: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    uf: data.uf,
  }
}
