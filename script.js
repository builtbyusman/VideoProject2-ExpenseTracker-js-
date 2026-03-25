document.addEventListener('DOMContentLoaded', () => {
    const expenseForm = document.getElementById('expense-form');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const amountInput = document.getElementById('amount');
    const expenseChart = document.getElementById('expense-chart');

    let selectMonth;
    let selectYear;
    let myChart;

    //generate year option dynamically
    for (let year = 2020; year <= 2040; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    //initialize expense object with categories
    const expense = {
        January: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        Febraury: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        March: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        April: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        May: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        June: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        July: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        August: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        September: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        October: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        November: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },
        December: { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 },

    };

    //load expense
    function getExpenseFromLocalStorage(month, year) {
        const key = `${month}--${year}`;
        return JSON.parse(localStorage.getItem(key)) || {};
    }

    //save expense
    function saveExpenseToLocalStorage(month, year) {
        const key = `${month}--${year}`;
        localStorage.setItem(key, JSON.stringify(expense[month]));
    }

    //get selected month and year
    function getSelectedMonthYear() {
        selectMonth = monthSelect.value;
        selectYear = yearSelect.value;

        if (!selectMonth || !selectYear) {
            alert('Month or year not Selected');
            return;
        }

        if (!expense[selectMonth]) {
            expense[selectMonth] = { Housing: 0, Food: 0, Transportation: 0, Bills: 0, Miscellaneous: 0 };
        }
    }
    //update chart
    function updateChart() {
        getSelectedMonthYear();

        const expenseData = getExpenseFromLocalStorage(selectMonth, selectYear);
        Object.assign(expense[selectMonth], expenseData)

        const ctx = expenseChart.getContext('2d');

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(expense[selectMonth]),
                datasets: [{
                    data: Object.values(expense[selectMonth]),
                    backgroundColor: [
                        "#FF6384",//housing
                        "#4CAF50",//food
                        "#FFCE56",//transportation
                        "#36A2EB",//bills
                        "#FF9F40"//miscellaneous
                    ],
                }]
            },
            options: {
                responsive: true,
                Plugins: {
                    legend: {
                        display: true,
                        position: "top",
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: $${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });
    }
    //handle form submission
    function handleSubmission(event) {
        event.preventDefault();
        getSelectedMonthYear();

        const category = event.target.category.value;
        const amount = parseFloat(event.target.amount.value);


        const currentAmount = expense[selectMonth][category] || 0;

        if (amount > 0) {
            expense[selectMonth][category] = currentAmount + amount;
        } else if (amount < 0 && currentAmount >= Math.abs(amount)) {
            expense[selectMonth][category] = currentAmount + amount;
        } else {
            alert('Invalid amount: Cannot reduce the Category below zero.');
        }

        saveExpenseToLocalStorage(selectMonth, selectYear);
        updateChart();
        amountInput.value = "";
    }

    expenseForm.addEventListener('submit', handleSubmission);
    monthSelect.addEventListener('change', updateChart);
    yearSelect.addEventListener('change', updateChart);

    //set default month and year based on currebt month and year
    function setDefaultMonthYear() {
        const now = new Date();
        const initialMonth = now.toLocaleString('default', { month: 'long' });
        const initialYear = now.getFullYear();
        monthSelect.value = initialMonth;
        yearSelect.value = initialYear;
    }

    setDefaultMonthYear();
    updateChart();
});

