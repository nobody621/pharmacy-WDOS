document.addEventListener('DOMContentLoaded', function() {
    const pharmacyCategoriesSection = document.querySelector('.pharmacy-categories');

    // Fetch medicine catalog
    fetch('json/medicines.json')
        .then(response => response.json())
        .then(data => {
            // Clear existing categories
            pharmacyCategoriesSection.innerHTML = '';

            // Dynamically create categories and medicines
            data.categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category';

                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = category.name;
                categoryDiv.appendChild(categoryTitle);

                const medicineGrid = document.createElement('div');
                medicineGrid.className = 'medicine-grid';

                category.medicines.forEach(medicine => {
                    const medicineItem = document.createElement('div');
                    medicineItem.className = 'medicine-item';
                    medicineItem.innerHTML = `
                        <img src="${medicine.image}" alt="${medicine.name}">
                        <h4>${medicine.name}</h4>
                        <div class="quantity-control">
                            <label for="${medicine.name.toLowerCase().replace(/\s+/g, '-')}">Quantity:</label>
                            <input type="number" id="${medicine.name.toLowerCase().replace(/\s+/g, '-')}" 
                                   name="${medicine.name.toLowerCase().replace(/\s+/g, '-')}" 
                                   min="0" value="0">
                        </div>
                        <button class="add-to-cart" data-price="${medicine.price}">Add to Cart</button>
                    `;
                    medicineGrid.appendChild(medicineItem);
                });

                categoryDiv.appendChild(medicineGrid);
                pharmacyCategoriesSection.appendChild(categoryDiv);
            });

            // Reinitialize add to cart functionality
            initAddToCartButtons();
        })
        .catch(error => {
            console.error('Error loading medicine catalog:', error);
            pharmacyCategoriesSection.innerHTML = '<p>Error loading medicine catalog. Please try again later.</p>';
        });

    function initAddToCartButtons() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const item = this.closest('.medicine-item');
                const quantityInput = item.querySelector('input[type="number"]');
                const quantity = parseInt(quantityInput.value);
                
                if (quantity <= 0) {
                    alert('Please select a quantity greater than 0');
                    return;
                }

                const product = {
                    name: item.querySelector('h4').textContent,
                    price: parseFloat(this.getAttribute('data-price')),
                    image: item.querySelector('img').src,
                    quantity: quantity
                };

                addToCart(product);
                alert('Item added to cart!');
            });
        });
    }
});

// The rest of your existing cart.js code remains the same
// (Include the entire cart.js code here, which you already have)
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const item = this.closest('.product-card, .medicine-item');
            let product;

            if (item.classList.contains('product-card')) {
                product = {
                    name: item.querySelector('h3').textContent,
                    price: parseFloat(item.querySelector('.price').textContent.replace('$', '')),
                    image: item.querySelector('img').src,
                    quantity: 1
                };
            } else if (item.classList.contains('medicine-item')) {
                const quantityInput = item.querySelector('input[type="number"]');
                const quantity = parseInt(quantityInput.value);
                if (quantity <= 0) {
                    alert('Please select a quantity greater than 0');
                    return;
                }
                product = {
                    name: item.querySelector('h4').textContent,
                    price: 10.00, // You need to add prices to your medicine items
                    image: item.querySelector('img').src,
                    quantity: quantity
                };
            }

            addToCart(product);
            alert('Item added to cart!');
        });
    });
});

let cart = [];
let cartCount = 0;
const cartCountElement = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeBtn = document.querySelector('.close');
const cartIcon = document.getElementById('cart-icon');
const checkoutBtn = document.getElementById('checkout-btn');

function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    cartCount += product.quantity;
    cartCountElement.textContent = cartCount;
    updateCartDisplay();
}

cartIcon.addEventListener('click', () => {
    cartModal.style.display = 'block';
    updateCartDisplay();
});

closeBtn.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == cartModal) {
        cartModal.style.display = 'none';
    }
});

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let total = 0;

    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name}</span>
            <span>Qty: ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeItem(${index})" class="btn">Remove</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
}

function removeItem(index) {
    cartCount -= cart[index].quantity;
    cart.splice(index, 1);
    cartCountElement.textContent = cartCount;
    updateCartDisplay();
}

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
});
