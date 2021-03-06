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

var strButton = `
<div id="IconTray_accounts" class="IconTray-item IconTray-item--accounts">
    <div class="IconTray-caption">Reconcile</div>
    <div class="IconTray-icon"><svg class="AccountIcon" fill="#A7A9AC" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path style="fill:#606060;" d="M176.102,175.906c0,10.833,4.123,19.093,12.376,24.766c8.257,5.672,20.769,10.059,37.535,13.156v-74.292c-18.833,2.067-31.863,6.256-39.077,12.58C179.715,158.431,176.102,166.368,176.102,175.906z"/><path style="fill:#606060;" d="M429.631,271.797c-9.759-16.304-22.604-29.697-38.17-39.803c-14.588-9.471-31.235-16.757-49.468-21.649c-9.936-2.666-20.047-5.041-30.221-7.097v-39.239c24.928,3.152,51.499,9.282,79.322,18.316l31.72,10.296V65.44l-16.256-5.669c-17.531-6.11-36.911-10.943-57.613-14.371c-12.481-2.063-24.915-3.704-37.172-4.911V0H201.775v43.121c-14.403,2.6-27.863,6.118-40.206,10.52c-19.266,6.876-36,16.166-49.736,27.614c-14.312,11.925-25.464,26.336-33.141,42.813c-7.673,16.45-11.566,35.196-11.566,55.713c0,25.31,5.226,46.73,15.515,63.638c9.921,16.347,23.037,29.708,38.998,39.704c14.888,9.322,31.756,16.375,50.118,20.959c9.882,2.473,19.918,4.658,30.017,6.537v38.797c-3.294-0.249-6.497-0.532-9.598-0.856c-10.419-1.096-20.403-2.56-29.677-4.343c-9.33-1.794-18.541-3.98-27.385-6.485c-8.982-2.544-18.339-5.562-27.819-8.967l-32.43-11.648v125.87l14.178,6.47c16.568,7.559,37.286,13.456,61.578,17.531c16.265,2.722,33.397,4.707,51.153,5.929V512h109.996v-43.066c37.05-6.579,67.105-19.136,89.551-37.444c28.899-23.57,43.55-56.056,43.55-96.553C444.873,309.963,439.749,288.724,429.631,271.797z M386.005,412.71c-23.085,18.828-55.91,30.56-98.47,35.203v39.85h-61.523v-37.914c-25.278-0.769-49.077-3.034-71.386-6.769c-22.312-3.739-40.817-8.966-55.523-15.676v-75.831c10.059,3.614,19.854,6.769,29.4,9.475c9.547,2.706,19.354,5.03,29.413,6.966c10.063,1.937,20.631,3.48,31.724,4.647c11.093,1.156,23.219,1.87,36.371,2.122v-84.738c-16.245-2.319-32.375-5.472-48.363-9.476c-15.996-3.992-30.375-9.992-43.145-17.988c-12.769-8.001-23.156-18.577-31.14-31.737c-8.004-13.152-12-30.173-12-51.065c0-17.03,3.097-32.182,9.294-45.464c6.185-13.283,15.077-24.765,26.69-34.442c11.601-9.669,25.727-17.468,42.367-23.405c16.635-5.932,35.405-10.059,56.297-12.383v-39.85h61.523v38.691c18.825,1.029,37.973,3.167,57.456,6.386c19.476,3.223,37.337,7.681,53.586,13.345v76.613c-39.72-12.896-76.746-20.123-111.042-21.673v85.906c16.252,2.576,32.308,5.988,48.174,10.249c15.862,4.256,30.044,10.446,42.557,18.568c12.513,8.127,22.695,18.77,30.572,31.926c7.862,13.156,11.799,30.055,11.799,50.691C420.636,367.959,409.094,393.877,386.005,412.71z"/><path style="fill:#606060;" d="M323.709,311.912c-7.866-5.546-19.922-9.736-36.174-12.572v72.738c31.977-4.119,47.977-15.992,47.977-35.598C335.512,325.647,331.579,317.462,323.709,311.912z"/></svg></div>
</div>
`;

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

