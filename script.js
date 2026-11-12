
// =====================================
// FINTRACK — PERSONAL FINANCE MANAGER
// =====================================

// 1. APPLICATION STATE

const STORAGE_KEY = "fintrack_transactions_v1";

let transactions = loadTransactions();

const $ = (id) => document.getElementById(id);


// 2. LOAD DATA FROM LOCAL STORAGE

function loadTransactions() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        return Array.isArray(saved) ? saved : [];

    } catch (error) {
        console.error("Unable to load transactions:", error);
        return [];
    }
}


// 3. SAVE DATA

function saveTransactions() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
    );

    renderDashboard();
}


// 4. HELPER FUNCTIONS

function formatMoney(amount) {

    return "₹" + Number(amount).toLocaleString(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    );

}


function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


function getCurrentMonth() {

    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0")
    ].join("-");

}


// 5. DISPLAY CURRENT DATE

$("today").textContent = new Date().toLocaleDateString(
    "en-IN",
    {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }
);


// 6. MODAL CONTROLS

$("addBtn").addEventListener("click", () => {

    $("form").reset();

    $("date").value = new Date().toLocaleDateString("en-CA");

    $("modal").showModal();

});


$("close").addEventListener("click", () => {

    $("modal").close();

});


// 7. ADD TRANSACTION

$("form").addEventListener("submit", function(event) {

    event.preventDefault();

    const description = $("desc").value.trim();

    const amount = Number($("amount").value);

    const type = $("type").value;

    const category = $("category").value;

    const date = $("date").value;


    if (!description || !date || !Number.isFinite(amount) || amount <= 0) {

        alert("Please enter valid transaction details.");

        return;

    }


    const transaction = {

        id: crypto.randomUUID(),

        desc: description,

        amount: amount,

        type: type,

        category: category,

        date: date,

        createdAt: Date.now()

    };


    transactions.unshift(transaction);

    saveTransactions();

    $("form").reset();

    $("modal").close();

});


// 8. DELETE TRANSACTION

function deleteTransaction(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;


    transactions = transactions.filter(
        transaction => transaction.id !== id
    );


    saveTransactions();

}


// 9. CALCULATE FINANCIAL SUMMARY

function calculateSummary() {

    const month = getCurrentMonth();

    const monthlyTransactions = transactions.filter(
        transaction => transaction.date.startsWith(month)
    );


    const income = monthlyTransactions

        .filter(transaction => transaction.type === "Income")

        .reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);


    const expenses = monthlyTransactions

        .filter(transaction => transaction.type === "Expense")

        .reduce((total, transaction) => {
            return total + transaction.amount;
        }, 0);


    return {

        income,

        expenses,

        balance: income - expenses

    };

}


// 10. CATEGORY-WISE EXPENSE ANALYSIS

function calculateCategoryExpenses() {

    const month = getCurrentMonth();

    const categoryTotals = {};

    transactions

        .filter(transaction =>
            transaction.type === "Expense" &&
            transaction.date.startsWith(month)
        )

        .forEach(transaction => {

            const category = transaction.category;

            categoryTotals[category] =
                (categoryTotals[category] || 0) +
                transaction.amount;

        });


    return categoryTotals;

}


// 11. RENDER CATEGORY BREAKDOWN

function renderBreakdown() {

    const categories = calculateCategoryExpenses();

    const entries = Object.entries(categories);

    const maxExpense = Math.max(
        1,
        ...entries.map(entry => entry[1])
    );


    if (entries.length === 0) {

        $("breakdown").innerHTML =
            `<p class="muted">No expenses recorded this month.</p>`;

        return;

    }


    $("breakdown").innerHTML = entries

        .sort((a, b) => b[1] - a[1])

        .map(([category, amount]) => {

            const percentage = (amount / maxExpense) * 100;

            return `

                <div class="category-box">

                    <span class="muted">
                        ${escapeHTML(category)}
                    </span>

                    <b>${formatMoney(amount)}</b>

                    <div class="bar">
                        <i style="width: ${percentage}%"></i>
                    </div>

                </div>

            `;

        })

        .join("");

}


// 12. SEARCH TRANSACTIONS

function getFilteredTransactions() {

    const query = $("search").value
        .trim()
        .toLowerCase();


    return [...transactions]

        .filter(transaction => {

            const searchableText = [

                transaction.desc,

                transaction.category,

                transaction.type

            ].join(" ").toLowerCase();


            return searchableText.includes(query);

        })

        .sort((a, b) => {

            return b.date.localeCompare(a.date) ||
                   b.createdAt - a.createdAt;

        });

}


// 13. RENDER TRANSACTION TABLE

function renderTransactions() {

    const filteredTransactions = getFilteredTransactions();


    $("rows").innerHTML = filteredTransactions

        .map(transaction => {

            const date = new Date(
                transaction.date + "T00:00:00"
            ).toLocaleDateString("en-IN");


            const isIncome = transaction.type === "Income";

            const amountClass = isIncome ? "green" : "red";

            const sign = isIncome ? "+" : "−";


            return `

                <tr>

                    <td>
                        <b>${escapeHTML(transaction.desc)}</b>
                    </td>

                    <td>
                        ${escapeHTML(transaction.category)}
                    </td>

                    <td>${date}</td>

                    <td>
                        <span class="pill">
                            ${transaction.type}
                        </span>
                    </td>

                    <td class="${amountClass}">
                        ${sign}${formatMoney(transaction.amount)}
                    </td>

                    <td>
                        <button
                            class="del"
                            data-id="${transaction.id}"
                        >
                            Delete
                        </button>
                    </td>

                </tr>

            `;

        })

        .join("");


    $("empty").hidden = filteredTransactions.length > 0;


    // Attach delete event listeners

    $("rows").querySelectorAll("[data-id]").forEach(button => {

        button.addEventListener("click", () => {

            deleteTransaction(button.dataset.id);

        });

    });

}


// 14. RENDER DASHBOARD

function renderDashboard() {

    const summary = calculateSummary();


    $("balance").textContent =
        formatMoney(summary.balance);


    $("income").textContent =
        formatMoney(summary.income);


    $("expense").textContent =
        formatMoney(summary.expenses);


    renderBreakdown();

    renderTransactions();

}


// 15. SEARCH EVENT

$("search").addEventListener("input", () => {

    renderTransactions();

});


// 16. INITIALIZE APPLICATION

renderDashboard();
