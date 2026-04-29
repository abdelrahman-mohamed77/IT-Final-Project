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
/*the cart section in category*/
function getCart() { //read the card
  return JSON.parse(localStorage.getItem('cityguys-cart')) || [];
}
function saveCart(cart) {//save it
  localStorage.setItem('cityguys-cart', JSON.stringify(cart));
}
function addToCart(name, price, img, brand) {//add it
  const cart = getCart();
    const existingItem = cart.find(item => item.name === name);

  if (existingItem) { //if we add it add one more
    existingItem.qty += 1;
  } else {//add it if we dont have it
    cart.push({
      name: name,
      price: parseFloat(price),
      img: img,
      brand: brand,
      qty: 1
    });
  }
    saveCart(cart);
  shownote(name + ' added to cart!');
  updateCartCount();//update the cart count for another item
}
//show the note tap
function shownote(message) {
  const oldnote = document.querySelector('.cart-note');
  const note = document.createElement('div');
  note.className = 'cart-note';
  note.textContent = message;
  document.body.appendChild(note);
  setTimeout(() => note.classList.add('show'));

  //delete it after 2.5s
  setTimeout(() => {
    note.classList.remove('show');
    setTimeout(() => note.remove(), 100);},2500);
}
// add to cart in category bottuns
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(function(btn) {
  btn.addEventListener('click', function() {
    const name  = btn.getAttribute('data-name');
    const price = btn.getAttribute('data-price');
    const img   = btn.getAttribute('data-img');
    const brand = btn.getAttribute('data-brand');
    addToCart(name, price, img, brand);
  });
});
updateCartCount();//update the cart count
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  let badge = document.querySelector('.cart-count-badge');
  const cartIcon = document.querySelector('a.cart-icon, a.cart');
  if (totalItems > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-count-badge';
      if (cartIcon) {
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
      }
    }
    badge.textContent = totalItems;
  } else if (badge) {
    badge.remove();
  }
}
//this code work only in the cart page
function renderCart() {
  const cartItemsContainer = document.querySelector('.cart-left');
  if (!cartItemsContainer) return;

  const cart = getCart();
//delete the old items rows
  const oldRows = cartItemsContainer.querySelectorAll('.product-row');
  oldRows.forEach(row => row.remove());

  const hr = cartItemsContainer.querySelector('hr');

  if (cart.length === 0) {//if the cart is empty
    const emptyMsg = document.createElement('p');
    emptyMsg.textContent = 'Your cart is empty.';
    emptyMsg.style.cssText = 'text-align:center; padding:40px; color:var(--text-color2); font-size:1.2rem;';
    hr.insertAdjacentElement('afterend', emptyMsg);
    updateSummary(cart);
    return;
  }
//the item place
  cart.forEach(function(item, index) {
    const row = document.createElement('div');
    row.className = 'product-row';
    row.innerHTML = `
      <div class="product-info prod">
        <img src="${item.img}" alt="${item.name}" class="cart-img" />
        <div class="product-details">
          <p class="bn">${item.name}</p>
          <p class="brand">${item.brand}</p>
        </div>
      </div>
      <div class="item-price">
        <p><b>${item.price.toLocaleString()}$</b></p>
      </div>
      <div class="item-qty">
        <div class="qty-selector">
          <button class="qty-minus" data-index="${index}">−</button>
          <input type="text" value="${item.qty}" readonly />
          <button class="qty-plus" data-index="${index}">+</button>
        </div>
      </div>
      <div class="total">
        <p><b>${(item.price * item.qty).toLocaleString()}$</b></p>
      </div>
      <div class="remove-item" data-index="${index}">×</div>
    `;
    hr.insertAdjacentElement('afterend', row);//add the new row after the old one
  });

  bindCartEvents();//the buttons
  updateSummary(cart);
}

function bindCartEvents() {//the buttons
  document.querySelectorAll('.qty-plus').forEach(function(btn) {//plus button
    btn.addEventListener('click', function() {
      const index = parseInt(btn.getAttribute('data-index'));
      const cart = getCart();
      cart[index].qty += 1;
      saveCart(cart);
      renderCart();
      updateCartCount();
    });
  });
//the minus button
  document.querySelectorAll('.qty-minus').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const index = parseInt(btn.getAttribute('data-index'));
      const cart = getCart();
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1);//delete it if the count is zero
      }
      saveCart(cart);
      renderCart();
      updateCartCount();
    });
  });
//the delete button
  document.querySelectorAll('.remove-item').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const index = parseInt(btn.getAttribute('data-index'));
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    });
  });
}

function updateSummary(cart) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const summaryLines = document.querySelectorAll('.summary-line span:last-child');
  if (summaryLines.length >= 1) {
    summaryLines[0].textContent = total.toLocaleString() + '$';
  }
  const grandTotal = document.querySelector('.grand-total');
  if (grandTotal) {
    grandTotal.textContent = total.toLocaleString() + '$';
  }
}

updateCartCount();
renderCart();