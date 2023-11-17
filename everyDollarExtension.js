//EveryDollar Reconcile script
//This script is injected into the pageAction
//Calculates the balance of all the budgets and displays it at the top of the page
//I find this useful for comparing to my actual bank balance
String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var reconcileButton;

var UUID = "";
var userId = "";
var authHeader = "";
var accountName = "Bank of AmericaAdv Plus Banking - 1598"

var incomePayments = [];
var nonFunds = [];
var debtPayments = [];
var allAccounts = new Map();

var allPromises = [];

var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.function) {
            case "getPayments":
                sendResponse({nonFunds: nonFunds, incomePayments: incomePayments, debtPayments: debtPayments});
                break;
            case "getBalances":
                sendResponse({startingBalance: balances.fundStarting, currentBalance: balances.remainingBalance});
                break;
        }
    }
);

var strReconcileButton = `
<button data-testid="OperationsPanelReconcile" class="OperationsPanelTabButton"><div class="IconContainer OperationsPanelTabIcon"><svg class="AccountIcon" fill="#A7A9AC" xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 40 40"><path style=" " d="M 28.28125 6.28125 L 11 23.5625 L 3.71875 16.28125 L 2.28125 17.71875 L 10.28125 25.71875 L 11 26.40625 L 11.71875 25.71875 L 29.71875 7.71875 Z "></path></svg></div><div class="OperationsPanelTabLabel">Reconcile</div></button>
`

var strDailyBalanceButton = `
<button data-testid="OperationsPanelDailyBalance" class="OperationsPanelTabButton"><div class="IconContainer OperationsPanelTabIcon"><svg class="AccountIcon" fill="#A7A9AC" xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 30 30"><path style="fill:#606060;" d="M2.25 4.833C1.537 4.833.958 5.411.958 6.125C.958 6.838 1.537 7.416 2.25 7.416C2.963 7.416 3.542 6.838 3.542 6.125C3.542 5.412 2.963 4.833 2.25 4.833ZM2.25 6.555C2.012 6.555 1.82 6.364 1.82 6.125S2.012 5.694 2.25 5.694C2.488 5.694 2.681 5.886 2.681 6.125S2.488 6.555 2.25 6.555ZM2.25 8.708C1.537 8.708.958 9.286.958 9.999C.958 10.714 1.537 11.291 2.25 11.291C2.963 11.291 3.542 10.714 3.542 9.999C3.542 9.287 2.963 8.708 2.25 8.708ZM2.25 10.43C2.012 10.43 1.82 10.239 1.82 10C1.82 9.763 2.012 9.57 2.25 9.57C2.488 9.57 2.681 9.762 2.681 10C2.681 10.238 2.488 10.43 2.25 10.43ZM2.25 12.584C1.537 12.584.958 13.162.958 13.875S1.537 15.166 2.25 15.166C2.963 15.166 3.542 14.588 3.542 13.875S2.963 12.584 2.25 12.584ZM2.25 14.307C2.012 14.307 1.82 14.114 1.82 13.875S2.012 13.443 2.25 13.443C2.488 13.443 2.681 13.636 2.681 13.875S2.488 14.307 2.25 14.307ZM2.25 16.555C1.537 16.555.958 17.133.958 17.846C.958 18.561 1.537 19.138 2.25 19.138C2.963 19.138 3.542 18.561 3.542 17.846C3.542 17.134 2.963 16.555 2.25 16.555ZM2.25 18.277C2.012 18.277 1.82 18.086 1.82 17.847C1.82 17.61 2.012 17.417 2.25 17.417C2.488 17.417 2.681 17.609 2.681 17.847C2.681 18.085 2.488 18.277 2.25 18.277ZM18.25 5.677H6.25C6.012 5.677 5.82 5.869 5.82 6.107C5.82 6.345 6.012 6.537 6.25 6.537H18.25C18.487 6.537 18.68 6.345 18.68 6.107C18.68 5.869 18.487 5.677 18.25 5.677ZM18.25 9.577H6.25C6.012 9.577 5.82 9.769 5.82 10.007C5.82 10.245 6.012 10.437 6.25 10.437H18.25C18.487 10.437 18.68 10.245 18.68 10.007C18.68 9.769 18.487 9.577 18.25 9.577ZM18.25 13.477H6.25C6.012 13.477 5.82 13.669 5.82 13.907S6.012 14.339 6.25 14.339H18.25C18.487 14.339 18.68 14.147 18.681 13.909S18.488 13.479 18.251 13.479ZM18.25 17.377H6.25C6.012 17.377 5.82 17.569 5.82 17.807S6.012 18.237 6.25 18.237H18.25C18.487 18.237 18.68 18.045 18.68 17.807S18.487 17.377 18.25 17.377Z"></path></svg></div><div class="OperationsPanelTabLabel">Daily</div></button>
`

