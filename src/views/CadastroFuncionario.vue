<template>
  <div class="layout-container">

    <header class="header-section">
      <h1>Controle de Efetivo</h1>
      <p>Gerencie o cadastro de colaboradores e organize por setores.</p>
    </header> 

    <main class="content">

      <section class="card-form">

        <div class="card-header">
          <h3>
            {{ editandoId ? 'Alterar Registro' : 'Novo Funcionário' }}
          </h3>
        </div>

        <form @submit.prevent="salvar" class="main-form">

          <div class="form-row">

            <div class="form-group">
              <label for="nome">Nome Completo</label>

              <input
                v-model="form.nome"
                type="text"
                id="nome"
                placeholder="Digite o nome"
                required
              >
            </div>

            <div class="form-group">
              <label for="matricula">Nº Matrícula</label>

              <input
                v-model="form.matricula"
                type="text"
                id="matricula"
                placeholder="Ex: 5542"
                required
              >
            </div>

          </div>

          <div class="form-row">

            <div class="form-group">
              <label for="setor">Setor</label>

              <input
                v-model="form.setor"
                type="text"
                id="setor"
                placeholder="Ex: Manutenção"
                required
              >
            </div>

            <div class="form-group">
              <label for="cargo">Cargo</label>

              <input
                v-model="form.cargo"
                type="text"
                id="cargo"
                placeholder="Ex: Pedreiro"
                required
              >
            </div>

          </div>

          <div class="action-bar">

            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ editandoId ? 'Atualizar Dados' : 'Finalizar Cadastro' }}
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
              <th>Colaborador</th>
              <th>Matrícula</th>
              <th>Setor / Cargo</th>
              <th class="text-center">Gerenciar</th>
            </tr>
          </thead>

          <tbody>

            <tr
              v-for="f in funcionarios"
              :key="f.id_funcionarios"
            >

              <td>
                <span class="text-bold">
                  {{ f.nome }}
                </span>
              </td>

              <td>
                {{ f.matricula }}
              </td>

              <td>
                <span class="badge">
                  {{ f.setor }}
                </span>

                <span class="cargo-text">
                  {{ f.cargo }}
                </span>
              </td>

              <td class="text-center">

                <button
                  @click="prepararEdicao(f)"
                  class="btn-action edit"
                >
                  Editar
                </button>

                <button
                  @click="excluir(f.id_funcionarios)"
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

const funcionarios = ref([])

const editandoId = ref(null)

const form = reactive({
  nome: '',
  matricula: '',
  setor: '',
  cargo: ''
})

const carregar = async () => {

  const { data, error } = await supabase
    .from('funcionarios')
    .select('*')
    .order('nome')

  console.log('DATA:', data)
  console.log('ERROR:', error)

  if (error) {

    console.error(error.message)

  } else {

    funcionarios.value = data || []

  }
}

const salvar = async () => {

  if (editandoId.value) {

    const { error } = await supabase
      .from('funcionarios')
      .update(form)
      .eq('id_funcionarios', editandoId.value)

    if (error) {
      console.error(error.message)
      return
    }

  } else {

    const { error } = await supabase
      .from('funcionarios')
      .insert([form])

    if (error) {
      console.error(error.message)
      return
    }
  }

  cancelarEdicao()

  await carregar()
}

const prepararEdicao = (f) => {

  editandoId.value = f.id_funcionarios

  Object.assign(form, {
    nome: f.nome,
    matricula: f.matricula,
    setor: f.setor,
    cargo: f.cargo
  })
}

const excluir = async (id) => {

  if (confirm('Deseja realmente remover este registro?')) {

    const { error } = await supabase
      .from('funcionarios')
      .delete()
      .eq('id_funcionarios', id)

    if (error) {
      console.error(error.message)
      return
    }

    await carregar()
  }
}

const cancelarEdicao = () => {

  editandoId.value = null

  Object.assign(form, {
    nome: '',
    matricula: '',
    setor: '',
    cargo: ''
  })
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
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

input,
select {
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
}

input:focus,
select:focus {
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

.badge {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 700;
  margin-right: 8px;
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

.cargo-text {
  color: #64748b;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>