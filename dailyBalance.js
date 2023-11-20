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

/*var dailyBalanceModal = `
<div data-reactroot="" class="ReactModal__Overlay ReactModal__Overlay--after-open Modal__Bootstrap Modal__Bootstrap--blue AccountsModal">
<div class="ReactModal__Content ReactModal__Content--after-open modal-dialog" tabindex="-1" aria-label="Modal">
    <div class="modal-content">
        <div class="modal-header"><button id="Modal_close" type="button" class="close"><svg class="CloseIcon" viewBox="0 0 40 40"><path d="M23.54455,20l8.90253-8.85541a2.78386,2.78386,0,0,0,.35938-3.8833,2.8016,2.8016,0,0,0-3.89453.34814l-8.91187,8.86475L11.08813,7.60944a2.8016,2.8016,0,0,0-3.89453-.34814,2.78386,2.78386,0,0,0,.35938,3.8833L16.4555,20,7.553,28.85541a2.78378,2.78378,0,0,0-.35937,3.88324,2.80164,2.80164,0,0,0,3.89453-.34808l8.91193-8.86475,8.91187,8.86475a2.80164,2.80164,0,0,0,3.89453.34808,2.78378,2.78378,0,0,0-.35937-3.88324Z"></path></svg><span class="sr-only">Close</span></button>
            <h4 class="modal-title"><span>Daily Balance</span></h4>
        </div>
        <div class="modal-body">
            <ul>
                <li class="li">
                    <ul class="ul">
                        <li class="li"><button id="refreshButton" type="button" title="Refresh Transactions"><svg id="startoversvg" xmlns="http://www.w3.org/2000/svg" fill="#e64b40" viewBox="3 3 16 16" width="30px"><circle cx="11" cy="-1041.36" r="8" transform="matrix(1 0 0-1 0-1030.36)" opacity=".98" fill="#1d99f3"/><path d="m120.6 38.723c-3.312-7.713-7.766-14.367-13.36-19.961-5.595-5.594-12.248-10.05-19.962-13.361-7.713-3.314-15.805-4.97-24.278-4.97-7.984 0-15.71 1.506-23.18 4.521-7.468 3.01-14.11 7.265-19.92 12.751l-10.593-10.511c-1.63-1.684-3.503-2.064-5.622-1.141-2.173.924-3.259 2.527-3.259 4.808v36.5c0 1.412.516 2.634 1.548 3.666 1.033 1.032 2.255 1.548 3.667 1.548h36.5c2.282 0 3.884-1.086 4.807-3.259.923-2.118.543-3.992-1.141-5.622l-11.162-11.243c3.803-3.585 8.148-6.341 13.04-8.27 4.889-1.928 9.994-2.893 15.317-2.893 5.649 0 11.04 1.101 16.17 3.3 5.133 2.2 9.572 5.174 13.32 8.922 3.748 3.747 6.722 8.187 8.922 13.32 2.199 5.133 3.299 10.523 3.299 16.17 0 5.65-1.1 11.04-3.299 16.17-2.2 5.133-5.174 9.573-8.922 13.321-3.748 3.748-8.188 6.722-13.32 8.921-5.133 2.2-10.525 3.3-16.17 3.3-6.464 0-12.574-1.412-18.332-4.236-5.757-2.824-10.618-6.816-14.583-11.977-.38-.543-1-.87-1.874-.979-.815 0-1.494.244-2.037.733l-11.162 11.244c-.434.436-.665.991-.692 1.67-.027.68.15 1.29.53 1.833 5.921 7.17 13.09 12.724 21.509 16.661 8.419 3.937 17.3 5.907 26.642 5.907 8.473 0 16.566-1.657 24.279-4.97 7.713-3.313 14.365-7.768 19.961-13.361 5.594-5.596 10.05-12.248 13.361-19.961 3.313-7.713 4.969-15.807 4.969-24.279 0-8.474-1.657-16.564-4.97-24.277" fill="#fff" transform="matrix(.07192 0 0 .07192 6.674 6.768)"/></svg></button></li>
                        <li class="li"><button id="clearButton" type="button" title="Clear"><svg xmlns="http://www.w3.org/2000/svg" fill="#e64b40" viewBox="0 0 63 63" width="30px" transform="rotate(45)"><path d="m31.6506 0c-17.4506 0-31.6482 14.2002-31.6482 31.6526c0 17.4512 14.1978 31.65 31.6482 31.65c17.4518 0 31.6496-14.1988 31.6496-31.65c0-17.4524-14.1966-31.6526-31.6496-31.6526zm14.5 34.1h-12v12c0 1.4856-.9728 2.6876-2.4602 2.6876c-1.4844 0-2.4596-1.2034-2.4596-2.6876v-12h-12c-1.488 0-2.6908-.9728-2.6908-2.4596s1.2028-2.4602 2.6908-2.4602h12v-12c0-1.4868.9752-2.6906 2.4596-2.6906c1.4874 0 2.4602 1.204 2.4602 2.6906v12h12c1.4878 0 2.6912.9734 2.6912 2.4602s-1.2032 2.4594-2.691 2.4594z"></path></svg></button></li>
                        <li class="li"><button id="addButton" type="button" title="Add"><svg xmlns="http://www.w3.org/2000/svg" fill="#48ce65" viewBox="0 0 63 63" width="30px"><path d="m31.6506 0c-17.4506 0-31.6482 14.2002-31.6482 31.6526c0 17.4512 14.1978 31.65 31.6482 31.65c17.4518 0 31.6496-14.1988 31.6496-31.65c0-17.4524-14.1966-31.6526-31.6496-31.6526zm14.5 34.1h-12v12c0 1.4856-.9728 2.6876-2.4602 2.6876c-1.4844 0-2.4596-1.2034-2.4596-2.6876v-12h-12c-1.488 0-2.6908-.9728-2.6908-2.4596s1.2028-2.4602 2.6908-2.4602h12v-12c0-1.4868.9752-2.6906 2.4596-2.6906c1.4874 0 2.4602 1.204 2.4602 2.6906v12h12c1.4878 0 2.6912.9734 2.6912 2.4602s-1.2032 2.4594-2.691 2.4594z"></path></svg></button></li>
                    </ul>
                </li>
                <li class="li">
                    <div class="startingBalance BudgetItemRow-column">Starting Balance: 
                        <span class="money BudgetItem-secondColumn money--remaining">
                            <span class="money">{0}</span>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
`*/

