document.addEventListener('DOMContentLoaded', async () => {
    // Load initial data from JSON file
    const response = await fetch('json/initial_cart.json');
    const initialData = await response.json();

    // Load cart items from localStorage or initial data
    let cart = JSON.parse(localStorage.getItem('cart')) || initialData.cart;
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const saveFavoriteBtn = document.getElementById('save-favorite');
    const applyFavoriteBtn = document.getElementById('apply-favorite');
    const checkoutForm = document.getElementById('checkout-form');
    let total = 0;

    // Display cart items
    function displayCartItems() {
        checkoutItems.innerHTML = '';
        total = 0;
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                ${item.name}
                $${item.price.toFixed(2)}
            `;
            checkoutItems.appendChild(itemElement);
            total += item.price;
        });
        checkoutTotal.textContent = total.toFixed(2);
    }

    displayCartItems();

    // Save order as favorite
    saveFavoriteBtn.addEventListener('click', () => {
        const favoriteOrder = {
            items: cart,
            formData: {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                street: document.getElementById('street').value,
                city: document.getElementById('city').value,
                postal: document.getElementById('postal').value
            }
        };
        localStorage.setItem('favoriteOrder', JSON.stringify(favoriteOrder));
        alert('Order saved as favorite!');
    });

    // Apply favorite order
    applyFavoriteBtn.addEventListener('click', () => {
        const favoriteOrder = JSON.parse(localStorage.getItem('favoriteOrder')) || initialData.favoriteOrder;
        if (favoriteOrder) {
            // Update cart items
            localStorage.setItem('cart', JSON.stringify(favoriteOrder.items));
            
            cart = favoriteOrder.items;
            displayCartItems();

            // Fill form fields
            const formData = favoriteOrder.formData;
            document.getElementById('fullName').value = formData.fullName;
            document.getElementById('email').value = formData.email;
            document.getElementById('phone').value = formData.phone;
            document.getElementById('street').value = formData.street;
            document.getElementById('city').value = formData.city;
            document.getElementById('postal').value = formData.postal;

            alert('Favorite order applied!');
        } else {
            alert('No favorite order found!');
        }
    });

    // Handle form submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Calculate delivery date (3 days from now)
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        
        alert(`Order placed successfully!\nExpected delivery date: ${deliveryDate.toLocaleDateString()}`);
        
        // Clear cart and redirect to pharmacy
        localStorage.removeItem('cart');
        window.location.href = 'pharmacy.html';
    });
});

