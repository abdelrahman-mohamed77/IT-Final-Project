let darkmode = localStorage.getItem("dark-mode");
const themeSwitch = document.getElementById("theme-switch");

const enableDarkmode = () => {
  document.body.classList.add("dark-mode");
  localStorage.setItem("dark-mode", "active");
};
const disableDarkmode = () => {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("dark-mode", "inactive");
};
if (darkmode === "active") {
  enableDarkmode();
}
themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem("dark-mode");
  if (darkmode !== "active") {
    enableDarkmode();
  } else {
    disableDarkmode();
  }
});
