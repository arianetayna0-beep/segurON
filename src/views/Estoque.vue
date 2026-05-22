<template>
    <div class="layout-container">

        <header class="header-section flex-between">
            <div>
                <h1>Controle de Estoque</h1>
                <p>Gerencie o saldo e a disponibilidade de cada EPI.</p>
            </div>

            <button class="btn btn-outline flex-center" @click="carregar" :disabled="loading">
                Atualizar
            </button>
        </header>

        <div class="card-form">
            <div class="card-header">
                <h2>Ajustar Quantidade</h2>
            </div>

            <div class="main-form">

                <div class="form-row">

                    <div class="form-group">
                        <label>EPI</label>

                        <select v-model="form.epi_id" class="custom-select">
                            <option value="">
                                Selecione um EPI...
                            </option>

                            <option v-for="item in estoque" :key="item.id_epi" :value="item.id_epi">
                                {{ item.nome }} (Atual: {{ item.quantidade }})
                            </option>

                        </select>
                    </div>

                    <div class="form-group">
                        <label>Nova Quantidade em Estoque</label>

                        <input type="number" v-model.number="form.quantidade" min="0" placeholder="0">
                    </div>

                </div>

                <div class="action-bar">
                    <button class="btn btn-primary" @click="atualizar" :disabled="!form.epi_id || loading">
                        Salvar Alteração
                    </button>
                </div>

                <p class="error-msg" v-if="erro">
                    ⚠ {{ erro }}
                </p>

                <p class="success-msg" v-if="ok">
                    ✓ Estoque atualizado com sucesso!
                </p>

            </div>
        </div>

        <div class="card-table">

            <div class="card-header flex-between">
                <h2>Itens em Estoque</h2>

                <span class="badge badge-blue">
                    {{ estoque.length }} itens catalogados
                </span>
            </div>

            <div v-if="loading" class="text-center" style="padding: 40px;">
                Carregando estoque...
            </div>

            <div v-else class="table-container">

                <table class="styled-table">

                    <thead>
                        <tr>
                            <th>EPI</th>
                            <th>C.A.</th>
                            <th>Descrição</th>
                            <th>Validade</th>
                            <th>Quantidade</th>
                            <th class="text-center">Situação</th>
                        </tr>
                    </thead>

                    <tbody>

                        <tr v-for="item in estoque" :key="item.id_epi">

                            <td>
                                <div class="text-bold">
                                    {{ item.nome }}
                                </div>
                            </td>

                            <td>
                                {{ item.ca }}
                            </td>

                            <td class="cargo-text">
                                {{ item.descricao || '—' }}
                            </td>

                            <td>
                                {{ formatarData(item.validade) }}
                            </td>

                            <td>
                                <span class="text-bold estoque-numero">
                                    {{ item.quantidade }}
                                </span>
                            </td>

                            <td class="text-center">

                                <span :class="badgeClass(item.quantidade)">

                                    {{
                                        item.quantidade === 0
                                            ? 'Sem estoque'
                                            : item.quantidade < 10 ? 'Estoque baixo' : 'Estoque OK' }} </span>

                            </td>

                        </tr>

                        <tr v-if="estoque.length === 0">
                            <td colspan="6" class="text-center cargo-text" style="padding: 40px;">
                                Nenhum item encontrado no estoque.
                            </td>
                        </tr>

                    </tbody>

                </table>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()

const estoque = ref([])
const loading = ref(true)
const erro = ref('')
const ok = ref(false)

const form = ref({
    epi_id: '',
    quantidade: 0
})

async function carregar() {

    loading.value = true
    erro.value = ''

    const { data, error } = await supabase
        .from('epis')
        .select('*')
        .order('nome')

    if (error) {

        erro.value = error.message

    } else {

        estoque.value = data || []

    }

    loading.value = false
}

async function atualizar() {

    erro.value = ''
    ok.value = false

    const { error } = await supabase
        .from('epis')
        .update({
            quantidade: form.value.quantidade
        })
        .eq('id_epi', form.value.epi_id)

    if (error) {

        erro.value = error.message
        return

    }

    ok.value = true

    form.value = {
        epi_id: '',
        quantidade: 0
    }

    await carregar()

    setTimeout(() => {
        ok.value = false
    }, 3000)
}

function badgeClass(qtd) {

    if (qtd === 0) {
        return 'badge badge-danger'
    }

    if (qtd < 10) {
        return 'badge badge-warn'
    }

    return 'badge badge-ok'
}

function formatarData(data) {

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
    padding: 20px;
    background: #ffffff;
    min-height: 100vh;
    font-family: sans-serif;
}

.header-section {
    margin-bottom: 20px;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-section h1 {
    margin: 0;
    font-size: 1.8rem;
    color: #0f172a;
}

.header-section p {
    margin-top: 5px;
    color: #64748b;
}

.card-form,
.card-table {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card-header {
    background: #f8fafc;
    padding: 14px 20px;
    border-bottom: 1px solid #e2e8f0;
}

.main-form {
    padding: 20px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
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
    margin-top: 20px;
}

.btn {
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 700;
}

.btn-primary {
    background: #2563eb;
    color: white;
}

.btn-outline {
    background: white;
    color: #334155;
    border: 1px solid #cbd5e1;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.table-container {
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
    text-transform: uppercase;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
}

.styled-table td {
    padding: 14px 20px;
    border-top: 1px solid #f1f5f9;
    font-size: 0.9rem;
}

.text-bold {
    font-weight: 700;
}

.cargo-text {
    color: #64748b;
}

.estoque-numero {
    font-family: monospace;
    font-size: 1.1rem;
}

.text-center {
    text-align: center;
}

.badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.72rem;
    font-weight: 700;
}

.badge-blue {
    background: #dbeafe;
    color: #1d4ed8;
}

.badge-ok {
    background: #dcfce7;
    color: #166534;
}

.badge-warn {
    background: #fef3c7;
    color: #92400e;
}

.badge-danger {
    background: #fee2e2;
    color: #991b1b;
}

.error-msg {
    color: #dc2626;
    margin-top: 15px;
    font-weight: 600;
}

.success-msg {
    color: #166534;
    margin-top: 15px;
    font-weight: 600;
}
</style>