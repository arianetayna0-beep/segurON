<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>Entregas de EPI</h1>
      <p>Registro de entrega de equipamentos aos funcionários</p>
    </header>

    <div class="card-form">
      <div class="card-header">
        <h2>Nova Entrega</h2>
      </div>

      <div class="main-form">
        <div class="form-row">

          <div class="form-group">
            <label>Funcionário</label>

            <select v-model="form.id_funcionarios" class="custom-select">
              <option value="">
                Selecione o funcionário...
              </option>

              <option v-for="f in funcionarios" :key="f.id_funcionarios" :value="f.id_funcionarios">
                {{ f.nome }} — {{ f.setor }}
              </option>

            </select>
          </div>

          <div class="form-group">
            <label>EPI</label>

            <select v-model="form.id_epi" class="custom-select">
              <option value="">
                Selecione o EPI...
              </option>

              <option v-for="e in epis" :key="e.id_epi" :value="e.id_epi">
                {{ e.nome }}
                (Saldo: {{ estoqueMap[e.id_epi] ?? 0 }})
              </option>

            </select>
          </div>

        </div>

        <div class="form-row cols-3">

          <div class="form-group">
            <label>Quantidade</label>

            <input type="number" v-model.number="form.quantidade_entregue" min="1" />
          </div>

          <div class="form-group">
            <label>Data de Entrega</label>

            <input type="date" v-model="form.data_entrega" />
          </div>

          <div class="form-group checkbox-group">

            <label class="checkbox-label">

              <input type="checkbox" v-model="form.assinatura_digital" />

              Assinatura digital confirmada

            </label>

          </div>

        </div>

        <div class="action-bar">

          <button class="btn btn-primary" @click="registrar"
            :disabled="!form.id_funcionarios || !form.id_epi || loading">
            Registrar Entrega
          </button>

        </div>

        <p class="error-msg" v-if="erro">
          ⚠ {{ erro }}
        </p>

        <p class="success-msg" v-if="ok">
          ✓ Entrega registrada com sucesso!
        </p>

      </div>
    </div>

    <div class="card-table">

      <div class="card-header flex-between">

        <h2>Histórico de Entregas</h2>

        <span class="badge badge-blue">
          {{ entregas.length }} registros
        </span>

      </div>

      <div v-if="loading" class="text-center-loading">
        Carregando dados...
      </div>

      <div v-else class="table-container">

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

            <tr v-for="e in entregas" :key="e.id_entrega">

              <td>

                <div class="text-bold">
                  {{ e.funcionarios?.nome }}
                </div>

                <div class="cargo-text">
                  {{ e.funcionarios?.setor }}
                </div>

              </td>

              <td>

                <div class="text-bold">
                  {{ e.epis?.nome }}
                </div>

                <div class="cargo-text">
                  CA: {{ e.epis?.ca }}
                </div>

              </td>

              <td class="text-bold">
                {{ e.quantidade_entregue }}
              </td>

              <td class="cargo-text">
                {{ formatarData(e.data_entrega) }}
              </td>

              <td>

                <span :class="e.assinatura_digital
                  ? 'badge badge-ok'
                  : 'badge badge-warn'">
                  {{
                    e.assinatura_digital
                      ? 'Confirmada'
                      : 'Pendente'
                  }}
                </span>

              </td>

            </tr>

          </tbody>

        </table>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useSupabase } from '../composables/useSupabase'
import { ref, onMounted } from 'vue'

const { supabase } = useSupabase()

const funcionarios = ref([])
const epis = ref([])
const entregas = ref([])
const estoqueMap = ref({})

const loading = ref(true)
const erro = ref('')
const ok = ref(false)

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

async function carregar() {

  loading.value = true
  erro.value = ''

  try {

    // FUNCIONÁRIOS
    const { data: funcs } = await supabase
      .from('funcionarios')
      .select('*')
      .order('nome')

    funcionarios.value = funcs || []

    // EPIS
    const { data: episData } = await supabase
      .from('epis')
      .select('*')
      .order('nome')

    epis.value = episData || []

    // ESTOQUE
    const { data: estoqueData } = await supabase
      .from('estoque')
      .select('*')

    estoqueMap.value = {}

    estoqueData?.forEach(item => {

      estoqueMap.value[item.id_epi] =
        item.quantidade || 0

    })

    // ENTREGAS
    const { data: entData } = await supabase
      .from('entregas')
      .select(`
        *,
        funcionarios:id_funcionarios(
          nome,
          setor
        ),
        epis:id_epi(
          nome,
          ca
        )
      `)
      .order('created_at', {
        ascending: false
      })

    entregas.value = entData || []

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

  const qtdEstoque =
    estoqueMap.value[form.value.id_epi] ?? 0

  if (
    form.value.quantidade_entregue > qtdEstoque
  ) {

    erro.value =
      `Estoque insuficiente (${qtdEstoque} disponíveis)`

    return
  }

  const payload = {
    id_funcionarios: form.value.id_funcionarios,
    id_epi: form.value.id_epi,
    quantidade_entregue: form.value.quantidade_entregue,
    data_entrega: form.value.data_entrega,
    assinatura_digital: form.value.assinatura_digital
  }

  const { error } = await supabase
    .from('entregas')
    .insert([payload])

  if (error) {

    console.error(error)
    erro.value = error.message
    return

  }

  // Atualiza estoque
  await supabase
    .from('estoque')
    .update({
      quantidade:
        qtdEstoque -
        form.value.quantidade_entregue
    })
    .eq('id_epi', form.value.id_epi)

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
  width: 100%;
  padding: 20px 30px;
  background-color: #ffffff;
  min-height: 100vh;
  box-sizing: border-box;
}

.header-section {
  margin-bottom: 25px;
}

.header-section h1 {
  color: #0f172a;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.card-form,
.card-table {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 24px;
  width: 100%;
  overflow: hidden;
}

.card-header {
  background-color: #f8fafc;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-form {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.cols-3 {
  grid-template-columns: 1fr 1fr 1.2fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
}

input,
.custom-select {
  padding: 9px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.875rem;
}

.btn-primary {
  background: #0f172a;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
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
  padding: 14px 20px;
  text-align: left;
  font-size: 0.75rem;
  color: #475569;
  border-bottom: 2px solid #f1f5f9;
}

.styled-table td {
  padding: 14px 20px;
  border-top: 1px solid #f1f5f9;
  font-size: 0.875rem;
}

.badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.badge-blue {
  background: #e0f2fe;
  color: #0369a1;
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

.cargo-text {
  color: #64748b;
  font-size: 0.8rem;
}

.text-center-loading {
  padding: 40px;
  text-align: center;
}

.error-msg {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 10px;
  font-weight: 600;
}

.success-msg {
  color: #166534;
  font-size: 0.875rem;
  margin-top: 10px;
  font-weight: 600;
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
</style>