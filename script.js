// Dados e configurações
let transactions = [];
let selectedMonth = '2024-01';

const categories = {
    expense: [
        { value: 'alimentacao', label: 'Alimentação', color: '#ef4444' },
        { value: 'lazer', label: 'Lazer', color: '#8b5cf6' },
        { value: 'contas', label: 'Contas', color: '#f59e0b' },
        { value: 'transporte', label: 'Transporte', color: '#06b6d4' },
        { value: 'saude', label: 'Saúde', color: '#10b981' },
        { value: 'educacao', label: 'Educação', color: '#3b82f6' },
        { value: 'outros', label: 'Outros', color: '#6b7280' }
    ],
    income: [
        { value: 'salario', label: 'Salário', color: '#22c55e' },
        { value: 'freelance', label: 'Freelance', color: '#84cc16' },
        { value: 'investimentos', label: 'Investimentos', color: '#eab308' },
        { value: 'outros', label: 'Outros', color: '#06b6d4' }
    ]
};

// Elementos DOM
const monthSelect = document.getElementById('monthSelect');
const themeToggle = document.getElementById('themeToggle');
const addTransactionBtn = document.getElementById('addTransactionBtn');
const transactionModal = document.getElementById('transactionModal');
const closeModal = document.getElementById('closeModal');
const transactionForm = document.getElementById('transactionForm');
const transactionType = document.getElementById('transactionType');
const transactionCategory = document.getElementById('transactionCategory');
const pieChart = document.getElementById('pieChart');
const chartLegend = document.getElementById('chartLegend');
const noDataMessage = document.getElementById('noDataMessage');
const transactionsList = document.getElementById('transactionsList');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Set mês atual
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    monthSelect.value = currentMonth;
    selectedMonth = currentMonth;

    loadTheme();
    setupEventListeners();
    updateCategoryOptions();
    loadTransactions();
});

function handleFormSubmit(e) {
    e.preventDefault();

    const type = transactionType.value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const category = transactionCategory.value;
    const description = document.getElementById('transactionDescription').value;
    const date = new Date().toISOString().split('T')[0];

    if (!amount || !category || !description) {
        alert('Preencha todos os campos!');
        return;
    }

    const formData = new FormData();
    formData.append('tipo', type);
    formData.append('valor', amount);
    formData.append('categoria', category);
    formData.append('descricao', description);
    formData.append('data', date);
    formData.append('mes', selectedMonth);

    fetch('salvar_transacao.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        closeModalHandler();
        loadTransactions(); // recarrega após salvar
    });
}


function loadTransactions() {
    fetch(`carregar_transacoes.php?mes=${selectedMonth}`)
        .then(res => res.json())
        .then(data => {
            transactions = data.map(t => ({
                id: t.id,
                type: t.tipo,
                amount: parseFloat(t.valor),
                category: t.categoria,
                description: t.descricao,
                date: t.data,
                month: t.mes
            }));
            updateDisplay();
        });
}


// Carregar transações do back-end
function loadTransactions() {
    fetch(`carregar_transacoes.php?mes=${selectedMonth}`)
        .then(res => res.json())
        .then(data => {
            transactions = data.map(t => ({
                id: t.id,
                type: t.tipo,
                amount: parseFloat(t.valor),
                category: t.categoria,
                description: t.descricao,
                date: t.data,
                month: t.mes
            }));
            updateDisplay();
        })
        .catch(() => {
            transactions = [];
            updateDisplay();
        });
}

// Enviar nova transação para back-end
function handleFormSubmit(e) {
    e.preventDefault();

    const type = transactionType.value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const category = transactionCategory.value;
    const description = document.getElementById('transactionDescription').value;
    const date = new Date().toISOString().split('T')[0];

    if (!amount || !category || !description) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    const formData = new FormData();
    formData.append('tipo', type);
    formData.append('valor', amount);
    formData.append('categoria', category);
    formData.append('descricao', description);
    formData.append('data', date);
    formData.append('mes', selectedMonth);

    fetch('salvar_transacao.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        closeModalHandler();
        loadTransactions();
    })
    .catch(() => alert('Erro ao salvar transação.'));
}

