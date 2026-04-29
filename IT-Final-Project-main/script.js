////////////////////////////
/*DARK MODE*/
///////////////////////////

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
////////////////////////////////////
/* Product Filtering*/
///////////////////////////////////
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
        card.style.opacity = "0";
        setTimeout(() => {
          card.style.opacity = "1";
        }, 150);
      } else {
        card.style.display = "none";
      }
    });
  });
});
///////////////////////////
/*home filter links*/
///////////////////////////
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
/*the cart section in category*/
function getCart() {
  //read the card
  return JSON.parse(localStorage.getItem("cityguys-cart")) || [];
}
function saveCart(cart) {
  //save it
  localStorage.setItem("cityguys-cart", JSON.stringify(cart));
}
function addToCart(name, price, img, brand) {
  //add it
  const cart = getCart();
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    //if we add it add one more
    existingItem.qty += 1;
  } else {
    //add it if we dont have it
    cart.push({
      name: name,
      price: parseFloat(price),
      img: img,
      brand: brand,
      qty: 1,
    });
  }
  saveCart(cart);
  shownote(name + " added to cart!");
  updateCartCount(); //update the cart count for another item
}
//show the note tap
function shownote(message) {
  const oldnote = document.querySelector(".cart-note");
  const note = document.createElement("div");
  note.className = "cart-note";
  note.textContent = message;
  document.body.appendChild(note);
  setTimeout(() => note.classList.add("show"));

  //delete it after 2.5s
  setTimeout(() => {
    note.classList.remove("show");
    setTimeout(() => note.remove(), 100);
  }, 2500);
}
// add to cart in category bottuns
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
addToCartButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    const name = btn.getAttribute("data-name");
    const price = btn.getAttribute("data-price");
    const img = btn.getAttribute("data-img");
    const brand = btn.getAttribute("data-brand");
    addToCart(name, price, img, brand);
  });
});
updateCartCount(); //update the cart count
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  let badge = document.querySelector(".cart-count-badge");
  const cartIcon = document.querySelector("a.cart-icon, a.cart");
  if (totalItems > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "cart-count-badge";
      if (cartIcon) {
        cartIcon.style.position = "relative";
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
  const cartItemsContainer = document.querySelector(".cart-left");
  if (!cartItemsContainer) return;

  const cart = getCart();
  //delete the old items rows
  const oldRows = cartItemsContainer.querySelectorAll(".product-row");
  oldRows.forEach((row) => row.remove());

  const hr = cartItemsContainer.querySelector("hr");

  if (cart.length === 0) {
    //if the cart is empty
    const emptyMsg = document.createElement("p");
    emptyMsg.textContent = "Your cart is empty.";
    emptyMsg.style.cssText =
      "text-align:center; padding:40px; color:var(--text-color2); font-size:1.2rem;";
    hr.insertAdjacentElement("afterend", emptyMsg);
    updateSummary(cart);
    return;
  }
  //the item place
  cart.forEach(function (item, index) {
    const row = document.createElement("div");
    row.className = "product-row";
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
    hr.insertAdjacentElement("afterend", row); //add the new row after the old one
  });

  bindCartEvents(); //the buttons
  updateSummary(cart);
}

function bindCartEvents() {
  //the buttons
  document.querySelectorAll(".qty-plus").forEach(function (btn) {
    //plus button
    btn.addEventListener("click", function () {
      const index = parseInt(btn.getAttribute("data-index"));
      const cart = getCart();
      cart[index].qty += 1;
      saveCart(cart);
      renderCart();
      updateCartCount();
    });
  });
  //the minus button
  document.querySelectorAll(".qty-minus").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const index = parseInt(btn.getAttribute("data-index"));
      const cart = getCart();
      if (cart[index].qty > 1) {
        cart[index].qty -= 1;
      } else {
        cart.splice(index, 1); //delete it if the count is zero
      }
      saveCart(cart);
      renderCart();
      updateCartCount();
    });
  });
  //the delete button
  document.querySelectorAll(".remove-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const index = parseInt(btn.getAttribute("data-index"));
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
  const summaryLines = document.querySelectorAll(
    ".summary-line span:last-child",
  );
  if (summaryLines.length >= 1) {
    summaryLines[0].textContent = total.toLocaleString() + "$";
  }
  const grandTotal = document.querySelector(".grand-total");
  if (grandTotal) {
    grandTotal.textContent = total.toLocaleString() + "$";
  }
}

updateCartCount();
renderCart();

////////////////////////////////////////////////////////////
/*PRODUCTS */
////////////////////////////////////////////////////////////

