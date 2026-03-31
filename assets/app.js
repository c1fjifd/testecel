import { supabase } from './supabase.js'

const cadastroStep = document.getElementById('cadastro-step')
const previewStep = document.getElementById('preview-step')
const sucessoStep = document.getElementById('sucesso-step')

const btnIrPreview = document.getElementById('btn-ir-preview')
const btnVoltarForm = document.getElementById('btn-voltar-form')
const btnConcluir = document.getElementById('btn-concluir')
const btnNovoCadastro = document.getElementById('btn-novo-cadastro')

const form = document.getElementById('cadastro-form')

const nomeCompleto = document.getElementById('nomeCompleto')
const cpf = document.getElementById('cpf')
const emailCliente = document.getElementById('emailCliente')
const telefoneCliente = document.getElementById('telefoneCliente')
const cep = document.getElementById('cep')
const rua = document.getElementById('rua')
const numero = document.getElementById('numero')
const complemento = document.getElementById('complemento')
const bairro = document.getElementById('bairro')
const cidade = document.getElementById('cidade')
const estado = document.getElementById('estado')
const pagadorNome = document.getElementById('pagadorNome')
const pagadorEmail = document.getElementById('pagadorEmail')
const confirmacao = document.getElementById('confirmacao')

let protocoloAtual = ''

function valorOuTraco(valor) {
  return valor && valor.trim() ? valor.trim() : '—'
}

function apenasNumeros(valor) {
  return valor.replace(/\D/g, '')
}

