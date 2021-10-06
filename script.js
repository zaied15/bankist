'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-08-28T23:36:17.929Z',
    '2021-09-02T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date) {
  const calcDays = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

  const dayPassed = calcDays(new Date(), date);

  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days`;
  else {
    const dateHis = `${date.getDate()}`.padStart(2, 0);
    const yearHis = date.getFullYear();
    const monthHis = `${date.getMonth() + 1}`.padStart(2, 0);
    return `${dateHis}/${monthHis}/${yearHis}`;
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const time = new Date(acc.movementsDates[i]);
    const dateHis = time.getDate();
    const yearHis = time.getFullYear();
    const monthHis = time.getMonth() + 1;
    const displayDate = formatMovementDate(time);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  const now = new Date();
  const date = now.getDate();
  const day = now.getDay();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelDate.textContent = `${date}/${month}/${year}`;

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transDate = new Date();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    currentAccount.movementsDates.push(transDate.toISOString());
    receiverAcc.movementsDates.push(transDate.toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const now = new Date();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(now.toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const createUsernames = accounts.forEach(acc => {
//   acc.userName = acc.owner
//     .toLowerCase()
//     .split(' ')
//     .map(single => single[0])
//     .join('');
// });

// const accBalance = accounts.forEach(acc => {
//   acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
// });

// const movementsDisplay = function (account, sort = false) {
//   containerMovements.innerHTML = '';

//   const moves = sort
//     ? account.movements.slice().sort((a, b) => a - b)
//     : account.movements;
//   moves.forEach(function (mov, i, arr) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';

//     const html = `<div class="movements__row">
//   <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
//   <div class="movements__value">${mov}€</div>
// </div>`;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// const depositWithdrawal = function (account) {
//   const deposit = account.movements
//     .filter(mov => mov > 0)
//     .reduce((acc, curr) => acc + curr, 0);
//   labelSumIn.textContent = `${deposit}€`;

//   const withdraw = account.movements
//     .filter(mov => mov < 0)
//     .reduce((acc, curr) => acc + curr, 0);
//   labelSumOut.textContent = `${Math.abs(withdraw)}€`;

//   const interest = account.movements
//     .filter(mov => mov > 0)
//     .map(mov => (mov * account.interestRate) / 100)
//     .filter(int => int >= 1)
//     .reduce((acc, curr) => acc + curr, 0);
//   labelSumInterest.textContent = `${interest}€`;

//   const balance = account.movements.reduce((acc, curr) => acc + curr, 0);
//   labelBalance.textContent = `${balance}€`;
// };

// const updateUI = function (acc) {
//   movementsDisplay(acc);
//   depositWithdrawal(acc);
// };

// // Event Listener Handling
// let currentAccount;

// btnLogin.addEventListener('click', function (e) {
//   e.preventDefault();
//   currentAccount = accounts.find(
//     acc => inputLoginUsername.value === acc.userName
//   );

//   if (Number(inputLoginPin.value) === currentAccount.pin) {
//     inputLoginPin.value = inputLoginUsername.value = '';
//     inputLoginPin.blur();
//     containerApp.style.opacity = 100;

//     labelWelcome.textContent = `Welcome back, ${
//       currentAccount.owner.split(' ')[0]
//     }`;

//     updateUI(currentAccount);
//   }
// });

// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const amount = Number(inputTransferAmount.value);
//   const receiverAcc = accounts.find(
//     acc => inputTransferTo.value === acc.userName
//   );

//   if (
//     receiverAcc &&
//     inputTransferTo.value === receiverAcc.userName &&
//     amount > 0 &&
//     amount < currentAccount.balance
//   ) {
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);

//     updateUI(currentAccount);

//     inputTransferAmount.value = inputTransferTo.value = '';
//   }
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();
//   const loanAmount = Number(inputLoanAmount.value);
//   if (
//     loanAmount > 0 &&
//     currentAccount.movements.some(acc => acc >= loanAmount * 0.1)
//   ) {
//     currentAccount.movements.push(loanAmount);

//     updateUI(currentAccount);
//   }
// });

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();
//   if (
//     inputCloseUsername.value === currentAccount.userName &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.userName === currentAccount.userName
//     );
//     accounts.splice(index, 1);

//     containerApp.style.opacity = 0;
//     inputCloseUsername.value = inputClosePin.value = '';
//   }
// });

// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   movementsDisplay(currentAccount, !sorted);
//   sorted = !sorted;
// });

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomInt(0, 6));

console.log(Math.trunc(20.22));
console.log(Math.trunc(-20.22));

console.log(Math.floor(25.22));
console.log(Math.floor(-25.22));

console.log(Math.round(20.22));
console.log(Math.round(20.5));

console.log(Math.ceil(19.66));
console.log(Math.ceil(18.26));

console.log((23.268).toFixed(5));

const dateT = new Date(2021, 8, 14);
const calcDays = (date1, date2) =>
  Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
console.log(calcDays(dateT, new Date(2021, 8, 20)));
