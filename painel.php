<?php
session_start();
if (!isset($_SESSION['usuario_id'])) {
    header('Location: login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel de Finanças Pessoais</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <div class="header-title">
                    <h1>Painel de Finanças Pessoais</h1>
                    <p>Gerencie seus ganhos e gastos</p>
                </div>
                <div class="header-controls">
                    <select id="monthSelect" class="month-select">
                        <option value="2024-01">Janeiro 2024</option>
                        <option value="2024-02">Fevereiro 2024</option>
                        <option value="2024-03">Março 2024</option>
                        <option value="2024-04">Abril 2024</option>
                        <option value="2024-05">Maio 2024</option>
                        <option value="2024-06">Junho 2024</option>
                        <option value="2024-07">Julho 2024</option>
                        <option value="2024-08">Agosto 2024</option>
                        <option value="2024-09">Setembro 2024</option>
                        <option value="2024-10">Outubro 2024</option>
                        <option value="2024-11">Novembro 2024</option>
                        <option value="2024-12">Dezembro 2024</option>
                    </select>
                    <button id="themeToggle" class="theme-toggle">
                        <i class="fas fa-moon"></i>
                    </button>
                </div>
            </div>
        </header>

        <!-- Summary Cards -->
        <div class="summary-cards">
            <div class="card income-card">
                <div class="card-header">
                    <span class="card-title">Receitas</span>
                    <i class="fas fa-trending-up"></i>
                </div>
                <div class="card-content">
                    <span id="totalIncome" class="amount income">R$ 0,00</span>
                </div>
            </div>

            <div class="card expense-card">
                <div class="card-header">
                    <span class="card-title">Despesas</span>
                    <i class="fas fa-trending-down"></i>
                </div>
                <div class="card-content">
                    <span id="totalExpenses" class="amount expense">R$ 0,00</span>
                </div>
            </div>

            <div class="card balance-card">
                <div class="card-header">
                    <span class="card-title">Saldo</span>
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="card-content">
                    <span id="balance" class="amount">R$ 0,00</span>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <!-- Chart Section -->
            <div class="card chart-card">
                <div class="card-header">
                    <h3>Gastos por Categoria</h3>
                    <p>Distribuição dos seus gastos no mês selecionado</p>
                </div>
                <div class="card-content">
                    <div class="chart-container">
                        <canvas id="pieChart" width="300" height="300"></canvas>
                        <div id="chartLegend" class="chart-legend"></div>
                    </div>
                    <div id="noDataMessage" class="no-data" style="display: none;">
                        Nenhum gasto registrado neste mês
                    </div>
                </div>
            </div>

            <!-- Transactions Section -->
            <div class="card transactions-card">
                <div class="card-header">
                    <div>
                        <h3>Transações</h3>
                        <p>Suas transações do mês selecionado</p>
                    </div>
                    <button id="addTransactionBtn" class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        Adicionar
                    </button>
                </div>
                <div class="card-content">
                    <div id="transactionsList" class="transactions-list">
                        <div class="no-transactions">
                            Nenhuma transação registrada neste mês
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div id="transactionModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Nova Transação</h3>
                <button id="closeModal" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="transactionForm" class="modal-body">
                <div class="form-group">
                    <label for="transactionType">Tipo</label>
                    <select id="transactionType" required>
                        <option value="expense">Despesa</option>
                        <option value="income">Receita</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="transactionAmount">Valor</label>
                    <input type="number" id="transactionAmount" step="0.01" placeholder="0,00" required>
                </div>

                <div class="form-group">
                    <label for="transactionCategory">Categoria</label>
                    <select id="transactionCategory" required>
                        <option value="">Selecione uma categoria</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="transactionDescription">Descrição</label>
                    <input type="text" id="transactionDescription" placeholder="Descrição da transação" required>
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>