var dailyBalanceModal = `
<div data-reactroot="" class="ReactModal__Overlay ReactModal__Overlay--after-open Modal__Bootstrap Modal__Bootstrap--blue AccountsModal">
<div class="ReactModal__Content ReactModal__Content--after-open modal-dialog" tabindex="-1" aria-label="Modal">
    <div class="modal-content">
        <div class="modal-header"><button id="Modal_close" type="button" class="close"><svg class="CloseIcon" viewBox="0 0 40 40"><path d="M23.54455,20l8.90253-8.85541a2.78386,2.78386,0,0,0,.35938-3.8833,2.8016,2.8016,0,0,0-3.89453.34814l-8.91187,8.86475L11.08813,7.60944a2.8016,2.8016,0,0,0-3.89453-.34814,2.78386,2.78386,0,0,0,.35938,3.8833L16.4555,20,7.553,28.85541a2.78378,2.78378,0,0,0-.35937,3.88324,2.80164,2.80164,0,0,0,3.89453-.34808l8.91193-8.86475,8.91187,8.86475a2.80164,2.80164,0,0,0,3.89453.34808,2.78378,2.78378,0,0,0-.35937-3.88324Z"></path></svg><span class="sr-only">Close</span></button>
            <h4 class="modal-title"><span>Daily Balance</span></h4>
        </div>
        <div class="modal-body">
            <ul>
                <li class="li">
                    <ul class="ul">
                        <li class="li"><button id="refreshButton" type="button" title="Refresh Transactions"><svg id="startoversvg" xmlns="http://www.w3.org/2000/svg" fill="#e64b40" viewBox="3 3 16 16" width="30px"><circle cx="11" cy="-1041.36" r="8" transform="matrix(1 0 0-1 0-1030.36)" opacity=".98" fill="#1d99f3"/><path d="m120.6 38.723c-3.312-7.713-7.766-14.367-13.36-19.961-5.595-5.594-12.248-10.05-19.962-13.361-7.713-3.314-15.805-4.97-24.278-4.97-7.984 0-15.71 1.506-23.18 4.521-7.468 3.01-14.11 7.265-19.92 12.751l-10.593-10.511c-1.63-1.684-3.503-2.064-5.622-1.141-2.173.924-3.259 2.527-3.259 4.808v36.5c0 1.412.516 2.634 1.548 3.666 1.033 1.032 2.255 1.548 3.667 1.548h36.5c2.282 0 3.884-1.086 4.807-3.259.923-2.118.543-3.992-1.141-5.622l-11.162-11.243c3.803-3.585 8.148-6.341 13.04-8.27 4.889-1.928 9.994-2.893 15.317-2.893 5.649 0 11.04 1.101 16.17 3.3 5.133 2.2 9.572 5.174 13.32 8.922 3.748 3.747 6.722 8.187 8.922 13.32 2.199 5.133 3.299 10.523 3.299 16.17 0 5.65-1.1 11.04-3.299 16.17-2.2 5.133-5.174 9.573-8.922 13.321-3.748 3.748-8.188 6.722-13.32 8.921-5.133 2.2-10.525 3.3-16.17 3.3-6.464 0-12.574-1.412-18.332-4.236-5.757-2.824-10.618-6.816-14.583-11.977-.38-.543-1-.87-1.874-.979-.815 0-1.494.244-2.037.733l-11.162 11.244c-.434.436-.665.991-.692 1.67-.027.68.15 1.29.53 1.833 5.921 7.17 13.09 12.724 21.509 16.661 8.419 3.937 17.3 5.907 26.642 5.907 8.473 0 16.566-1.657 24.279-4.97 7.713-3.313 14.365-7.768 19.961-13.361 5.594-5.596 10.05-12.248 13.361-19.961 3.313-7.713 4.969-15.807 4.969-24.279 0-8.474-1.657-16.564-4.97-24.277" fill="#fff" transform="matrix(.07192 0 0 .07192 6.674 6.768)"/></svg></button></li>
                        <li class="li"><button id="clearButton" type="button" title="Clear"><svg xmlns="http://www.w3.org/2000/svg" fill="#e64b40" viewBox="0 0 63 63" width="30px" transform="rotate(45)"><path d="m31.6506 0c-17.4506 0-31.6482 14.2002-31.6482 31.6526c0 17.4512 14.1978 31.65 31.6482 31.65c17.4518 0 31.6496-14.1988 31.6496-31.65c0-17.4524-14.1966-31.6526-31.6496-31.6526zm14.5 34.1h-12v12c0 1.4856-.9728 2.6876-2.4602 2.6876c-1.4844 0-2.4596-1.2034-2.4596-2.6876v-12h-12c-1.488 0-2.6908-.9728-2.6908-2.4596s1.2028-2.4602 2.6908-2.4602h12v-12c0-1.4868.9752-2.6906 2.4596-2.6906c1.4874 0 2.4602 1.204 2.4602 2.6906v12h12c1.4878 0 2.6912.9734 2.6912 2.4602s-1.2032 2.4594-2.691 2.4594z"></path></svg></button></li>
                        <li class="li"><button id="addButton" type="button" title="Add"><svg xmlns="http://www.w3.org/2000/svg" fill="#48ce65" viewBox="0 0 63 63" width="30px"><path d="m31.6506 0c-17.4506 0-31.6482 14.2002-31.6482 31.6526c0 17.4512 14.1978 31.65 31.6482 31.65c17.4518 0 31.6496-14.1988 31.6496-31.65c0-17.4524-14.1966-31.6526-31.6496-31.6526zm14.5 34.1h-12v12c0 1.4856-.9728 2.6876-2.4602 2.6876c-1.4844 0-2.4596-1.2034-2.4596-2.6876v-12h-12c-1.488 0-2.6908-.9728-2.6908-2.4596s1.2028-2.4602 2.6908-2.4602h12v-12c0-1.4868.9752-2.6906 2.4596-2.6906c1.4874 0 2.4602 1.204 2.4602 2.6906v12h12c1.4878 0 2.6912.9734 2.6912 2.4602s-1.2032 2.4594-2.691 2.4594z"></path></svg></button></li>
                    </ul>
                </li>
                <li class="li startingBalance">
                    <div class="BudgetItemRow-column">Starting Balance: 
                        <span class="money BudgetItem-secondColumn money--remaining">
                            <span class="money">{0}</span>
                        </span>
                    </div>
                </li>
            </ul>
            <br />
        </div>
    </div>
</div>
`