var strModal = `
<div data-reactroot="" class="ReactModal__Overlay ReactModal__Overlay--after-open Modal__Bootstrap Modal__Bootstrap--blue AccountsModal">
<div class="ReactModal__Content ReactModal__Content--after-open modal-dialog" tabindex="-1" aria-label="Modal">
    <div class="modal-content">
        <div class="modal-header"><button id="Modal_close" type="button" class="close"><svg class="CloseIcon" viewBox="0 0 40 40"><path d="M23.54455,20l8.90253-8.85541a2.78386,2.78386,0,0,0,.35938-3.8833,2.8016,2.8016,0,0,0-3.89453.34814l-8.91187,8.86475L11.08813,7.60944a2.8016,2.8016,0,0,0-3.89453-.34814,2.78386,2.78386,0,0,0,.35938,3.8833L16.4555,20,7.553,28.85541a2.78378,2.78378,0,0,0-.35937,3.88324,2.80164,2.80164,0,0,0,3.89453-.34808l8.91193-8.86475,8.91187,8.86475a2.80164,2.80164,0,0,0,3.89453.34808,2.78378,2.78378,0,0,0-.35937-3.88324Z"></path></svg><span class="sr-only">Close</span></button>
            <h4 class="modal-title"><span>Reconciliation Information</span><button id="modalRefreshButton" type="button" style="z-index:2;margin:0;outline:none;border:0;background:transparent;padding:0;text-transform:uppercase;font-size:2.8rem"><svg viewBox="0 0 32 32" width="20px" height="20px"><path d="M25.444,4.291c0,0-1.325,1.293-2.243,2.201C18.514,3.068,11.909,3.456,7.676,7.689   c-2.47,2.47-3.623,5.747-3.484,8.983h4C8.051,14.46,8.81,12.205,10.5,10.514c2.663-2.663,6.735-3.043,9.812-1.162   c-1.042,1.032-2.245,2.238-2.245,2.238c-0.841,1.009,0.104,1.592,0.584,1.577l5.624-0.001c0.297,0,0.539,0.001,0.539,0.001   s0.245,0,0.543,0h1.092c0.298,0,0.54-0.243,0.54-0.541V4.895C27.023,4.188,26.247,3.502,25.444,4.291z" fill="#ffffff"/><path d="M6.555,27.709c0,0,1.326-1.293,2.243-2.201c4.688,3.424,11.292,3.036,15.526-1.197   c2.47-2.471,3.622-5.747,3.484-8.983h-4.001c0.142,2.211-0.617,4.467-2.308,6.159c-2.663,2.662-6.735,3.043-9.812,1.161   c1.042-1.032,2.245-2.238,2.245-2.238c0.841-1.01-0.104-1.592-0.584-1.577l-5.624,0.002c-0.297,0-0.54-0.002-0.54-0.002   s-0.245,0-0.543,0H5.551c-0.298,0-0.54,0.242-0.541,0.541v7.732C4.977,27.812,5.753,28.498,6.555,27.709z" fill="#ffffff"/></svg></button></h4>
        </div>
        <div class="modal-body">
            <div>
                <div class="InstitutionLogin-children">
                    <div class="BankAccount">
                        <div class="BankAccount-descriptionLine">
                            <div class="BankAccount-name">
                                Bank Balance
                                <span class="BankAccount-expander"></span></div>
                                <div class="BankAccount-balance"><span class="money undefined" data-text="{0}.{1}"><span class="money-symbol">$</span><span class="money-integer">{0}</span><span class="money-decimal">.</span><span class="money-fractional">{1}</span></span>
                            </div>
                        </div>
                    </div>
                    <div class="BankAccount">
                        <div class="BankAccount-descriptionLine collapsible">
                            <div class="BankAccount-name">EveryDollar Balance<span class="BankAccount-expander"><svg class="icon icon--chevron icon--inline small" viewBox="0 0 40 40"><path id="ReconcileCollapse" d="M22.1374,28.03471a3.1012,3.1012,0,0,1-4.29536-.00148L5.14816,15.64438a2.79272,2.79272,0,0,1-.40086-3.88443,2.79274,2.79274,0,0,1,3.893.30632L17.844,21.04885c1.94327,2.06586,2.882,1.41479,4.29533.00147l9.22081-8.987a2.79286,2.79286,0,0,1,3.8935-.30338,2.79284,2.79284,0,0,1-.40329,3.88441Z"></path></svg></span></div>
                            <div class="BankAccount-balance"><span class="money undefined{2}" data-text="{4}.{5}"><span class="money-sign">{3}</span><span class="money-symbol">$</span><span class="money-integer">{4}</span><span class="money-decimal">.</span><span class="money-fractional">{5}</span></span></div>
                        </div>
                        <div style="display:none">
                        <div class="BankAccount"></div>
                        <div class="BankAccount">
                            <div class="BankAccount-descriptionLine">
                                <div class="BankAccount-name">
                                    Starting Balance
                                    <span class="BankAccount-expander"></span></div>
                                    <div class="BankAccount-balance"><span class="money undefined{6}" data-text="{8}.{9}"><span class="money-sign">{7}</span><span class="money-symbol">$</span><span class="money-integer">{8}</span><span class="money-decimal">.</span><span class="money-fractional">{9}</span></span>
                                </div>
                            </div>
                        </div>
                        <div class="BankAccount">
                            <div class="BankAccount-descriptionLine">
                                <div class="BankAccount-name">
                                    Total Income
                                    <span class="BankAccount-expander"></span></div>
                                    <div class="BankAccount-balance"><span class="money undefined{10}" data-text="{12}.{13}"><span class="money-sign">{11}</span><span class="money-symbol">$</span><span class="money-integer">{12}</span><span class="money-decimal">.</span><span class="money-fractional">{13}</span></span>
                                </div>
                            </div>
                        </div>
                        <div class="BankAccount">
                            <div class="BankAccount-descriptionLine">
                                <div class="BankAccount-name">
                                    Total Spent
                                    <span class="BankAccount-expander"></span></div>
                                    <div class="BankAccount-balance"><span class="money undefined{14}" data-text="{16}.{17}"><span class="money-sign">{15}</span><span class="money-symbol">$</span><span class="money-integer">{16}</span><span class="money-decimal">.</span><span class="money-fractional">{17}</span></span>
                                </div>
                            </div>
                        </div>
                        <div class="BankAccount">
                            <div class="BankAccount-descriptionLine">
                                <div class="BankAccount-name">
                                    Remaining Budget
                                    <span class="BankAccount-expander"></span></div>
                                    <div class="BankAccount-balance"><span class="money undefined" data-text="{18}.{19}"><span class="money-symbol">$</span><span class="money-integer">{18}</span><span class="money-decimal">.</span><span class="money-fractional">{19}</span></span>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
`;
var balances = {
    //current bank balance as reported by the bank
    bankBalance: 0,
    //Total income received 
    receivedIncome: 0,
    //Sum of planned budgets
    planned: 0,
    //Sum of planned budgets
    spentThisMonth: 0,
    //sum of remaining balances from all budget lines
    remainingBalance: 0,
    //sum of remaining balance from all budget lines that aren't funds
    //This is significant because it doesn't carry over to the next month
    nonFundRemaining: 0,
    //sum of transactions which have not yet been categorized
    unTrackedBalance: 0,
    // Sum of tracked balances
    tracked: 0,
    //sum of all fund starting balances
    fundStarting: 0
};