//ProductDetails Section
const products = [
  {
    //!shirts
    id: "shirt1",
    name: "Urban Polo Shirt",
    price: "$34.99",
    description:
      "A stylish and comfortable polo shirt made from breathable fabric.\nDesigned with a modern fit and classic collar, perfect for everyday wear and casual outings.",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/9e959e0e-bbf9-456c-92fa-a0dbc7c2c4e1.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt2",
    name: "Milano Italia Polo",
    price: "$69.99",
    description:
      "A premium polo shirt inspired by Italian style, made from soft, breathable fabric\nFeatures a clean, elegant design with a modern fit, perfect for casual and smart occasions.",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/9239db13-a48f-4f16-b3bc-efdd5d96fdf6.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt3",
    name: "Tactical Mesh Tee",
    price: "$124.99",
    description:
      "A lightweight and breathable t-shirt made with mesh fabric for maximum comfort\nDesigned for durability and a sporty look, perfect for workouts and active wear.",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fmket/ae66ecbda1f6336f7e80e83178d8a203.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt4",
    name: "Classic Plaid Polo",
    description:
      "A timeless polo shirt featuring a stylish plaid pattern\nMade from soft, breathable fabric with a comfortable fit, perfect for everyday wear.",
    price: "$79.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/open/8abfd7036b834da198bbcda2ff4af24b-goods.jpeg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt5",
    name: "Abstract Cyber Tee",
    description:
      "A modern t-shirt featuring a bold, futuristic design\nMade from soft, breathable fabric with a comfortable fit, perfect for casual streetwear looks.",
    price: "$44.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/5fb04d24-b8b9-4031-806e-2ea1c8b8ed09.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt6",
    name: "Midnight Stripe Polo",
    description:
      "A sleek polo shirt with subtle stripe details, made from soft, breathable fabric\nDesigned for a modern fit, perfect for both casual and smart looks.",
    price: "$49.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fmket/6fca52050e4b1459d3b1765cbe22ad20.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt7",
    name: "Aviator Graphic Tee ",
    description:
      "A casual t-shirt featuring a bold aviator-inspired graphic\nMade from soft, breathable fabric with a comfortable fit, perfect for everyday wear.",
    price: "$34.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/open/e7c269211c97430293808d11886e7f01-goods.jpeg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt8",
    name: "Silver Waffle Tee",
    description:
      "A comfortable t-shirt crafted from textured waffle fabric\nSoft, breathable, and designed with a modern fit, perfect for casual everyday style",
    price: "$59.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/fe7b8163-6230-436b-9615-1e943b1d380c.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt9",
    name: "Floral Summer Shirt",
    description:
      "A lightweight shirt with a vibrant floral print\nMade from breathable fabric for a relaxed, comfortable fit, perfect for warm-weather days.",
    price: "$54.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/f8dc8536-c69a-42aa-ba99-b530022f1741.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt10",
    name: "White Feather Longsleeve",
    description:
      "A lightweight long-sleeve shirt with a clean, minimal design\nMade from soft, breathable fabric for all-day comfort and effortless style.",
    price: "$64.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/9f348cc3-5cc6-43a9-b27c-c89bf50e33e6.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shirt11",
    name: "Sand Stripe Polo",
    description:
      "A casual polo with soft stripe details in a warm sand tone\nMade from breathable fabric with a comfortable fit, perfect for everyday wear.",
    price: "$119.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/66702742-0767-46c3-af68-6a26a6959222.jpg?imageView2/2/w/800/q/70/format/avif",
  },

  {
    id: "shirt12",
    name: "Gingham Check Polo",
    description:
      "A classic polo featuring a timeless gingham check pattern\nMade from soft, breathable fabric with a comfortable fit, perfect for casual and smart looks.",
    price: "$139.99",
    category: "shirts",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/3ac7035f-7981-4e3d-bebe-ed5c88bcbe6d.jpg?imageView2/2/w/800/q/70/format/avif",
  },

  //!pants

  {
    id: "pants1",
    name: "Sky Blue Relaxed Jeans",
    description:
      "Relaxed-fit jeans in a soft sky blue wash\nMade from durable denim for all-day comfort, perfect for casual everyday wear.",
    price: "$44.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/63f5b1eb-07ad-4db8-945a-007c4b522786.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants2",
    name: "Cream Chino Pants",
    description:
      "Classic chino pants in a clean cream color\nMade from soft, durable fabric with a comfortable fit, perfect for smart-casual and everyday styling.",
    price: "$59.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fmket/e1ffd98297b7ccee8a1789e6b8589b74.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants3",
    name: "Deep Sea Slim Jeans",
    description:
      "Slim-fit jeans in a deep blue wash\nMade from durable, stretch denim for comfort and a modern look, perfect for everyday wear.",
    price: "$89.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/5cbfadb9-067f-465f-9264-e5fc6128e7c2.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants4",
    name: "Charcoal Plaid Trousers",
    description:
      "Smart trousers with a refined charcoal plaid pattern\nMade from comfortable, durable fabric with a tailored fit, perfect for formal and smart-casual outfits.",
    price: "$149.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/algo_check/auto/ed0a936265d14beeed6e6fd6f63778571755672442059.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants5",
    name: "Slate Textured Trousers",
    description:
      "Modern trousers in a slate color with a subtle textured finish\nMade from durable, comfortable fabric with a tailored fit, perfect for smart and casual looks.",
    price: "$49.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/8c913b04-57f8-42f9-9053-44548f5106b7.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants6",
    name: "Pure White Chinos",
    description:
      "Clean and versatile chinos in pure white\nMade from soft, durable fabric with a comfortable fit, perfect for smart-casual and summer outfits.",
    price: "$39.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/7c201b9a-fa94-44ac-9e32-154af51e06c5.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants7",
    name: "Urban Grey Slacks",
    description:
      "Modern grey slacks with a clean, tailored fit\nMade from smooth, comfortable fabric, perfect for office wear and smart-casual styling.",
    price: "$129.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/3a45e5df-cd12-4e40-b843-bd972a0b7dbe.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants8",
    name: "Olive Garden Pants",
    description:
      "Comfortable olive-colored pants with a relaxed yet refined fit\nMade from durable, breathable fabric, perfect for casual and outdoor-inspired looks.",
    price: "$159.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/08b507bb-0710-4672-a388-3c4bb8c34afa.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants9",
    name: "Light Blue Cargo Jeans",
    description:
      "Light blue denim cargo jeans with a functional design and multiple pockets\nMade from durable, comfortable fabric with a relaxed fit, perfect for casual everyday wear.",
    price: "$84.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/0e02e2aa-2361-4306-8159-0316afe08e4d.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants10",
    name: "Earth Brown Denim",
    description:
      "Brown denim jeans with a rugged, earthy tone\nMade from durable fabric with a comfortable fit, perfect for casual and versatile everyday styling.",
    price: "$49.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/155b4568-8dc7-47ad-8c9a-f346df6692ae.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "pants11",
    name: "Camel Formal Pants",
    description:
      "Elegant camel-colored formal pants with a tailored fit\nMade from smooth, high-quality fabric, perfect for office wear and smart occasions.",
    price: "$114.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/66c90a58-6ca2-486b-8030-c2528a2b8b3e.jpg?imageView2/2/w/800/q/70/format/avif",
  },

  {
    id: "pants12",
    name: "Night Grid Trousers",
    description:
      "Dark-toned trousers with a subtle grid pattern\nMade from comfortable, durable fabric with a tailored fit, perfect for smart and evening looks.",
    price: "$129.99",
    category: "pants",
    size: ["XS", "S", "M", "L", "XL"],
    img: "https://img.kwcdn.com/product/fancy/5a565d5f-85c3-4e84-ac59-8607d0a7a41a.jpg?imageView2/2/w/800/q/70/format/avif",
  },

  // !SHOES
  {
    id: "shoes1",
    name: "Alpine White Runners",
    description:
      "Lightweight white sneakers designed for comfort and everyday movement\nBuilt with breathable materials and a cushioned sole, perfect for casual and sporty looks.",
    price: "$89.99",
    category: "shoes",
    size: ["45", "46", "47", "48", "49"],
    img: "https://img.kwcdn.com/product/fancy/462ddae6-9b26-46f7-a5ed-c62c99a51e55.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shoes2",
    name: "Ivory Leather Sneakers",
    description:
      "Stylish ivory sneakers made from premium leather\nDesigned for comfort and durability with a clean, modern look, perfect for everyday wear.",
    price: "$44.99",
    category: "shoes",
    size: ["45", "46", "47", "48", "49"],
    img: "https://img.kwcdn.com/product/open/654b353292a14327946579b9ee798825-goods.jpeg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shoes3",
    name: "Urban Creams Walkers",
    description:
      "Comfortable cream-toned walking shoes with a modern urban design\nMade from durable materials with a cushioned sole, perfect for all-day casual wear.",
    price: "$129.99",
    category: "shoes",
    size: ["45", "46", "47", "48", "49"],
    img: "https://img.kwcdn.com/product/fancy/ed3d5e5e-1999-4ec7-a0ba-2ab669b46019.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shoes4",
    name: "Speed Stripe Sport",
    description:
      "Sporty sneakers with dynamic stripe detailing and a lightweight build\nDesigned for comfort, flexibility, and everyday active wear.",
    price: "$159.99",
    category: "shoes",
    size: ["45", "46", "47", "48", "49"],
    img: "https://img.kwcdn.com/product/open/4509be99f5e84df687ca08d347577717-goods.jpeg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shoes5",
    name: "Arctic Edge Runner",
    description:
      "Lightweight running sneakers with a cool, modern design\nBuilt for comfort and support with a cushioned sole, perfect for daily runs and casual wear.",
    price: "$49.99",
    category: "shoes",
    size: ["45", "46", "47", "48", "49"],
    img: "https://img.kwcdn.com/product/open/c01c2f9bf1de466280ff6d0075d6a5ac-goods.jpeg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shoes6",
    name: "Retro Stripe Sneaker",
    description:
      "Classic sneakers with a vintage-inspired stripe design\nMade for comfort and everyday wear with a durable build and timeless sporty look.",
    price: "$79.99",
    category: "shoes",
    size: ["45", "46", "47", "48", "49"],
    img: "https://img.kwcdn.com/product/open/8a5beea3796d40dcae50a982d2dd4a64-goods.jpeg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shoes7",
    name: "Nova Pure Walk",
    description:
      "Minimal white walking sneakers designed for all-day comfort\nLightweight, breathable, and perfect for clean everyday style.",
    price: "$119.99",
    category: "shoes",
    size: ["45", "46", "47", "48", "49"],
    img: "https://img.kwcdn.com/product/algo_check/auto/540d5b396cec534b90a36f23224acffe_1722943177565.jpg?imageView2/2/w/800/q/70/format/avif",
  },
  {
    id: "shoes8",
    name: "Sage Street Glide",
    description:
      "Casual sneakers in a modern sage tone with a sleek streetwear design\nBuilt for comfort and daily wear with a lightweight, cushioned sole.",
    price: "$149.99",
    category: "shoes",
    size: ["45", "46", "47", "48", "49"],
    img: "https://img.kwcdn.com/product/fancy/4a64229c-8400-43f8-9030-b811818a8135.jpg?imageView2/2/w/800/q/70/format/avif",
  },
];
// interaction
const xname = document.getElementById("name");
const xprice = document.getElementById("price");
const xdescription = document.getElementById("descripton");
const xproductImage = document.getElementById("productImage");
//السطرين دول عشان بيجيب الايدي من الللينك اللي هيدوس عليه
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// دا بيبحث عن الايدي لو لقي الايدي في الاراي بيرجع الاوبجكت فيه المعلومات بتاعت العنصر
const product = products.find((p) => p.id === id);
// نعرض البيانات
xname.textContent = product.name;
xprice.textContent = product.price;
xdescription.textContent = product.description;
xproductImage.src = product.img;
//!------------------Putting Size----------------------------------
const sizesContainer = document.getElementById("sizes");

