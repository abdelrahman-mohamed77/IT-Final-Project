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

//تغيير الزرار للون الاسود
const btn = document.querySelector(".continue-btn");

btn.onclick = function() {
  btn.style.background = "black";
};
const card = document.querySelector(".card");

card.onmouseover = function() {
  card.style.transform = "scale(1.05)";
};

card.onmouseout = function() {
  card.style.transform = "scale(1)";
};

// زرار ال scroll
const topBtn = document.getElementById("up");
topBtn.onclick = function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

// يظهر ويختفي
window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});

// اظهار ال password
let isVisible = false;

function togglePassword() {
  const passSpan = document.getElementById("password");
  const btn = document.getElementById("show-hide");

  const realPass = localStorage.getItem("password");

  if (isVisible) {
    passSpan.innerText = "********";
    btn.innerText = "Show";
    isVisible = false;
  } else {
    passSpan.innerText = realPass;
    btn.innerText = "Hide";
    isVisible = true;
  }
}
// عرض ال username & email & password
document.querySelector(".username").innerText = localStorage.getItem("username");
document.querySelector(".user-email").innerText =localStorage.getItem("email");
document.querySelector(".user-password").innerText =localStorage.getItem("password");