async function SendRequest(url) {
    var requestInfo = {
        method: 'GET',
        headers: {
            'Authorization': authHeader
        }
    }

    return fetch(url, requestInfo)
        .then((response)=>response.json())
        .then((responseJson)=>{return responseJson});
}

//Closes any open card
function CloseCard() {
    // Close the transaction drawer first because it's an odball and sits on top of other cards
    //document.evaluate('//button[contains(@aria-label,"close")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

    var closeButtons = document.getElementsByClassName("CloseIcon");
    if (closeButtons.length > 0) {
        closeButtons[0].parentElement.click();
    }
    //for (var button = 0; button < closeButtons.length; button++) {
    //    closeButtons[button].parentElement.click();
    //}
}

//Goes through each fund and calculates the balance of all budgets
async function updateReconcile() {
    balances.planned = 0;
    balances.tracked = 0;
    balances.spentThisMonth = 0;
    balances.receivedIncome = 0;
    balances.remainingBalance = 0;
    balances.nonFundRemaining = 0;
    balances.unTrackedBalance = 0;
    balances.fundStarting = 0;
    
    var expenseRemainingElements;
    var planned = 0;
    var tempCurr;
    var tempString;
    
    incomePayments = [];
    nonFunds = [];
    debtPayments = [];


    var currentMonth = (new Date()).toLocaleString('default', { month: 'short' });

    debugger;

    //Grab the amount left to budget from under the income card
    var unbudgetedString = document.evaluate('//div[@class="AmountBudgeted BudgetSummaryContainer-amount"]/span/span/@data-text', document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (unbudgetedString != "") {
        unbudgeted = parseFloat(unbudgetedString.replace(/[^0-9.-]+/g, ''));
    }

    getAccountBalances();
    const budgetItems = await SendRequest('https://api.everydollar.com/budget/budgets/442181ce-0b6e-4cc6-ae4d-d8fdcc85b0c5');

    budgetItems._embedded["budget-group"].forEach(group => {
        group._embedded["budget-item"].forEach(budgetItem => {
            if (budgetItem.type == "income") {
                getIncomeDetails(budgetItem);
            } else if (budgetItem.type == "expense") {
                getExpenseDetails(budgetItem);
            } else if (budgetItem.type == "sinking_fund") {
                getFundDetails(budgetItem);
            } else if (budgetItem.type == "debt") {
                getDebtDetails(budgetItem);
            }
        });
    });

    await getUntracked();
}

async function getUntracked() {
    const transactions = await SendRequest('https://api.everydollar.com/budget/transactions');

    balances.unTrackedBalance = 0;

    transactions._embedded.transaction.forEach(transaction => {
        if (transaction._embedded.allocation.length == 0) {
            balances.unTrackedBalance += transaction.amount.usd;
        }
    });
}

//Converts a number to a currency formatted string
function convertToCurrency(content) {
    return "$" + content.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

//Inserts htmlObject at the appropriate location on the page
function updateDisplay(htmlObject, classNames = "") {
    var balanceNode;

    htmlObject.setAttribute("id", "balanceExtensionBalance");
    htmlObject.setAttribute("class", "money money--remaining " + classNames);
    htmlObject.addEventListener("click", main);

    balanceNode = document.getElementById("balanceExtensionBalance");

    if (balanceNode) {
        balanceNode.parentNode.replaceChild(htmlObject, balanceNode);
    } else {
        parentNode = document.getElementsByClassName("ui-app-icon-tray IconTray")[0];
        beforeNode = document.getElementsByClassName("IconTray-item IconTray-item--accounts")[0];
        parentNode.insertBefore(htmlObject, beforeNode);
    }
}

//Displays a spinner
function startSpinner(target) {
    var opts = {
        lines: 13, // The number of lines to draw
        length: 14, // The length of each line
        width: 7, // The line thickness
        radius: 21, // The radius of the inner circle
        scale: 1, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#000', // #rgb or #rrggbb or array of colors
        opacity: 0.25, // Opacity of the lines
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        position: 'absolute', // Element positioning
    };

    var spinner = new Spinner(opts).spin();
    target.replaceChild(spinner.el, target.firstChild);
}

function getCurrentBudget() {
    SendRequest('https://api.everydollar.com/budget/budgets?current=true');

}

async function getIncomeDetails(budgetItem) {
    budgetItem._embedded.allocation.forEach(allocation => {
        balances.receivedIncome += allocation.amount.usd;
    });

    incomePayments.push({"Name": budgetItem.Label, "Amount": budgetItem.amount_budgeted / 100});
}

async function getExpenseDetails(budgetItem) {
    var spentThisMonth = 0;

    const planned = budgetItem.amount_budgeted.usd;
    balances.planned += planned;

    budgetItem._embedded.allocation.forEach(allocation => {
        spentThisMonth += allocation.amount.usd;
    });

    balances.spentThisMonth += spentThisMonth;
    balances.nonFundRemaining += planned + spentThisMonth;
    nonFunds.push({"Name": budgetItem.label, "Amount": -planned / 100});
}

async function getFundDetails(budgetItem) {
    var spentThisMonth = 0;

    const planned = budgetItem.amount_budgeted.usd;
    balances.planned += planned;
    balances.fundStarting += budgetItem.starting_balance.usd;

    budgetItem._embedded.allocation.forEach(allocation => {
        spentThisMonth += allocation.amount.usd;
    });

    balances.spentThisMonth += spentThisMonth;
}

async function getDebtDetails(budgetItem) {
    var spentThisMonth = 0;

    const planned = budgetItem.amount_budgeted.usd;
    balances.planned += planned;

    budgetItem._embedded.allocation.forEach(allocation => {
        spentThisMonth += allocation.amount.usd;
    });

    balances.spentThisMonth += spentThisMonth;
    balances.nonFundRemaining += planned + spentThisMonth;
    debtPayments.push({"Name": budgetItem.label, "Amount": -planned / 100});
}

async function getAccountBalances() {
    const accounts = await SendRequest('https://www.everydollar.com/app/api/accounts');
    accounts.forEach(element => {
        element.accounts.forEach(account => {
            allAccounts.set(element.name.concat(account.name), account.balance);
        });
    });

    balances.bankBalance = allAccounts.get(accountName);
}

//Get the list of institutions
function getInstitutions() {
    var institutionList = document.getElementsByClassName("InstitutionLogin-name");
    
    institutions = [];
    for (var institution = 0; institution < institutionList.length; institution++) {
        institutions.push(institutionList[institution].innerText);
    }
}

//Updates the balances
async function updateBalances() {
    var valElements = document.getElementsByClassName("modal-body");
    var valElements = document.getElementsByClassName("BankAccount-balance");
    for (var ndx = 0; ndx < valElements.length; ndx++) {
        startSpinner(valElements[ndx]);
    }

    await updateReconcile();
    
    closeModal();
    displayModal();
}

//Closes the modal window
function closeModal() {
    var reactNode = document.getElementsByClassName("ReactModalPortal")[0];
    if (reactNode && reactNode.childElementCount > 0) {
        reactNode.removeChild(reactNode.lastChild);
    }
}

function getDigits(number) {
    return number.toString().slice(0,-2);
}

function getDec(number) {
    return number.toString().slice(-2);
}

//Displays the modal window with balance information
function displayModal() {
    var strClass;
    var strSign;
 
    balances.remainingBalance = balances.fundStarting + balances.receivedIncome + balances.spentThisMonth + balances.unTrackedBalance;

    if (balances.bankBalance == balances.remainingBalance) {
        strClass = " money--remaining";
    } else {
        strClass = " money--danger";
    }
    modalNode = document.createElement("div");
    modalNode.innerHTML = strModal.format(
        getDigits(balances.bankBalance), getDec(balances.bankBalance),
        strClass, balances.remainingBalance < 0 ? "-" : "", Math.abs(getDigits(balances.remainingBalance)), getDec(balances.remainingBalance),
        "", balances.fundStarting < 0 ? "-" : "", Math.abs(getDigits(balances.fundStarting)), getDec(balances.fundStarting),
        "", balances.receivedIncome < 0 ? "-" : "", Math.abs(getDigits(balances.receivedIncome)), getDec(balances.receivedIncome),
        "", balances.spentThisMonth < 0 ? "-" : "", Math.abs(getDigits(balances.spentThisMonth)), getDec(balances.spentThisMonth),
        getDigits(balances.nonFundRemaining), getDec(balances.nonFundRemaining)
    );

    var reactNode = document.getElementsByClassName("ReactModalPortal")[0];
    reactNode.appendChild(modalNode);

    var closeButton = document.getElementById("Modal_close");
    closeButton.addEventListener("click", closeModal);

    var refreshButton = document.getElementById("modalRefreshButton");
    refreshButton.addEventListener("click", updateBalances);

    var collDivs = document.getElementsByClassName("collapsible");
    var collArrowPath = document.getElementById("ReconcileCollapse");
    var i;

    // Cause the lower fields to collapse
    for (i = 0; i < collDivs.length; i++) {
        collDivs[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
                collArrowPath.setAttribute('transform','');
            } else {
                content.style.display = "block";
                collArrowPath.setAttribute('transform','rotate(180, 20, 20)');
            }
        });
    }
}