var modalRowFormat = `
    <span class="BudgetItem-delete">
        <svg xmlns="http://www.w3.org/2000/svg" id="delete{0}" class="delete{0}" width="16" height="16" viewBox="0 0 14 18" style="vertical-align: top;">
            <path fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="1.25" d="M4.273 3.727V2a1 1 0 0 1 1-1h3.454a1 1 0 0 1 1 1v1.727M13 5.91v10.455a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5.909m6 2.727v5.455M4.273 8.636v5.455m5.454-5.455v5.455M13 3.727H1"></path>
        </svg>
    </span>
    <div class="BudgetItemRow-column">
			<input id="name{0}" type="text" class="name{0} input--inline--budget--sm BudgetItemRow-input" maxlength="64" value="{0}">
	</div>
	<div class="BudgetItemRow-column">
		<div data-testid="AmountBudgetedInputContainer">
			<input id="amount{0}" class="amount{0} BudgetItemRow-input BudgetItemRow-input--amountBudgeted input--inline--budget--sm no-wrap text--right" data-testid="MoneyInput-input" value="{1}" autofocus="">
		</div>
	</div>
	<div class="BudgetItemRow-column">
        <input id="date{0}" class="date{0} dateInput" type="date" value="{2}">
    </div>
	<div class="BudgetItemRow-column">
        <span class="money BudgetItem-secondColumn money--remaining" data-text="{3}">
            <span class="money">{3}</span>
        </span>
	</div>
`

