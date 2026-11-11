        // Global Chart JS Configuration for Dark Mode
        Chart.defaults.color = '#8A91A5'; 
        Chart.defaults.font.family = "'Montserrat', sans-serif";
        const gridLinesColor = 'rgba(255, 255, 255, 0.05)';

        // 1. Data Setup
        const labelsSemester = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        const mockIncome = [8000, 8000, 8000, 8000, 8000, 8000];
        const mockExpenses = [4100, 4300, 4200, 4500, 4100, 4100];
        const mockSavings = mockIncome.map((inc, i) => inc - mockExpenses[i]); 

        const expenseCategories = [
            { name: 'Vivienda', amount: 1000, color: '#FF007A' },        // Pink
            { name: 'Universidad', amount: 1000, color: '#00F0FF' },     // Cyan
            { name: 'Familiar / Salidas', amount: 600, color: '#FFE600' },// Yellow
            { name: 'Alimentación', amount: 500, color: '#B52AFF' },     // Purple
            { name: 'Servicios Básicos', amount: 500, color: '#FF6B00' },// Orange
            { name: 'Otros (Movilidad, etc.)', amount: 500, color: '#00FFA3' } // Mint
        ];

        const recentTransactions = [
            { date: '10 Nov', desc: 'Alquiler Departamento', cat: 'Vivienda', amount: 1000, status: 'Completado', color: '#FF007A' },
            { date: '08 Nov', desc: 'Mensualidad Universidad', cat: 'Universidad', amount: 1000, status: 'Completado', color: '#00F0FF' },
            { date: '07 Nov', desc: 'Cena Familiar de Fin de Semana', cat: 'Familiar / Salidas', amount: 350, status: 'Completado', color: '#FFE600' },
            { date: '05 Nov', desc: 'Supermercado', cat: 'Alimentación', amount: 450, status: 'Completado', color: '#B52AFF' },
            { date: '01 Nov', desc: 'Recibo de Luz y Agua', cat: 'Servicios Básicos', amount: 250, status: 'Completado', color: '#FF6B00' },
            { date: '28 Oct', desc: 'Gasolina y Uber', cat: 'Otros (Movilidad, etc.)', amount: 120, status: 'Completado', color: '#00FFA3' }
        ];

        // Populate Table
        const tbody = document.getElementById('table-body');
        if(tbody) {
            recentTransactions.forEach(tx => {
                const tr = document.createElement('tr');
                const statusStyle = tx.status === 'Completado' ? 'color: var(--c-cyan); font-weight:500;' : 'color: var(--text-muted);';
                tr.innerHTML = `
                    <td>${tx.date}</td>
                    <td style="color: var(--text-light);">${tx.desc}</td>
                    <td><i class="fa-solid fa-circle" style="color:${tx.color}; font-size:0.6rem; margin-right:8px; filter: drop-shadow(0 0 5px ${tx.color});"></i> ${tx.cat}</td>
                    <td class="amount-col">S/ ${tx.amount.toFixed(2)}</td>
                    <td style="${statusStyle} font-size: 0.85rem;">${tx.status}</td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Poblar la Tabla Completa de la vista "Presupuesto"
        const fullBudgetTbody = document.getElementById('full-budget-table-body');
        if(fullBudgetTbody) {
            const totalGastos = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
            
            expenseCategories.forEach(cat => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><i class="fa-solid fa-circle" style="color:${cat.color}; font-size:0.7rem; margin-right:10px; filter: drop-shadow(0 0 5px ${cat.color});"></i> <span style="font-weight:500;">${cat.name}</span></td>
                    <td><div style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; width: 100%; overflow:hidden;"><div style="background: ${cat.color}; box-shadow: 0 0 10px ${cat.color}; height: 100%; border-radius: 5px; width: ${(cat.amount/totalGastos)*100}%;"></div></div></td>
                    <td class="amount-col" style="color:${cat.color}; font-weight:600;">S/ ${cat.amount.toFixed(2)}</td>
                `;
                fullBudgetTbody.appendChild(tr);
            });
        }

        // --- Lógica de Navegación del Menú (Tabs) ---
        const navItems = document.querySelectorAll('.nav-item[data-target]');
        const viewSections = document.querySelectorAll('.view-section');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                viewSections.forEach(view => view.classList.remove('active'));
                item.classList.add('active');
                const targetId = item.getAttribute('data-target');
                if(targetId) {
                    document.getElementById(targetId).classList.add('active');
                }
            });
        });

        // --- Chart 1: Line Chart (Savings Trend) ---
        const ctxLineEl = document.getElementById('savingsLineChart');
        if(ctxLineEl) {
            const ctxLine = ctxLineEl.getContext('2d');
            const gradLine = ctxLine.createLinearGradient(0, 0, 0, 400);
            gradLine.addColorStop(0, 'rgba(255, 230, 0, 0.4)');
            gradLine.addColorStop(1, 'rgba(255, 230, 0, 0.0)');

            new Chart(ctxLine, {
                type: 'line',
                data: {
                    labels: labelsSemester,
                    datasets: [{
                        label: 'Ahorro Neto',
                        data: mockSavings,
                        borderColor: '#FFE600',
                        backgroundColor: gradLine,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: '#FFE600',
                        pointBorderColor: '#fff',
                        pointRadius: 5,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: gridLinesColor }, beginAtZero: false, suggestedMin: 2000, suggestedMax: 4500 }
                    }
                }
            });
        }

        // --- Chart 2: Bar Chart (Income vs Expense) ---
        const ctxBarEl = document.getElementById('incomeExpenseBarChart');
        if(ctxBarEl) {
            const ctxBar = ctxBarEl.getContext('2d');
            new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: labelsSemester,
                    datasets: [
                        {
                            label: 'Ingresos',
                            data: mockIncome,
                            backgroundColor: '#00F0FF',
                            borderRadius: 4,
                            barPercentage: 0.6,
                            categoryPercentage: 0.4
                        },
                        {
                            label: 'Gastos',
                            data: mockExpenses,
                            backgroundColor: '#FF007A',
                            borderRadius: 4,
                            barPercentage: 0.6,
                            categoryPercentage: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { 
                            position: 'top', 
                            align: 'end',
                            labels: { boxWidth: 10, usePointStyle: true, color: '#FFFFFF' }
                        } 
                    },
                    scales: {
                        x: { grid: { display: false }, stacked: false },
                        y: { grid: { color: gridLinesColor }, beginAtZero: true }
                    }
                }
            });
        }

        // --- Chart 3: Doughnut Chart (Expense Distribution) ---
        const ctxPieEl = document.getElementById('expensesDoughnutChart');
        if(ctxPieEl) {
            const ctxPie = ctxPieEl.getContext('2d');
            new Chart(ctxPie, {
                type: 'doughnut',
                data: {
                    labels: expenseCategories.map(c => c.name),
                    datasets: [{
                        data: expenseCategories.map(c => c.amount),
                        backgroundColor: expenseCategories.map(c => c.color),
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { 
                            position: 'right',
                            labels: {
                                color: '#FFFFFF',
                                usePointStyle: true,
                                boxWidth: 8,
                                padding: 15,
                                font: { size: 11 }
                            }
                        }
                    },
                    layout: { padding: 10 }
                }
            });
        }