//Adds the plugin button to the top of the page
function insertButton() {
    if (!reconcileButton) {
        // Reconcile Button
        reconcileButton = document.createElement("div");
        reconcileButton.classList.add("OperationsPanelTabItem");
        reconcileButton.innerHTML = strReconcileButton;
        reconcileButton.addEventListener("click", displayModal);

        // Daily Balance Button
        dailyButton = document.createElement("div");
        dailyButton.classList.add("OperationsPanelTabItem");
        dailyButton.innerHTML = strDailyBalanceButton;
        dailyButton.addEventListener("click", displayDailyBalance);

        parentNode = document.getElementsByClassName("OperationsPanelHeader")[0];
        parentNode.appendChild(reconcileButton);
        parentNode.appendChild(dailyButton);
    }
}

function getUserInfo() {
    const userIdRegex = RegExp('(?<="userId":")[^"]*');
    const userTokenRegex = RegExp('(?<="userToken":")[^"]*');
    const uuidRegex = RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

    const userData = document.evaluate('//script[contains(text(),"window.userData")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
    userId = userIdRegex.exec(userData)[0];
    authHeader = "Bearer {0}".format(userTokenRegex.exec(userData)[0]);

    const budgetData = document.evaluate('//div[contains(@data-testid, "BudgetItemRow")]/@data-testid', document, null, XPathResult.STRING_TYPE, null).stringValue;    
    UUID = uuidRegex.exec(budgetData)[0];
}

//Main function is called on page load or button click
function main(evt) {
    getUserInfo();
    getAccountBalances();
    updateReconcile();
    insertButton();
}

//Event is fired when the page is finished loading
var checkExist = setInterval(function() {

    //Determine when the page is finished loading by the existence of the tray
    var accountIcon = document.getElementsByClassName("AccountIcon");
    if (accountIcon.length > 0) {
        main();
        clearInterval(checkExist);

        //The button is removed when the month is changed so recreate it
        var observer = new MutationObserver(function(mutations) {
            if (!document.body.contains(reconcileButton) && document.body.contains(accountIcon[0])) {
                reconcileButton = null;
                main();
            }
        });
        observer.observe(document.body, {
            childList: true
        });
    }
}, 100);