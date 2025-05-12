// Elements
const form = document.getElementById('expense-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const categoryInput = document.getElementById('category');
const tableBody = document.querySelector('#expenses-table tbody');
const totalEl = document.getElementById('total-amount');
const submitBtn = document.getElementById('submit-btn');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingId = null;

// Initial render
renderExpenses();

// Form submit (add or update)
form.addEventListener('submit', e => {
  e.preventDefault();
  const data = {
    description: descInput.value.trim(),
    amount: parseFloat(amountInput.value),
    date: dateInput.value,
    category: categoryInput.value
  };

  if (editingId === null) {
    // Add new
    data.id = Date.now();
    expenses.push(data);
  } else {
    // Update existing
    expenses = expenses.map(exp =>
      exp.id === editingId ? { ...exp, ...data } : exp
    );
    editingId = null;
    submitBtn.textContent = 'Add';
  }

  saveAndRender();
  form.reset();
});

// Delete expense
function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  // If we were editing this item, cancel edit mode
  if (editingId === id) {
    editingId = null;
    submitBtn.textContent = 'Add';
    form.reset();
  }
  saveAndRender();
}

// Enter edit mode
function editExpense(id) {
  const exp = expenses.find(e => e.id === id);
  if (!exp) return;
  editingId = id;
  descInput.value = exp.description;
  amountInput.value = exp.amount;
  dateInput.value = exp.date;
  categoryInput.value = exp.category;
  submitBtn.textContent = 'Update';
}

// Persist & re-render
function saveAndRender() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderExpenses();
}

// Render table & total
function renderExpenses() {
  tableBody.innerHTML = '';
  let total = 0;

  expenses.forEach(exp => {
    total += exp.amount;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${exp.description}</td>
      <td>₹${exp.amount.toFixed(2)}</td>
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>
        <button class="btn btn-sm btn-secondary btn-edit me-1"
                onclick="editExpense(${exp.id})">✎</button>
        <button class="btn btn-sm btn-danger btn-delete"
                onclick="deleteExpense(${exp.id})">×</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  totalEl.textContent = `₹${total.toFixed(2)}`;
}
