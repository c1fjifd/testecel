import { supabase } from './supabase.js'

const loading = document.getElementById('loading')
const listaCadastros = document.getElementById('lista-cadastros')
const busca = document.getElementById('busca')
const btnLogout = document.getElementById('btn-logout')
const detalhesCard = document.getElementById('detalhes-card')
const btnFecharDetalhes = document.getElementById('btn-fechar-detalhes')

let todosCadastros = []

function valorOuTraco(valor) {
  return valor && String(valor).trim() ? String(valor).trim() : '—'
}

function formatarData(dataIso) {
  if (!dataIso) return '—'

  return new Date(dataIso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function preencherResumo(cadastros) {
  document.getElementById('total-cadastros').textContent = String(cadastros.length)
  document.getElementById('ultimo-protocolo').textContent = cadastros[0]?.protocolo || '—'
}

function preencherDetalhes(cadastro) {
  document.getElementById('d-protocolo').textContent = valorOuTraco(cadastro.protocolo)
  document.getElementById('d-nome').textContent = valorOuTraco(cadastro.nome_completo)
  document.getElementById('d-cpf').textContent = valorOuTraco(cadastro.cpf)
  document.getElementById('d-email-cliente').textContent = valorOuTraco(cadastro.email_cliente)
  document.getElementById('d-cep').textContent = valorOuTraco(cadastro.cep)
  document.getElementById('d-rua').textContent = valorOuTraco(cadastro.rua)
  document.getElementById('d-numero').textContent = valorOuTraco(cadastro.numero)
  document.getElementById('d-complemento').textContent = valorOuTraco(cadastro.complemento)
  document.getElementById('d-bairro').textContent = valorOuTraco(cadastro.bairro)
  document.getElementById('d-cidade').textContent = valorOuTraco(cadastro.cidade)
  document.getElementById('d-estado').textContent = valorOuTraco(cadastro.estado)
  document.getElementById('d-created-at').textContent = formatarData(cadastro.created_at)

  document.getElementById('d-pagador-nome').textContent = valorOuTraco(cadastro.pagador_nome)
  document.getElementById('d-pagador-email').textContent = valorOuTraco(cadastro.pagador_email)
  document.getElementById('d-pagador-telefone').textContent = valorOuTraco(cadastro.pagador_telefone)

  detalhesCard.classList.remove('hidden')
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
}

function renderizarLista(cadastros) {
  listaCadastros.innerHTML = ''

  if (!cadastros.length) {
    listaCadastros.innerHTML = `
      <div class="rounded-[24px] border border-white/10 bg-white/3 p-5 text-sm text-white/60">
        Nenhum cadastro encontrado.
      </div>
    `
    return
  }

  cadastros.forEach((cadastro) => {
    const card = document.createElement('button')
    card.type = 'button'
    card.className = 'card-hover w-full rounded-[24px] border border-white/10 bg-white/3 p-5 text-left'

    card.innerHTML = `
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <p class="text-[11px] uppercase tracking-[0.2em] text-white/40">${valorOuTraco(cadastro.protocolo)}</p>
          <h3 class="text-lg font-semibold text-white">${valorOuTraco(cadastro.nome_completo)}</h3>
          <p class="text-sm text-white/60">${valorOuTraco(cadastro.email_cliente)}</p>
        </div>

        <div class="grid grid-cols-1 gap-2 text-sm text-white/70 sm:grid-cols-3 lg:text-right">
          <div>
            <p class="text-white/35">CPF</p>
            <p class="mt-1">${valorOuTraco(cadastro.cpf)}</p>
          </div>
          <div>
            <p class="text-white/35">Telefone</p>
            <p class="mt-1">${valorOuTraco(cadastro.pagador_telefone)}</p>
          </div>
          <div>
            <p class="text-white/35">Criado em</p>
            <p class="mt-1">${formatarData(cadastro.created_at)}</p>
          </div>
        </div>
      </div>
    `

    card.addEventListener('click', () => preencherDetalhes(cadastro))
    listaCadastros.appendChild(card)
  })
}

function filtrarCadastros() {
  const termo = busca.value.trim().toLowerCase()

  if (!termo) {
    renderizarLista(todosCadastros)
    return
  }

  const filtrados = todosCadastros.filter((cadastro) => {
    return [
      cadastro.protocolo,
      cadastro.nome_completo,
      cadastro.cpf,
      cadastro.email_cliente,
      cadastro.pagador_nome,
      cadastro.pagador_email,
      cadastro.pagador_telefone
    ]
      .filter(Boolean)
      .some((campo) => String(campo).toLowerCase().includes(termo))
  })

  renderizarLista(filtrados)
}

async function garantirSessao() {
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    window.location.href = 'login.html'
    return false
  }

  return true
}

async function carregarCadastros() {
  loading.textContent = 'Carregando cadastros...'

  const { data, error } = await supabase
    .from('clientes_cadastro')
    .select('*')
    .order('created_at', { ascending: false })

  loading.remove()

  if (error) {
    console.error(error)
    listaCadastros.innerHTML = `
      <div class="rounded-[24px] border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
        Não foi possível carregar os cadastros.
      </div>
    `
    return
  }

  todosCadastros = data || []
  preencherResumo(todosCadastros)
  renderizarLista(todosCadastros)
}

btnLogout.addEventListener('click', async () => {
  await supabase.auth.signOut()
  window.location.href = 'login.html'
})

btnFecharDetalhes.addEventListener('click', () => {
  detalhesCard.classList.add('hidden')
})

busca.addEventListener('input', filtrarCadastros)

const autorizado = await garantirSessao()
if (autorizado) {
  await carregarCadastros()
}
