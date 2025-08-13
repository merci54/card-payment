const cardNumber = document.querySelector(".card-Number");
const cardName = document.querySelector(".cardholder-name");
const cardExpDate = document.querySelector(".exp-date");

const form = document.querySelector("form");
const inputName = document.querySelector("#name");
const inputNumber = document.querySelector("#card-number");
const inputMonth = document.querySelector("#month");
const inputYear = document.querySelector("#year");

const infoErr = document.querySelectorAll(".info-err");
const complete = document.querySelector(".complete");

const showError = (input, arrInfoErr, message) => {
  input.classList.add("input-err");
  infoErr[arrInfoErr].classList.add("d-block");
  infoErr[arrInfoErr].textContent = message;
};

const hideError = (input, arrInfoErr) => {
  input.classList.remove("input-err");
  infoErr[arrInfoErr].classList.remove("d-block");
};

let inputNameValue;
let inputNumberValue;
let inputMonthValue = "00";
let inputYearValue = "00";

const validateInput = (input, arrInfoErr, wordLength) => {
  if (!wordLength) {
    if (!input.value) {
      showError(input, arrInfoErr, "Can’t be blank");
    } else {
      hideError(input, arrInfoErr);
      inputNameValue = input.value;
    }
  } else {
    if (!input.value) {
      showError(input, arrInfoErr, "Can’t be blank");
    } else if (!/^\d+(\s\d+)*$/.test(input.value)) {
      showError(input, arrInfoErr, "Wrong format, numbers only");
    } else if (input.value.length < wordLength) {
      if (wordLength > 3) {
        showError(input, arrInfoErr, "Card number must be 16 numbers");
      } else {
        showError(input, arrInfoErr, `must be ${wordLength} numbers`);
      }
    } else {
      hideError(input, arrInfoErr);

      switch (input) {
        case inputNumber:
          inputNumberValue = input.value;
          break;
        case inputMonth:
          inputMonthValue = input.value;
          break;
        case inputYear:
          inputYearValue = input.value;
          break;
      }
    }
  }
};

function restrictNumber(event) {
  var z = event.charCode;
  if ((z > 64 && z < 91) || (z > 96 && z < 123) || z == 32) return true;
  else {
    alert("Only characters is allowed");
    return false;
  }
}

inputName.addEventListener("input", (e) => {
  e.preventDefault();
  inputNameValue = e.target.value;
  cardName.textContent = inputNameValue;
});

function restrictAlphabets(e) {
  var x = e.which || e.keycode;
  if (x >= 48 && x <= 57) {
    return true;
  } else {
    alert("Value must be a number");
    return false;
  }
}

inputNumber.addEventListener("input", (e) => {
  e.preventDefault();
  let formatText = e.target.value;
  formatText = formatText.substring(0, 19);
  formatText = formatText
    .replace(/\s/g, "")
    .replace(new RegExp(`(.{${4}})`, "g"), "$1 ")
    .trim();
  e.target.value = formatText;
  inputNumberValue = e.target.value;
  cardNumber.textContent = inputNumberValue;
});

const deleteSpace = (input) => {
  if (/\s/.test(input.value)) {
    let formatText = input.value.replace(/\s/g, "");
    input.value = formatText;
  }
};

inputMonth.addEventListener("input", (e) => {
  e.preventDefault();
  deleteSpace(inputMonth);
  inputMonthValue = e.target.value;
  cardExpDate.textContent = inputMonthValue + "/" + inputYearValue;
});

inputYear.addEventListener("input", (e) => {
  e.preventDefault();
  deleteSpace(inputYear);
  inputYearValue = e.target.value;
  cardExpDate.textContent = inputMonthValue + "/" + inputYearValue;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  inputNameValue = "";
  inputNumberValue = "";
  inputMonthValue = "00";
  inputYearValue = "00";

  validateInput(inputName, 0);
  validateInput(inputNumber, 1, 19);
  validateInput(inputMonth, 2, 2);
  validateInput(inputYear, 2, 2);

  if (inputNameValue && inputNumberValue && inputMonthValue && inputYearValue) {
    cardName.textContent = inputNameValue;
    cardNumber.textContent = inputNumberValue;
    cardExpDate.textContent = inputMonthValue + "/" + inputYearValue;

    form.classList.add("d-none");
    complete.classList.add("d-block");
  }
});

complete.addEventListener("click", () => {
  location.reload(true);
});