function formatarCPF(valor) {
  const numeros = apenasNumeros(valor).slice(0, 11)

  return numeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatarCEP(valor) {
  const numeros = apenasNumeros(valor).slice(0, 8)
  return numeros.replace(/(\d{5})(\d)/, '$1-$2')
}

function formatarTelefone(valor) {
  const numeros = apenasNumeros(valor).slice(0, 11)

  if (numeros.length <= 10) {
    return numeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return numeros
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

function dataAtualBR() {
  return new Date().toLocaleDateString('pt-BR')
}

function gerarProtocolo() {
  const ano = new Date().getFullYear()
  const numeroAleatorio = String(Date.now()).slice(-6)
  return `ART-${ano}-${numeroAleatorio}`
}

function montarEnderecoCompleto() {
  const ruaValor = valorOuTraco(rua.value)
  const numeroValor = numero.value.trim()
  const complementoValor = complemento.value.trim()

  let endereco = ruaValor

  if (numeroValor) {
    endereco += `, ${numeroValor}`
  }

  if (complementoValor) {
    endereco += ` - ${complementoValor}`
  }

  return endereco
}

function mostrarMensagem(texto) {
  alert(texto)
}

function validarFormulario() {
  if (!nomeCompleto.value.trim()) {
    mostrarMensagem('Preencha o nome completo do cliente.')
    nomeCompleto.focus()
    return false
  }

  if (apenasNumeros(cpf.value).length !== 11) {
    mostrarMensagem('Preencha um CPF válido.')
    cpf.focus()
    return false
  }

  if (!emailCliente.value.trim()) {
    mostrarMensagem('Preencha o e-mail do cliente.')
    emailCliente.focus()
    return false
  }

  if (apenasNumeros(telefoneCliente.value).length < 10) {
    mostrarMensagem('Preencha um telefone válido do cliente.')
    telefoneCliente.focus()
    return false
  }

  if (apenasNumeros(cep.value).length !== 8) {
    mostrarMensagem('Preencha um CEP válido.')
    cep.focus()
    return false
  }

  if (!rua.value.trim()) {
    mostrarMensagem('Preencha a rua.')
    rua.focus()
    return false
  }

  if (!numero.value.trim()) {
    mostrarMensagem('Preencha o número do endereço.')
    numero.focus()
    return false
  }

  if (!bairro.value.trim()) {
    mostrarMensagem('Preencha o bairro.')
    bairro.focus()
    return false
  }

  if (!cidade.value.trim()) {
    mostrarMensagem('Preencha a cidade.')
    cidade.focus()
    return false
  }

  if (!estado.value.trim()) {
    mostrarMensagem('Preencha o estado.')
    estado.focus()
    return false
  }

  if (!pagadorNome.value.trim()) {
    mostrarMensagem('Preencha o nome do pagador.')
    pagadorNome.focus()
    return false
  }

  if (!pagadorEmail.value.trim()) {
    mostrarMensagem('Preencha o e-mail do pagador.')
    pagadorEmail.focus()
    return false
  }

  return true
}

function preencherPreview() {
  protocoloAtual = gerarProtocolo()

  document.getElementById('preview-protocolo').textContent = protocoloAtual
  document.getElementById('sucesso-protocolo').textContent = protocoloAtual
  document.getElementById('preview-data').textContent = dataAtualBR()

  document.getElementById('preview-nomeCompleto').textContent = valorOuTraco(nomeCompleto.value)
  document.getElementById('preview-cpf').textContent = valorOuTraco(cpf.value)
  document.getElementById('preview-emailCliente').textContent = valorOuTraco(emailCliente.value)
  document.getElementById('preview-telefoneCliente').textContent = valorOuTraco(telefoneCliente.value)
  document.getElementById('preview-cep').textContent = valorOuTraco(cep.value)
  document.getElementById('preview-estado').textContent = valorOuTraco(estado.value)
  document.getElementById('preview-enderecoCompleto').textContent = montarEnderecoCompleto()
  document.getElementById('preview-bairro').textContent = valorOuTraco(bairro.value)
  document.getElementById('preview-cidade').textContent = valorOuTraco(cidade.value)

  document.getElementById('preview-pagadorNome').textContent = valorOuTraco(pagadorNome.value)
  document.getElementById('preview-pagadorEmail').textContent = valorOuTraco(pagadorEmail.value)
}

function irParaPreview() {
  cadastroStep.classList.add('hidden-step')
  sucessoStep.classList.add('hidden-step')
  previewStep.classList.remove('hidden-step')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function voltarParaFormulario() {
  previewStep.classList.add('hidden-step')
  sucessoStep.classList.add('hidden-step')
  cadastroStep.classList.remove('hidden-step')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function mostrarSucesso() {
  previewStep.classList.add('hidden-step')
  cadastroStep.classList.add('hidden-step')
  sucessoStep.classList.remove('hidden-step')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetarFormulario() {
  form.reset()
  protocoloAtual = ''

  previewStep.classList.add('hidden-step')
  sucessoStep.classList.add('hidden-step')
  cadastroStep.classList.remove('hidden-step')

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function buscarCep(cepLimpo) {
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
    const dados = await resposta.json()

    if (dados.erro) {
      mostrarMensagem('CEP não encontrado.')
      return
    }

    rua.value = dados.logradouro || ''
    bairro.value = dados.bairro || ''
    cidade.value = dados.localidade || ''
    estado.value = dados.uf || ''
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
    mostrarMensagem('Não foi possível buscar o CEP agora.')
  }
}

async function salvarCadastro() {
  const payload = {
    protocolo: protocoloAtual || gerarProtocolo(),
    nome_completo: nomeCompleto.value.trim(),
    cpf: cpf.value.trim(),
    email_cliente: emailCliente.value.trim(),
    telefone_cliente: telefoneCliente.value.trim(),
    cep: cep.value.trim(),
    rua: rua.value.trim(),
    numero: numero.value.trim(),
    complemento: complemento.value.trim(),
    bairro: bairro.value.trim(),
    cidade: cidade.value.trim(),
    estado: estado.value.trim(),
    pagador_nome: pagadorNome.value.trim(),
    pagador_email: pagadorEmail.value.trim()
  }

  const { error } = await supabase
    .from('clientes_cadastro')
    .insert([payload])

  if (error) {
    console.error('Erro ao salvar cadastro:', error)
    throw error
  }

  protocoloAtual = payload.protocolo
  document.getElementById('sucesso-protocolo').textContent = protocoloAtual
}

cpf.addEventListener('input', () => {
  cpf.value = formatarCPF(cpf.value)
})

cep.addEventListener('input', () => {
  cep.value = formatarCEP(cep.value)
})

cep.addEventListener('blur', async () => {
  const cepLimpo = apenasNumeros(cep.value)

  if (cepLimpo.length === 8) {
    await buscarCep(cepLimpo)
  }
})

telefoneCliente.addEventListener('input', () => {
  telefoneCliente.value = formatarTelefone(telefoneCliente.value)
})

btnIrPreview.addEventListener('click', () => {
  if (!validarFormulario()) {
    return
  }

  preencherPreview()
  irParaPreview()
})

btnVoltarForm.addEventListener('click', () => {
  voltarParaFormulario()
})

btnConcluir.addEventListener('click', async () => {
  if (!confirmacao.checked) {
    mostrarMensagem('Confirme que os dados estão corretos para concluir.')
    return
  }

  const textoOriginal = btnConcluir.textContent

  try {
    btnConcluir.disabled = true
    btnConcluir.textContent = 'Salvando...'

    await salvarCadastro()
    mostrarSucesso()
  } catch {
    mostrarMensagem('Erro ao salvar cadastro. Confira as configurações do Supabase e tente novamente.')
  } finally {
    btnConcluir.disabled = false
    btnConcluir.textContent = textoOriginal
  }
})

btnNovoCadastro.addEventListener('click', () => {
  resetarFormulario()
})