//Closes any open card
function CloseCard() {
    var closeButtons = document.getElementsByClassName("CloseIcon");
    closeButtons[0].parentElement.click();
    closeButtons[0].parentElement.click();
}

//Goes through each fund and calculates the balance of all budgets
function getRemaining(balances) {
    debugger;
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

    var currentMonth = (new Date()).toLocaleString('default', { month: 'short' });

    CloseCard();

    /*
    //Start by subtracting the expected incomes
    var incomeGroup = document.getElementsByClassName("Budget-budgetGroup Budget-budgetGroup--income");
    for (var income = 0; income < incomeGroup.length; income++) {
        incomePlannedElements = incomeGroup[income].getElementsByClassName("input--inline--budget--sm no-wrap text--right");
        for (var ndx = 0; ndx < incomePlannedElements.length; ndx++) {
            //balances.remainingBalance -= parseFloat(incomePlannedElements[ndx].getAttribute("value").replace(/[^0-9.-]+/g, ''));
        }
    }
    */

    //Add recieved incomes, this should result in 0 remainingBalance at the end of the month
    var incomeReceivedElements = document.getElementsByClassName("money BudgetItem-secondColumn money--received");
    for (income = 0; income < incomeReceivedElements.length; income++) {
        balances.receivedIncome += parseFloat(incomeReceivedElements[income].getAttribute("data-text").replace(/[^0-9.-]+/g, ''));
    }
    balances.remainingBalance += balances.receivedIncome;

    //Grab the amount left to budget from under the income card
    var remainingString = document.evaluate('//div[@class="AmountBudgeted"]//span[@class="money undefined"]/@data-text', document, null, XPathResult.STRING_TYPE, null).stringValue;
    if (remainingString != "") {
        balances.remainingBalance += parseFloat(remainingString.replace(/[^0-9.-]+/g, ''));
    }

    //Loop through all the budget lines and add the balances to remainingBalance
    var expenseGroups = document.getElementsByClassName("Budget-budgetGroup Budget-budgetGroup--expense");
    for (var expense = 0; expense < expenseGroups.length; expense++) {
        expenseRemainingElements = expenseGroups[expense].getElementsByClassName("BudgetItemRow-content");
        for (var ndx = 0; ndx < expenseRemainingElements.length; ndx++) {
            
            //Sum the planned and remaining
            planned = parseFloat(expenseRemainingElements[ndx].getElementsByClassName("BudgetItemRow-input BudgetItemRow-input--amountBudgeted input--inline--budget--sm no-wrap text--right")[0].attributes["value"].value.replace(/[^0-9.-]+/g, ''));
            balances.planned += planned;
            //balances.remainingBalance += parseFloat(expenseRemainingElements[ndx].getElementsByClassName("money BudgetItem-secondColumn money--remaining")[0].attributes["data-text"].value.replace(/[^0-9.-]+/g, ''));

            //Nonfund
            if (expenseRemainingElements[ndx].getElementsByTagName("img").length == 0) {
                tempCurr = parseFloat(expenseRemainingElements[ndx].getElementsByClassName("money BudgetItem-secondColumn money--remaining")[0].attributes["data-text"].value.replace(/[^0-9.-]+/g, ''));
                balances.spentThisMonth -= (planned - tempCurr);
                balances.nonFundRemaining += tempCurr;
            } else {
                //Fund
                //Sum the fund balances
                expenseRemainingElements[ndx].click();
                document.getElementsByClassName("Expander-title")[1].click();

                //Starting Balance
                tempString = document.evaluate('//div[@class="BudgetItemDetails-formRow BudgetItemDetails-formRow--bottomMarginSm"]//input/@data-text', document, null, XPathResult.STRING_TYPE, null).stringValue;
                if (tempString != "") {
                    balances.fundStarting += parseFloat(tempString.replace(/[^0-9.-]+/g, ''));
                }

                //Spent this month
                tempString = document.evaluate('//div[@class="BudgetItemDetails-formRowAmount BudgetItemDetails-formRow--spent"]/span/@data-text', document, null, XPathResult.STRING_TYPE, null).stringValue;
                if (tempString != "") {
                    //debugger;
                    balances.spentThisMonth += parseFloat(tempString.replace(/[^0-9.-]+/g, ''));
                }
            }
            CloseCard()
        }
    }

    balances.remainingBalance = balances.fundStarting - balances.spentThisMonth;

    //Add the debt items as well, their formatting is weird so I have to do math
    var debtGroup = document.getElementsByClassName("Budget-budgetGroup Budget-budgetGroup--debt Budget-budgetGroup--debtShowBalance");
    for (var debt = 0; debt < debtGroup.length; debt++) {
        debtRows = debtGroup[debt].getElementsByClassName("BudgetItemRow");
        for (var row = 0; row < debtRows.length; row++) {
            budgeted = parseFloat(debtRows[row].getElementsByClassName("input--inline--budget--sm no-wrap text--right")[0].value.replace(/[^0-9.-]+/g, ''));
            paidOff = parseFloat(debtRows[row].getElementsByClassName("money BudgetItem-secondColumn")[1].getAttribute("data-text").replace(/[^0-9.-]+/g, ''));
            balances.planned += budgeted;
            balances.spentThisMonth -= paidOff;
            balances.nonFundRemaining += budgeted - paidOff;
        }
    }

    //Get the total of untracked transactions
    document.getElementById("IconTray_transactions").click();
    document.getElementById("unallocated").click();
    var unTrackedIterator = document.evaluate('//div[contains(@class, "ui-item--card transaction-card transaction-card--unallocated")]//span[@class="money ui-flex--ellipsis"]/@data-text', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var unTracked = unTrackedIterator.iterateNext();
    while (unTracked) {
        balances.unTrackedBalance += parseFloat(unTracked.value.replace(/[^0-9.-]+/g, ''));
        unTracked = unTrackedIterator.iterateNext();
    }
    balances.remainingBalance += balances.unTrackedBalance;

    /* Not working because not all the transactions load
    //Get all tracked transactions
    document.getElementById("allocated").click()
    //setTimeout(getTracked, 1000);
    var trackedIterator = document.evaluate('//div[@class="ui-item--card transaction-card transaction-card--allocated"]//div[div/div/span="' + currentMonth + '"]//span[@class="money ui-flex--ellipsis"]/@data-text', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    var tracked = trackedIterator.iterateNext();
    while (tracked) {
        balances.tracked += parseFloat(tracked.value.replace(/[^0-9.-]+/g, ''));
        tracked = trackedIterator.iterateNext();
    }
    */
    
    CloseCard()

    balances.remainingBalance = balances.fundStarting + balances.receivedIncome + balances.spentThisMonth + balances.unTrackedBalance;

    balances.fundStarting = parseFloat(balances.fundStarting.toFixed(2));
    balances.receivedIncome = parseFloat(balances.receivedIncome.toFixed(2));
    balances.spentThisMonth = parseFloat((balances.spentThisMonth).toFixed(2));
    balances.unTrackedBalance = parseFloat(balances.unTrackedBalance.toFixed(2));
    balances.remainingBalance = parseFloat(balances.remainingBalance.toFixed(2));

    balances.planned = parseFloat(balances.planned.toFixed(2));
    balances.bankBalance = getAccountBalance();
    balances.nonFundRemaining = parseFloat(balances.nonFundRemaining.toFixed(2));
}

function getTracked() {
    debugger;
    var currentMonth = (new Date()).toLocaleString('default', { month: 'short' });
    var trackedIterator = document.evaluate('//div[@class="ui-item--card transaction-card transaction-card--allocated"]//div[div/div/span="' + currentMonth + '"]//span[@class="money ui-flex--ellipsis"]/@data-text', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null)
    var tracked = trackedIterator.iterateNext();
    while (tracked) {
        balances.tracked += parseFloat(tracked.value.replace(/[^0-9.-]+/g, ''));
        tracked = trackedIterator.iterateNext();
    }
}

//Converts a number to a currency formatted string
function convertToCurrency(content) {
    return "$" + content.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
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

//Gets the first account balance
function getAccountBalance() {
    var accountTrayIcon = document.getElementsByClassName("IconTray-item IconTray-item--accounts");
    accountTrayIcon[1].click();

    var fltBalance = parseFloat(document.evaluate('//div[@class="BankAccount-balance"]/span/@data-text', document, null, XPathResult.STRING_TYPE, null).stringValue.replace(/[^0-9.-]+/g, ''));

    document.evaluate('//button[@class="close"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

    return fltBalance;
}

//Updates the balances
function updateBalances() {
    var valElements = document.getElementsByClassName("modal-body");
    //var valElements = document.getElementsByClassName("BankAccount-balance");
    for (var ndx = 0; ndx < valElements.length; ndx++) {
        startSpinner(valElements[ndx]);
    }

    setTimeout(function() {
        closeModal();
        getRemaining(balances);
        displayModal();
    }, 0);
}

//Closes the modal window
function closeModal() {
    var reactNode = document.getElementsByClassName("ReactModalPortal")[0];
    reactNode.removeChild(reactNode.lastChild);
}

//Displays the modal window with balance information
function displayModal() {
    var strClass;
    var strSign;
    if (balances.bankBalance == (balances.remainingBalance).toFixed(2)) {
        strClass = " money--remaining";
    } else {
        strClass = " money--danger";
    }
    modalNode = document.createElement("div");
    modalNode.innerHTML = strModal.format(
        Math.trunc(balances.bankBalance), balances.bankBalance.toFixed(2).slice(-2),
        strClass, balances.remainingBalance < 0 ? "-" : "", Math.trunc(Math.abs(balances.remainingBalance)), balances.remainingBalance.toFixed(2).slice(-2),
        "", balances.fundStarting < 0 ? "-" : "", Math.trunc(Math.abs(balances.fundStarting)), balances.fundStarting.toFixed(2).slice(-2),
        "", balances.receivedIncome < 0 ? "-" : "", Math.trunc(Math.abs(balances.receivedIncome)), balances.receivedIncome.toFixed(2).slice(-2),
        "", balances.spentThisMonth < 0 ? "-" : "", Math.trunc(Math.abs(balances.spentThisMonth)), balances.spentThisMonth.toFixed(2).slice(-2),
        Math.trunc(balances.nonFundRemaining), balances.nonFundRemaining.toFixed(2).slice(-2)
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
    if (!pluginButton) {
        pluginButton = document.createElement("div");
        pluginButton.innerHTML = strButton;

        pluginButton.setAttribute("id", "pluginButton");
        pluginButton.addEventListener("click", displayModal);
    }

    parentNode = document.getElementsByClassName("ui-app-icon-tray IconTray")[0];
    beforeNode = document.getElementsByClassName("IconTray-item IconTray-item--accounts")[0];
    parentNode.insertBefore(pluginButton, beforeNode);
}

var pluginButton;

//Main function is called on page load or button click
function main(evt) {
    insertButton();
    setTimeout(getRemaining(balances), 0);
}

//Event is fired when the page is finished loading
var checkExist = setInterval(function() {

    //Determine when the paged is finished loading if the tray exists
    accountIcon = document.getElementsByClassName("AccountIcon");
    if (accountIcon.length > 0) {
        main();
        clearInterval(checkExist);

        //The button is removed when the month is changed so recreate it
        var observer = new MutationObserver(function(mutations) {
            if (!document.body.contains(pluginButton) && document.body.contains(accountIcon[0])) {
                main();
            }
        });
        observer.observe(document.body, {
            childList: true
        });
    }
}, 100);