// Excluir transação no back-end
function deleteTransaction(id) {
    if (!confirm("Deseja excluir esta transação?")) return;

    const formData = new FormData();
    formData.append('id', id);

    fetch('deletar_transacao.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        loadTransactions();
    })
    .catch(() => alert('Erro ao deletar transação.'));
}

// Event Listeners
function setupEventListeners() {
    monthSelect.addEventListener('change', function() {
        selectedMonth = this.value;
        loadTransactions();
    });

    themeToggle.addEventListener('click', toggleTheme);
    addTransactionBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalHandler);
    transactionForm.addEventListener('submit', handleFormSubmit);
    transactionType.addEventListener('change', updateCategoryOptions);

    // Fechar modal clicando fora
    transactionModal.addEventListener('click', function(e) {
        if (e.target === transactionModal) {
            closeModalHandler();
        }
    });
}

// Tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Modal
function openModal() {
    transactionModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModalHandler() {
    transactionModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    transactionForm.reset();
}

// Atualizar opções de categoria
function updateCategoryOptions() {
    const type = transactionType.value;
    const categorySelect = transactionCategory;

    categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';

    categories[type].forEach(category => {
        const option = document.createElement('option');
        option.value = category.value;
        option.textContent = category.label;
        categorySelect.appendChild(option);
    });
}

// Atualizar display
function updateDisplay() {
    updateSummaryCards();
    updateChart();
    updateTransactionsList();
}

// Cards resumo
function updateSummaryCards() {
    const monthTransactions = transactions.filter(t => t.month === selectedMonth);

    const totalIncome = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    document.getElementById('totalIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);

    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = formatCurrency(balance);
    balanceElement.className = `amount ${balance >= 0 ? 'income' : 'expense'}`;
}

// Gráfico pizza
function updateChart() {
    const monthTransactions = transactions.filter(t => t.month === selectedMonth);
    const expenses = monthTransactions.filter(t => t.type === 'expense');

    if (expenses.length === 0) {
        pieChart.style.display = 'none';
        chartLegend.style.display = 'none';
        noDataMessage.style.display = 'block';
        return;
    }

    pieChart.style.display = 'block';
    chartLegend.style.display = 'grid';
    noDataMessage.style.display = 'none';

    const expensesByCategory = {};
    expenses.forEach(expense => {
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
    });

    const chartData = Object.entries(expensesByCategory).map(([category, amount]) => {
        const categoryInfo = categories.expense.find(c => c.value === category);
        return {
            label: categoryInfo?.label || category,
            value: amount,
            color: categoryInfo?.color || '#6b7280'
        };
    });

    drawPieChart(chartData);
    updateChartLegend(chartData);
}

function drawPieChart(data) {
    const canvas = pieChart;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (data.length === 0) return;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -Math.PI / 2;

    data.forEach(item => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        const textAngle = currentAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
        const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

        const percentage = ((item.value / total) * 100).toFixed(1);
        if (parseFloat(percentage) > 5) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${percentage}%`, textX, textY);
        }

        currentAngle += sliceAngle;
    });
}

function updateChartLegend(data) {
    chartLegend.innerHTML = '';

    data.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${item.color}"></div>
            <span>${item.label}</span>
        `;

        chartLegend.appendChild(legendItem);
    });
}

// Lista de transações
function updateTransactionsList() {
    const monthTransactions = transactions.filter(t => t.month === selectedMonth);

    if (monthTransactions.length === 0) {
        transactionsList.innerHTML = '<div class="no-transactions">Nenhuma transação registrada neste mês</div>';
        return;
    }

    monthTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    transactionsList.innerHTML = '';

    monthTransactions.forEach(transaction => {
        const categoryInfo = categories[transaction.type].find(c => c.value === transaction.category);
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';

        transactionElement.innerHTML = `
            <div class="transaction-info">
                <div class="transaction-color" style="background-color: ${categoryInfo?.color || '#6b7280'}"></div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <div class="transaction-meta">
                        <span class="transaction-category">${categoryInfo?.label || transaction.category}</span>
                        <span class="transaction-date">${formatDate(transaction.date)}</span>
                    </div>
                </div>
            </div>
            <div class="transaction-actions">
                <span class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
                </span>
                <button class="delete-btn" onclick="deleteTransaction('${transaction.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        transactionsList.appendChild(transactionElement);
    });
}

// Utilitários
function formatCurrency(amount) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}