product.size.forEach((size) => {
  sizesContainer.innerHTML += `<p class="sizeClick" ">${size}</p>`;
});

//!Quantity Counter
let x = null;
let s = null;
const xnumberOfProduct = document.getElementById("numberOfProduct");
let min = 1;
let max = 4;
let NumberOfProductCounter = 0;
function increase() {
  if (NumberOfProductCounter < max) {
    NumberOfProductCounter++;

    s = (Number(product.price.slice(1)) * NumberOfProductCounter).toFixed(2);
    xprice.textContent = "$" + s;
    x = Number(product.price.slice(1)) * NumberOfProductCounter.toFixed(2);
    xnumberOfProduct.value = NumberOfProductCounter;
  }
}
function decrease() {
  if (NumberOfProductCounter > min) {
    x = x - Number(product.price.slice(1));
    NumberOfProductCounter--;
    xprice.textContent = "$" + x.toFixed(2);
    xnumberOfProduct.value = NumberOfProductCounter;
  }
}
//!-----------------!!!!!!!!!!!----------------------
let sizeOnClick;
let sizes = document.querySelectorAll(".sizeClick");
sizes.forEach((item) => {
  item.addEventListener("click", (event) => {
    item.classList.toggle("rd");
  });
});

// ! DON'T TOUCH THIS
// const xsizeLCick = document.getElementById("sizes")
// xsizeLCick.addEventListener("click", (event) => {
//   event.classList.toggle("rd");
// });
