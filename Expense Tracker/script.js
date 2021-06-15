const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const error = document.getElementById("error");


// const dummyTransactions = [
//   { id: 1, text: "Flower", amount: -20 },
//   { id: 2, text: "Salary", amount: 300 },
//   { id: 3, text: "Book", amount: -10 },
//   { id: 4, text: "Camera", amount: 150 },
// ];

let localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));




let transactions = localStorage.getItem('transactions') != null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();

    if(text.value.trim() === '' || amount.value.trim() === ''){
        error.classList.add('show');
    }
    else{
        error.classList.remove('show');
        let generatedID = generateID();
        while(transactions.map(()=>transactions.id).includes(generatedID)){
            generatedID = generateID();
        }

        const transaction = {
            id: generatedID,
            text: text.value,
            amount: +amount.value
        };
        console.log(transaction);
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

// Generate random id
function generateID() {
    return Math.floor(Math.random()*1000000000);
}


// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button onclick="removeTransaction(${transaction.id})" class='delete-btn'>x</button>
    `;

  list.appendChild(item);
}

// Remove Transaction by id
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id != id);
    updateLocalStorage();
    init();

}


function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = (amounts.reduce((acc, item) => (acc += item), 0)).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (amounts
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0)*-1
  ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

// Init app
function init() {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
}


// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update the balance, income and expense
init();

// Event Listeners
form.addEventListener('submit', addTransaction);
