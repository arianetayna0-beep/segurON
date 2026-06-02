<template>
  <div class="layout-container">

    <main class="content">

      <section class="card-form">
        <div class="card-header">
          <h3>{{ activeTab === 'entrega' ? 'Nova Entrega' : 'Nova Devolução' }}</h3>
          <button type="button" class="btn btn-outline btn-tab"
            @click="activeTab = activeTab === 'entrega' ? 'devolucao' : 'entrega'">
            {{ activeTab === 'entrega' ? 'DEVOLUÇÃO' : 'ENTREGA' }}
          </button>
        </div>

        <form @submit.prevent="registrar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label for="funcionario">Funcionário</label>
              <select id="funcionario" v-model="form.id_funcionarios" class="custom-select" required>
                <option value="">Selecione o funcionário...</option>
                <option v-for="f in funcionarios" :key="f.id_funcionarios" :value="f.id_funcionarios">
                  {{ f.nome }} — {{ f.setor }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="epi">EPI</label>
              <select id="epi" v-model="form.id_epi" class="custom-select" required>
                <option value="">Selecione o EPI...</option>
                <option v-for="e in epis" :key="e.id_epi" :value="e.id_epi">
                  {{ e.nome }} (Saldo: {{ estoqueMap[e.id_epi] ?? 0 }})
                </option>
              </select>
            </div>
          </div>

          <div class="form-row cols-3">
            <div class="form-group">
              <label for="quantidade">Quantidade</label>
              <input id="quantidade" type="number" v-model.number="form.quantidade_entregue" min="1" required />
            </div>

            <div class="form-group">
              <label for="data_entrega">Data de Entrega</label>
              <input id="data_entrega" type="date" v-model="form.data_entrega" required />
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.assinatura_digital" />
                Assinatura digital confirmada
              </label>
            </div>
          </div>

          <div class="action-bar">
            <button type="submit" class="btn btn-primary" :disabled="!form.id_funcionarios || !form.id_epi || loading">
              {{ activeTab === 'entrega' ? 'Registrar Entrega' : 'Registrar Devolução' }}
            </button>
          </div>

          <p class="error-text" v-if="erro">⚠ {{ erro }}</p>
          <p class="status-text" v-if="ok">{{ successMessage }}</p>
        </form>
      </section>

      <section class="card-table">
        <div class="card-header flex-between">
          <h2>{{ activeTab === 'entrega' ? 'Histórico de Entregas' : 'Histórico de Devoluções' }}</h2>
          <span class="badge badge-blue">{{ viewRecords.length }} registros</span>
        </div>

        <div class="status-bar">
          <p v-if="loading" class="status-text">
            Carregando {{ activeTab === 'entrega' ? 'entregas' : 'devoluções' }}...
          </p>
          <p v-else-if="erro" class="error-text">{{ erro }}</p>
          <p v-else-if="!loading && viewRecords.length === 0" class="status-text">
            Nenhuma {{ activeTab === 'entrega' ? 'entrega' : 'devolução' }} registrada.
          </p>
        </div>

        <div class="table-container" v-if="!loading && viewRecords.length > 0">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Funcionário</th>
                <th>EPI</th>
                <th>Qtd</th>
                <th>Data</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in viewRecords" :key="item.id_entrega || item.id || item.id_devolucao">
                <td>
                  <span class="text-bold">{{ item.funcionarios?.nome }}</span>
                  <div class="cargo-text">{{ item.funcionarios?.setor }}</div>
                </td>
                <td>
                  <span class="text-bold">{{ item.epis?.nome }}</span>
                  <div class="cargo-text">CA: {{ item.epis?.ca }}</div>
                </td>
                <td class="text-bold">{{ item.quantidade_entregue }}</td>
                <td class="cargo-text">{{ formatarData(item.data_entrega) }}</td>
                <td>
                  <span :class="item.assinatura_digital ? 'badge badge-ok' : 'badge badge-warn'">
                    {{ item.assinatura_digital ? 'Confirmada' : 'Pendente' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useSupabase } from '../composables/useSupabase'
import { ref, computed, onMounted } from 'vue'

const { supabase } = useSupabase()

const activeTab = ref('entrega')
const funcionarios = ref([])
const epis = ref([])
const entregas = ref([])
const devolucoes = ref([])
const estoqueMap = ref({})

const loading = ref(true)
const erro = ref('')
const ok = ref(false)

const viewRecords = computed(() => activeTab.value === 'entrega' ? entregas.value : devolucoes.value)
const successMessage = computed(() => activeTab.value === 'entrega'
  ? '✓ Entrega registrada com sucesso!'
  : '✓ Devolução registrada com sucesso!'
)

const hoje = new Date()
  .toISOString()
  .slice(0, 10)

const form = ref({
  id_funcionarios: '',
  id_epi: '',
  quantidade_entregue: 1,
  data_entrega: hoje,
  assinatura_digital: false
})

function mapRecords(data) {
  const funcionariosMap = Object.fromEntries(
    funcionarios.value.map(f => [f.id_funcionarios, f])
  )

  const episMap = Object.fromEntries(
    epis.value.map(e => [e.id_epi, e])
  )

  return data.map(item => ({
    ...item,
    funcionarios: funcionariosMap[item.id_funcionarios] || null,
    epis: episMap[item.id_epi] || null
  }))
}

async function carregarDevolucoes() {
  const { data: devolucaoData, error: devolucaoError } = await supabase
    .from('devolucoes')
    .select('*')
    .order('created_at', { ascending: false })

  if (devolucaoError) {
    console.error(devolucaoError)
    devolucoes.value = []
    return
  }

  devolucoes.value = devolucaoData?.length ? mapRecords(devolucaoData) : []
}

async function carregar() {
  loading.value = true
  erro.value = ''

  try {
    const { data: funcs } = await supabase
      .from('funcionarios')
      .select('*')
      .order('nome')

    funcionarios.value = funcs || []

    const { data: episData } = await supabase
      .from('epis')
      .select('*')
      .order('nome')

    epis.value = episData || []

    const { data: estoqueData } = await supabase
      .from('estoque')
      .select('*')

    estoqueMap.value = {}

    estoqueData?.forEach(item => {
      estoqueMap.value[item.id_epi] = item.quantidade || 0
    })

    const { data: entData, error: entError } = await supabase
      .from('entregas')
      .select('*')
      .order('created_at', { ascending: false })

    if (entError) {
      console.error(entError)
      throw entError
    }

    entregas.value = entData?.length ? mapRecords(entData) : []
    await carregarDevolucoes()
  } catch (e) {
    console.error(e)
    erro.value = e.message
  } finally {
    loading.value = false
  }
}

async function registrar() {
  erro.value = ''
  ok.value = false

  const qtdEstoque = estoqueMap.value[form.value.id_epi] ?? 0
  const quantidade = form.value.quantidade_entregue

  const payload = {
    id_funcionarios: form.value.id_funcionarios,
    id_epi: form.value.id_epi,
    quantidade_entregue: quantidade,
    data_entrega: form.value.data_entrega,
    assinatura_digital: form.value.assinatura_digital
  }

  if (activeTab.value === 'entrega') {
    if (quantidade > qtdEstoque) {
      erro.value = `Estoque insuficiente (${qtdEstoque} disponíveis)`
      return
    }

    const { error } = await supabase.from('entregas').insert([payload])
    if (error) {
      console.error(error)
      erro.value = error.message
      return
    }

    await supabase
      .from('estoque')
      .update({ quantidade: qtdEstoque - quantidade })
      .eq('id_epi', form.value.id_epi)
  } else {
    const { error } = await supabase.from('devolucoes').insert([payload])
    if (error) {
      console.error(error)
      erro.value = error.message
      return
    }

    await supabase
      .from('estoque')
      .update({ quantidade: qtdEstoque + quantidade })
      .eq('id_epi', form.value.id_epi)
  }

  ok.value = true
  form.value = {
    id_funcionarios: '',
    id_epi: '',
    quantidade_entregue: 1,
    data_entrega: hoje,
    assinatura_digital: false
  }

  await carregar()
}

function formatarData(d) {
  if (!d) return '—'

  const [y, m, dia] = d.split('-')
  return `${dia}/${m}/${y}`
}

onMounted(carregar)
</script>

<style scoped>
.layout-container {
  /* width: 100%;
  padding: 2rem 10rem;
  background: #f8fafc;
  min-height: 100vh;
  box-sizing: border-box; */

  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  min-height: 100vh;
  font-family: sans-serif;

}

.header-section {
  margin-bottom: 25px;
}

.header-section h1 {
  font-size: 1.8rem;
  color: #000000;
  margin-bottom: 6px;
}

.header-section p {
  color: #64748b;
}

main.content {
  display: grid;
  gap: 25px;
}

.card-form,
.card-table {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-bottom: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  background: #f1f5f9;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-tab {
  min-width: 140px;
  padding: 8px 14px;
  font-size: 0.85rem;
}

.status-bar {
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.status-text {
  margin: 0;
  color: #475569;
}

.error-text {
  margin: 0;
  color: #b91c1c;
  font-weight: 600;
}

.main-form {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

/* .cols-3 {
  grid-template-columns: 1fr 1fr 1.2fr;
} */

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
}

input,
select,
.custom-select {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

input:focus,
select:focus,
.custom-select:focus {
  outline: none;
  border-color: #1c5c03;
}

.action-bar {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  font-weight: bold;
}

.btn-primary {
  background: #1c5c03;
  color: white;
}

.btn-outline {
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table th {
  background: #f8fafc;
  padding: 12px 20px;
  text-align: left;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 2px solid #e2e8f0;
}

.styled-table td {
  padding: 12px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
}

.badge {
  background: #dbeafe;
  color: #1c5c03;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  margin-right: 8px;
}

.badge-ok {
  background: #dcfce7;
  color: #166534;
}

.badge-warn {
  background: #fef9c3;
  color: #854d0e;
}

.text-bold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}

.cargo-text {
  color: #64748b;
}

.checkbox-group {
  justify-content: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  color: #334155;
  font-weight: 600;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>