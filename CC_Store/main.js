// 購物車資料管理
function getCart() {
    const cart = localStorage.getItem('cc_store_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cc_store_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.textContent = totalQty;
    });
}

// 加入購物車 (首頁用)
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    saveCart(cart);
    alert('已將 ' + product.name + ' 加入購物車！');
}

// 綁定首頁的加入購物車按鈕
function initStore() {
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            const product = {
                id: card.dataset.id,
                name: card.querySelector('h3').textContent,
                price: parseInt(card.dataset.price),
                image: card.querySelector('img').src
            };
            addToCart(product);
        });
    });
}

// 渲染購物車頁面
function renderCart() {
    const container = document.getElementById('cart-items-container');
    const summaryContainer = document.getElementById('cart-summary');
    if (!container) return; // 不在購物車頁面

    const cart = getCart();
    container.innerHTML = ''; // 清空預設內容

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem; color: #888;">您的購物車目前是空的喔！快去選購些甜點吧🍰</p>';
        summaryContainer.style.display = 'none';
        return;
    }

    summaryContainer.style.display = 'block';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <button class="remove-btn" title="移除商品">&times;</button>
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">單價: NT$ ${item.price}</p>
                    <div class="cart-quantity">
                        <button class="qty-btn minus">-</button>
                        <input type="text" class="qty-input" value="${item.qty}" readonly>
                        <button class="qty-btn plus">+</button>
                    </div>
                </div>
                <div class="cart-item-total">NT$ ${itemTotal}</div>
            </div>
        `;
        container.innerHTML += cartItemHTML;
    });

    // 計算運費與總計
    const shipping = subtotal > 0 ? 100 : 0;
    const total = subtotal + shipping;

    document.getElementById('subtotal-price').textContent = 'NT$ ' + subtotal;
    document.getElementById('shipping-price').textContent = 'NT$ ' + shipping;
    document.getElementById('total-price').textContent = 'NT$ ' + total;

    bindCartEvents();
}

// 綁定購物車內的增減與移除事件
function bindCartEvents() {
    const container = document.getElementById('cart-items-container');
    
    container.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.cart-item').dataset.id;
            updateQuantity(id, -1);
        });
    });

    container.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.cart-item').dataset.id;
            updateQuantity(id, 1);
        });
    });

    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.closest('.cart-item').dataset.id;
            removeFromCart(id);
        });
    });
}

function updateQuantity(id, change) {
    let cart = getCart();
    const item = cart.find(item => item.id === id);
    if (item) {
        item.qty += change;
        if (item.qty <= 0) {
            cart = cart.filter(product => product.id !== id);
        }
        saveCart(cart);
        renderCart();
    }
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    initStore();
    renderCart();

    // 結帳按鈕綁定 (如果有這個按鈕)
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if(getCart().length > 0){
                alert('即將帶您前往結帳金流頁面！感謝您的購買！');
                localStorage.removeItem('cc_store_cart'); // 清空購物車
                window.location.href = 'CC_Store.html'; // 結帳後回首頁
            }
        });
    }
});