var modalStartingBalance = `
<div class="BudgetItemRow-column">
<span class="money BudgetItem-secondColumn money--remaining" data-text="{3}">
    <span class="money">{3}</span>
</span>
</div>
`

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

function add_click() {
    allPayments.push({Name: "New", Amount: 0, Day: today.getUTCDate()});
    displayDailyBalance();
}

function dateEdit(e) {
    var name = e.target.id.substring(4);
    allPayments.forEach(payment => {
        if (payment.Name == name) {
            payment.Day = e.target.valueAsDate.getUTCDate();
            displayDailyBalance();
        }
    });
}

function amountEdit(e) {
    var name = e.target.id.substring(6);
    var newAmount = parseFloat(e.target.value.replace(/[^0-9.-]+/g,""));
    allPayments.some(payment => {
        if (payment.Name == name) {
            payment.Amount = newAmount;
            e.target.value = formatter.format(newAmount);
            displayDailyBalance();
            return true;
        }
    });
}
  
function nameEdit(e) {
    var oldName = e.target.id.substring(4);
    allPayments.some(payment => {
        if (payment.Name == oldName) {
            if (e.target.value != "") {
                payment.Name = e.target.value;
                e.target.id = `name{0}`.format(payment.Name);
            }
            displayDailyBalance();
            return true;
        }
    });
}

