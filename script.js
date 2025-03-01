document.addEventListener('DOMContentLoaded', function () {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartIcon = document.querySelector('.fa-shopping-cart');
  const cartSidebar = document.getElementById('cart-sidebar');
  const closeCartBtn = document.getElementById('close-cart');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const clearCartBtn = document.getElementById('clear-cart');

  updateCartUI();

  // Show Cart Sidebar
  cartIcon.addEventListener('click', function (event) {
      event.preventDefault();
      cartSidebar.classList.add('show-cart');
  });

  // Close Cart Sidebar
  closeCartBtn.addEventListener('click', function () {
      cartSidebar.classList.remove('show-cart');
  });

  // Add items to the cart
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
      button.addEventListener('click', function () {
          const productCard = this.closest('.product-card');
          const productName = productCard.querySelector('h3').textContent;
          const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace(/[^\d.]/g, ''));

          const productImage = productCard.querySelector('img').src;

          const existingProduct = cart.find(item => item.name === productName);

          if (existingProduct) {
              existingProduct.quantity += 1;
          } else {
              cart.push({ name: productName, price: productPrice, image: productImage, quantity: 1 });
          }

          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartUI();
      });
  });

  // Clear Cart
  clearCartBtn.addEventListener('click', function () {
      localStorage.removeItem('cart');
      cart.length = 0;
      updateCartUI();
  });

  // Update the Cart UI
  function updateCartUI() {
      cartItemsContainer.innerHTML = '';
      let total = 0;

      cart.forEach(product => {
        total += product.price * product.quantity;
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${product.image}" width="50">
            <span>${product.name} (x${product.quantity})</span>
            <span>₹${(product.price * product.quantity).toFixed(2)}</span>
            <button class="remove-item" data-name="${product.name}">&times;</button>
        `;
        cartItemsContainer.appendChild(li);
        
      });

      cartTotal.textContent = `Total: ₹${total.toFixed(2)}`;
     
      document.querySelectorAll('.remove-item').forEach(button => {
          button.addEventListener('click', function () {
              const itemName = this.getAttribute('data-name');
              const index = cart.findIndex(item => item.name === itemName);
              if (cart[index].quantity > 1) {
                  cart[index].quantity -= 1;
              } else {
                  cart.splice(index, 1);
              }
              localStorage.setItem('cart', JSON.stringify(cart));
              updateCartUI();
          });
      });
  }
});
