// TODO:

var today = new Date();
var startingBalance = 0;
var currentBalance = 0;
var allPayments = [];
var runningTotal;
var status = document.getElementById('status');

var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// For sorting payments by date
function byDate(a, b) {
  todaysDay = today.getUTCDate();

  // Consider days before today greater becaue they're next month
  if (a.Day < todaysDay && b.Day >= todaysDay) {
    return 1;
  } else if (b.Day < todaysDay && a.Day >= todaysDay) {
    return -1;
  }

  if (a.Day < b.Day){
    return -1;
  } else if (a.Day > b.Day){
    return 1;
  } else {
    if (a.Amount > 0) {
      return -1;
    } else if (b.Amount > 0) {
      return 1;
    } else {
      return 0;
    }
  }
}

function dateChange(e) {
  allPayments.forEach(payment => {
    if (payment.Name == e.target.id) {
      payment.Day = e.target.valueAsDate.getUTCDate()
    }
  });
}

function getDateInput(name, month, day) {
  var date = new Date(today.getUTCFullYear(), month, day);
  
  var datePicker = document.createElement("input");
  datePicker.className = "dateInput";
  datePicker.id = name;
  datePicker.type = "date";
  datePicker.valueAsDate = date;
  datePicker.addEventListener("change", dateChange);
  return datePicker;
}

function createDiv(className, id, innerText, child) {
  var div = document.createElement("div");
  div.className = className;
  div.id = id;
  div.innerText = innerText;
  return div;
}

function add_click() {
  allPayments.push({Name: "New", Amount: 0, Day: today.getUTCDate()});
  drawPayments();
}

function amountEdit(e) {
  var newAmount = 0;
  allPayments.some(payment => {
    if (payment.Name == e.target.id) {
      newAmount = parseFloat(prompt("Enter amount", payment.Amount));
      if (!isNaN(newAmount)) {
        payment.Amount = newAmount;
        e.target.innerText = formatter.format(newAmount);
      }
      return true;
    }
  });
}
  
function nameEdit(e) {
  var newName = "";
  allPayments.some(payment => {
    if (payment.Name == e.target.id) {
      newName = prompt("Enter name", payment.Name);
      if (newName != null) {
        payment.Name = newName;
        e.target.innerText = newName;
      }
      return true;
    }
  });
}

function deletePayment(e) {
  var index = -1;
  allPayments.some(payment => {
    if (payment.Name == e.target.id) {
      index =  allPayments.indexOf(payment);
      return true;
    }
  });
  
  if (index > -1) {
    allPayments.splice(index, 1);
    drawPayments();
  }
}

function drawPayments() {
  var newMonth = false;
  var month = today.getUTCMonth();

  allPayments.sort(byDate);
  runningTotal = currentBalance;

  var payments = document.getElementById("payments");
  payments.innerHTML = ""

  allPayments.forEach(element => {
    if (element.Day < today.getUTCDate()) {
      month = today.getMonth() + 1;

      if (!newMonth) {
        var hr = document.createElement("hr")
        payments.appendChild(hr);
        newMonth = true;
      }
    } else {
      month = today.getMonth();
    }

    var div;
    var row = document.createElement("div");
    row.className = "row";

    div = createDiv("column", element.Name, element.Name);
    var deleteButton = document.createElement("button");
    deleteButton.id = element.Name;
    deleteButton.innerHTML = "X";
    deleteButton.addEventListener("click", deletePayment);
    div.insertBefore(deleteButton, div.childNodes[0]);
    div.addEventListener("dblclick", nameEdit);
    row.appendChild(div);

    div = createDiv("column", element.Name, formatter.format(element.Amount));
    div.addEventListener("dblclick", amountEdit);
    row.appendChild(div);

    div = createDiv("column", "", "");
    div.appendChild(getDateInput(element.Name, month, element.Day));
    row.appendChild(div);

    runningTotal = runningTotal + element.Amount;
    div = createDiv("column", "", formatter.format(runningTotal));
    row.appendChild(div);

    payments.appendChild(row);
  });

}

function clear_click() {
  allPayments = [];
  chrome.storage.sync.set({allPayments: allPayments});
  start();
}

// Saves options to chrome.storage
function save() {

  allPayments.sort(byDate);
  drawPayments();

  chrome.storage.sync.set({
    allPayments: allPayments,
    }, function() {
      // Update status to let user know
      status.textContent = 'Saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
}
  
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore() {
  status.textContent = 'Restoring...';

  chrome.storage.sync.get('allPayments', (data) => {
    Object.assign(allPayments, data.allPayments);
    var status = document.getElementById('status');
    status.textContent = '';
    drawPayments();
  });
}

function updateBalances() {
  status.textContent = 'Updating balances...';

  chrome.tabs.query({url: "https://www.everydollar.com/app/budget", currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {function: "getBalances"}, function(response) {
      startingBalance = response.startingBalance;
      currentBalance = response.currentBalance;

      var div = document.getElementById("startingBalance");
      div.innerText = "Starting Balance: " + startingBalance;
    
      var div = document.getElementById("currentBalance");
      div.innerText = "Current Balance: " + currentBalance;

      status.textContent = '';
      drawPayments();
    });
  });
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getPayDates(day) {
  var payDates = [];
  var lastDay = addDays(today, 31);
  
  payday = new Date(today.getUTCFullYear(), today.getUTCMonth(), day)

  do {
    payDates.push(payday.getUTCDate());
    payday = addDays(payday, 14);
  } while (payday < lastDay)
  return payDates;
}

function updatePayments() {
  status.textContent = 'Updating transactions...';

  chrome.tabs.query({url: "https://www.everydollar.com/app/budget", currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {function: "getPayments"}, function(response) {
      var newPayments = response.nonFunds.concat(response.debtPayments);
      newPayments = newPayments.concat(response.incomePayments);

      var found = false;
      newPayments.forEach(newPayment => {
        found = false;
        allPayments.forEach(existing => {
          if (newPayment.Name == existing.Name) {
            existing.Amount = newPayment.Amount;
            found = true;
          }
        });
        if (!found) {
          newPayment.Day = today.getUTCDate();
          allPayments.push(newPayment);
        }
      });

      /*
      // Find salary and split it into bi-weekly
      // TODO:
      // remove or replace existing payments
      // Determine proper divisor
      allPayments.some(payment => {
        if (payment.Name == "My Salary") {
          var payDates = getPayDates(payment.Day);
          var salary = payment.Amount;
          var eachSalary = Math.floor(salary / payDates.Count);
          
          var ndx = 1;
          payDates.forEach(payDate => {
            payment.push({"Name": "My Salary" + ndx++, "Amount": eachSalary, "Day": payDate});
          });
          return true;
        }
      }); */

      status.textContent = '';
      drawPayments();
    });
  });
}

function update() {
  updateBalances();
  updatePayments();
}

document.getElementById('save').addEventListener('click', save);
document.getElementById('add').addEventListener('click', add_click);
document.getElementById('clear').addEventListener('click', clear_click);
document.getElementById('update').addEventListener('click', update);

restore();
updateBalances();