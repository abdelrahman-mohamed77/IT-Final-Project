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





/* Product Filtering*/
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const producttext = document.querySelectorAll('.product-text');
filterButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    
    const filterValue = button.getAttribute('data-filter');

    productCards.forEach(function(card) {
      const cardCategory = card.getAttribute('data-category') || "";
      const cardSize = card.getAttribute('data-size') || "";
      const cardPrice = card.getAttribute('data-price') || "";
      if (cardCategory === filterValue || cardSize === filterValue || cardPrice === filterValue) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none'; 
      }
    });
  });
});


      /*home filter links*/

window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterValue = urlParams.get('filter');

    if (filterValue) {
  
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterValue}"]`);
        
        if (targetBtn) {
            targetBtn.click(); 
        }
    }
});