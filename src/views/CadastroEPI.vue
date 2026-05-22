<template>
  <div class="layout-container">

    <header class="header-section">
      <h1>Cadastro de EPIs</h1>
      <p>Gerencie o catálogo de Equipamentos de Proteção Individual e C.A.</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
        </div>

        <form @submit.prevent="salvar" class="main-form">

          <div class="form-row">
            <div class="form-group">
              <label>Nome do EPI</label>
              <input
                v-model="form.nome"
                type="text"
                placeholder="Ex: Capacete de Segurança"
                required
              >
            </div>

            <div class="form-group">
              <label>Número do C.A.</label>
              <input
                v-model="form.ca"
                type="text"
                placeholder="Ex: 12345"
                required
              >
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label>Descrição / Especificações</label>
            <input
              v-model="form.descricao"
              type="text"
              placeholder="Ex: Classe B, com jugular"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Validade</label>
              <input
                v-model="form.validade"
                type="date"
              >
            </div>

            <div class="form-group">
              <label>Quantidade em Estoque</label>
              <input
                v-model.number="form.quantidade"
                type="number"
                min="0"
              >
            </div>
          </div>

          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Salvar Alterações' : 'Cadastrar EPI' }}
            </button>

            <button
              v-if="editandoId"
              type="button"
              @click="cancelarEdicao"
              class="btn btn-outline"
            >
              Cancelar
            </button>
          </div>

        </form>
      </section>

      <section class="card-table">
        <table class="styled-table">

          <thead>
            <tr>
              <th>Equipamento</th>
              <th>C.A.</th>
              <th>Descrição</th>
              <th>Validade</th>
              <th>Estoque</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="e in epis" :key="e.id_epi">

              <td>
                <span class="text-bold">
                  {{ e.nome }}
                </span>
              </td>

              <td>
                <span class="badge-ca">
                  {{ e.ca }}
                </span>
              </td>

              <td>
                {{ e.descricao }}
              </td>

              <td>
                {{ formatarData(e.validade) }}
              </td>

              <td>
                {{ e.quantidade }}
              </td>

              <td class="text-center">
                <button
                  @click="prepararEdicao(e)"
                  class="btn-action edit"
                >
                  Editar
                </button>

                <button
                  @click="excluir(e.id_epi)"
                  class="btn-action delete"
                >
                  Excluir
                </button>
              </td>

            </tr>
          </tbody>

        </table>
      </section>
    </main>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()

const epis = ref([])
const editandoId = ref(null)

const form = reactive({
  nome: '',
  ca: '',
  descricao: '',
  validade: '',
  quantidade: 0
})

const carregar = async () => {
  const { data, error } = await supabase
    .from('epis')
    .select('*')
    .order('nome')

  if (!error) {
    epis.value = data || []
  }
}

const salvar = async () => {

  if (editandoId.value) {

    await supabase
      .from('epis')
      .update(form)
      .eq('id_epi', editandoId.value)

  } else {

    await supabase
      .from('epis')
      .insert([form])

  }

  cancelarEdicao()
  carregar()
}

const prepararEdicao = (e) => {

  editandoId.value = e.id_epi

  Object.assign(form, {
    nome: e.nome,
    ca: e.ca,
    descricao: e.descricao,
    validade: e.validade,
    quantidade: e.quantidade
  })
}

const excluir = async (id) => {

  if (confirm('Deseja excluir este equipamento?')) {

    await supabase
      .from('epis')
      .delete()
      .eq('id_epi', id)

    carregar()
  }
}

const cancelarEdicao = () => {

  editandoId.value = null

  Object.assign(form, {
    nome: '',
    ca: '',
    descricao: '',
    validade: '',
    quantidade: 0
  })
}

const formatarData = (data) => {

  if (!data) return '-'

  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

onMounted(carregar)
</script>

<style scoped>
.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: sans-serif;
}

.header-section {
  margin-bottom: 25px;
}

.header-section h1 {
  font-size: 1.8rem;
  color: #0f172a;
  margin-bottom: 6px;
}

.header-section p {
  color: #64748b;
}

.card-form,
.card-table {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-bottom: 25px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  overflow: hidden;
}

.card-header {
  background: #f1f5f9;
  padding: 12px 20px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: bold;
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

input {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

input:focus {
  outline: none;
  border-color: #2563eb;
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
  background: #2563eb;
  color: white;
}

.btn-outline {
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
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

.badge-ca {
  background: #fee2e2;
  color: #991b1b;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: bold;
}

.btn-action {
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.edit {
  color: #2563eb;
  margin-right: 10px;
}

.delete {
  color: #be123c;
}

.text-bold {
  font-weight: 600;
}

.text-center {
  text-align: center;
}
</style>