function deletePayment(e) {
    var index = -1;
    var name = e.target.id.substring(6);
    
    allPayments.some(payment => {
        if (payment.Name == name) {
            index =  allPayments.indexOf(payment);
            return true;
        }
    });
    
    if (index > -1) {
        allPayments.splice(index, 1);
        displayDailyBalance();
    }
}

function getModalRow(name, month, day, amount, balance) {
    var date = new Date(today.getUTCFullYear(), month, day);
    var template = document.createElement("template");
    var row = document.createElement("div");
    row.classList.add("BudgetItemRow-content");
    row.style.padding = "1%";

    row.innerHTML = modalRowFormat.format(name, formatter.format(amount), date.toISOString().substring(0, 10), formatter.format(balance));
    //row = template.content;

    // Create events for editing
    row.getElementsByClassName(`delete{0}`.format(name))[0].addEventListener("click", deletePayment);
    row.getElementsByClassName(`name{0}`.format(name))[0].addEventListener("change", nameEdit);
    row.getElementsByClassName(`amount{0}`.format(name))[0].addEventListener("change", amountEdit);
    row.getElementsByClassName(`date{0}`.format(name))[0].addEventListener("change", dateEdit);

    return row;
}

function saveAndClose() {
    save();
    closeModal();
}

function displayDailyBalance() {
    var newMonth = false;
    var month = today.getUTCMonth();
    var divider = document.createElement("hr");
    var payments = document.createElement("div");
    var modalNode = document.createElement("div");
    var row;
    var reactNode;

    closeModal();

    divider.style.borderTop = "2px solid";
    divider.style.borderTopColor = "#0091d9";

    payments.classList.add("InstitutionLogin-children");

    allPayments.sort(byDate);
    runningTotal = balances.remainingBalance / 100;

    allPayments.forEach(element => {
        if (element.Day < today.getUTCDate()) {
        month = today.getMonth() + 1;
            if (!newMonth) {
                payments.appendChild(divider);
                newMonth = true;
            }
        } else {
        month = today.getMonth();
        }

        runningTotal = runningTotal + element.Amount;

        row = getModalRow(element.Name, month, element.Day, element.Amount, runningTotal);
        payments.appendChild(row);
    });

    modalNode.innerHTML = dailyBalanceModal.format(formatter.format(balances.remainingBalance / 100));
    modalNode.getElementsByClassName("modal-body")[0].appendChild(payments);

    reactNode = document.getElementsByClassName("ReactModalPortal")[0];
    reactNode.appendChild(modalNode);

    // Manually set the width of the portal because it's just too small
    document.getElementsByClassName("ReactModal__Content ReactModal__Content--after-open modal-dialog")[0].style.width = "40%"

    // Add event listeners for buttons
    document.getElementById("Modal_close").addEventListener("click", saveAndClose);
    document.getElementById("refreshButton").addEventListener("click", updatePayments);
    document.getElementById("clearButton").addEventListener("click", clear_click);
    document.getElementById("addButton").addEventListener("click", add_click);
}

function clear_click() {
    allPayments = [];
    displayDailyBalance();
}

// Saves options to chrome.storage
function save() {
    allPayments.sort(byDate);

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
  
// Restores select box and checkbox state using the preferences stored in chrome.storage.
function restore() {
    chrome.storage.sync.get('allPayments', (data) => {
        Object.assign(allPayments, data.allPayments);
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
    closeModal();
    getRemaining(balances);
    var newPayments = nonFunds.concat(debtPayments);
    newPayments = newPayments.concat(incomePayments);

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

    displayDailyBalance();
}

restore();