//////////////////////////////////////////////////////////
/*DARK MODEM CODE*/
/////////////////////////////////////////////////////////
let darkmode = localStorage.getItem("dark-mod");
const themeSwitch = document.getElementById("theme-switch");

const enableDarkmode = () => {
  document.body.classList.add("dark-mod");
  localStorage.setItem("dark-mod", "active");
};
const disableDarkmode = () => {
  document.body.classList.remove("dark-mod");
  localStorage.setItem("dark-mod", "inactive");
};
if (darkmode === "active") {
  enableDarkmode();
}
themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("dark-mod");
  if (darkmode !== "active") {
    enableDarkmode();
  } else {
    disableDarkmode();
  }
});
/////////////////////////////////////////////////////////
/*PRODUCT FILTERING*/
////////////////////////////////////////////////////////

/* Product Filtering*/
const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");
const producttext = document.querySelectorAll(".product-text");
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const filterValue = button.getAttribute("data-filter");

    productCards.forEach(function (card) {
      const cardCategory = card.getAttribute("data-category") || "";
      const cardSize = card.getAttribute("data-size") || "";
      const cardPrice = card.getAttribute("data-price") || "";
      if (
        cardCategory === filterValue ||
        cardSize === filterValue ||
        cardPrice === filterValue
      ) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
});

/*home filter links*/

window.addEventListener("load", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const filterValue = urlParams.get("filter");

  if (filterValue) {
    const targetBtn = document.querySelector(
      `.filter-btn[data-filter="${filterValue}"]`,
    );

    if (targetBtn) {
      targetBtn.click();
    }
  }
});
////////////////////////////////////////////////////////////
/*SIGN UP AND LOG IN LOGIC*/
///////////////////////////////////////////////////////////

function flipTo(side) {
  const container = document.getElementById("flip-container");
  const inner = document.getElementById("flip-inner");
  const front = document.querySelector(".flip-front");
  const back = document.querySelector(".flip-back");

  if (side === "signup") {
    container.classList.add("flipped");
    inner.style.minHeight = back.scrollHeight + "px";
  } else {
    container.classList.remove("flipped");
    inner.style.minHeight = front.scrollHeight + "px";
  }
}

window.addEventListener("load", () => {
  const inner = document.getElementById("flip-inner");
  const front = document.querySelector(".flip-front");
  inner.style.minHeight = front.scrollHeight + "px";
});

// -------------------------------------------------------
// GET ALL THE INPUTS FROM THE PAGE
// -------------------------------------------------------

const signInForm = document.getElementById("sign-in-form");
const signUpForm = document.getElementById("sign-up-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const newUsernameInput = document.getElementById("new-username");
const newEmailInput = document.getElementById("new-email");
const newPasswordInput = document.getElementById("new-password");
const confirmPasswordInput = document.getElementById("confirm-password");
const errorMessageElement = document.getElementById("error-message");
const errorMessageSignUp = document.getElementById("error-message-signup");

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// -------------------------------------------------------
// SIGN UP
// -------------------------------------------------------

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  errorMessageSignUp.textContent = "";

  const username = newUsernameInput.value.trim();
  const email = newEmailInput.value.trim();
  const password = newPasswordInput.value.trim();
  const confirm = confirmPasswordInput.value.trim();

  if (!username || !email || !password || !confirm) {
    errorMessageSignUp.textContent = "Please fill in all fields.";
    return;
  }

  if (password !== confirm) {
    errorMessageSignUp.textContent = "Passwords do not match.";
    return;
  }

  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    errorMessageSignUp.textContent = "Username already taken.";
    return;
  }

  // all good — save the new user
  users.push({ username, email, password });
  saveUsers(users);

  // save who is logged in right now
  localStorage.setItem("loggedIn", username);

  // go to home page
  window.location.href = "home.html";
});

// -------------------------------------------------------
// SIGN IN
// -------------------------------------------------------

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  errorMessageElement.textContent = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // check fields filled
  if (!username || !password) {
    errorMessageElement.textContent = "Please fill in all fields.";
    return;
  }

  // look for a matching user
  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    // save who is logged in
    localStorage.setItem("loggedIn", username);
    // go to home page
    window.location.href = "home.html";
  } else {
    errorMessageElement.textContent = "Wrong username or password.";
  }
});
