// Масив продуктів
let products = [
    { name: "Помідори", quantity: 2, bought: true },
    { name: "Печиво", quantity: 2, bought: false },
    { name: "Сир", quantity: 1, bought: false }
];

// DOM 
const shoppingListContainer = document.querySelector('.shopping-list');
const remainingContainer = document.querySelector('.remaining');
const boughtContainer = document.querySelector('.bought-items');
const addItemInput = document.querySelector('.add-item input');
const addItemButton = document.querySelector('.add-item button');

// Функція для рендеру всього масиву продуктів для відображення поточних змін
const renderProductList = () => {
    shoppingListContainer.innerHTML = ''; // Очистити наявний вміст
    products.forEach(product => renderProduct(product)); // Ітерація кожного продукту в масиві та рендеринг
};

// Функція для перевірки однаковості імен (кей ісенсітів)
const productExists = (name) => {
    return products.some(product => product.name.toLowerCase() === name.toLowerCase());
};

// Апдейт статистики
const updateStatistics = () => {
    // Очищення наявного вмісту в обох контейнерах
    remainingContainer.innerHTML = '';
    boughtContainer.innerHTML = '';

    // Ітерація по масиву продуктів
    products.forEach(product => {
        // Створює новий div для кожного продукту
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `${product.name} <span class="quantity-badge">${product.quantity}</span>`;
        
        // Додає продукт до правильного контейнера на основі його статусу покупки
        if (product.bought) {
            // Якщо куплено, додає до контейнера куплено
            item.querySelector('.name')?.classList.add('nbought');
            boughtContainer.appendChild(item);
        } else {
            remainingContainer.appendChild(item);
        }
    });
};


const renderProduct = (product) => {
    const productRow = document.createElement('div');
    productRow.classList.add('item-row');

    const itemNameDiv = document.createElement('div');
    itemNameDiv.classList.add('item-name');
    if (product.bought) {
        itemNameDiv.innerHTML = `<span class="name nbought">${product.name}</span>`;
    } else {
        itemNameDiv.innerHTML = `<span class="name">${product.name}</span>`;
        itemNameDiv.querySelector('.name').contentEditable = true; // Якщо продукт не куплений то можна змінити назву
    }

  
    const quantityDiv = document.createElement('div');
    quantityDiv.classList.add('quantity');

    // кнопка -
    const decreaseButton = document.createElement('button');
    decreaseButton.classList.add('btn-decrease');
    decreaseButton.textContent = '−';
    if (product.quantity === 1) {
        decreaseButton.disabled = true; // Disable якщо кількість продукту 1
    }

    // span з кількістю
    const quantitySpan = document.createElement('span');
    quantitySpan.classList.add('number');
    quantitySpan.textContent = product.quantity;

    // кнопка +
    const increaseButton = document.createElement('button');
    increaseButton.classList.add('btn-increase');
    increaseButton.textContent = '+';

 
    // Додає кнопки та діапазон кількості до quantity div
    quantityDiv.appendChild(decreaseButton);
    quantityDiv.appendChild(quantitySpan);
    quantityDiv.appendChild(increaseButton);

    const actionButtonsDiv = document.createElement('div');
    actionButtonsDiv.classList.add('action-buttons');

    // кнопка куплено/не куплено
    const toggleBoughtButton = document.createElement('button');
    toggleBoughtButton.classList.add(product.bought ? 'not-bought' : 'bought');
    toggleBoughtButton.textContent = product.bought ? 'Не куплено' : 'Куплено';

    // якщо продукт не куплений, додати кнопку ×
    if (!product.bought) {
        const removeButton = document.createElement('button');
        removeButton.classList.add('remove');
        removeButton.textContent = '×';
        actionButtonsDiv.appendChild(removeButton);

        // event listener 
        removeButton.addEventListener('click', () => {
            products = products.filter(p => p !== product);
            renderProductList();
            updateStatistics();
        });
    }

    actionButtonsDiv.appendChild(toggleBoughtButton);

    productRow.appendChild(itemNameDiv);
    productRow.appendChild(quantityDiv);
    productRow.appendChild(actionButtonsDiv);

    shoppingListContainer.appendChild(productRow);

    // ---------------- EventListeners для рядку з продуктом ----------------
    // кнопка +
    increaseButton.addEventListener('click', () => {
        product.quantity++;
        quantitySpan.textContent = product.quantity;
        if (product.quantity > 1) {
            decreaseButton.disabled = false; // Enable кнопку - якщо кількість продукту більше за 1
        }
        updateStatistics();
    });

    // кнопка -
    decreaseButton.addEventListener('click', () => {
        if (product.quantity > 1) {
            product.quantity--;
            quantitySpan.textContent = product.quantity;
            if (product.quantity === 1) {
                decreaseButton.disabled = true; // Disable кнопку - якщо кількість продукту 1
            }
        }
        updateStatistics();
    });

    // Toggle куплено/не куплено
    toggleBoughtButton.addEventListener('click', () => {
        product.bought = !product.bought;
        itemNameDiv.querySelector('.name').classList.toggle('nbought');
        // Hide + and - buttons if the product is bought
        decreaseButton.style.visibility = product.bought ? 'hidden' : 'visible';
        increaseButton.style.visibility = product.bought ? 'hidden' : 'visible';
        if (product.bought) {
            actionButtonsDiv.querySelector('.remove').remove();
            toggleBoughtButton.textContent = 'Не куплено';
            toggleBoughtButton.classList.replace('bought', 'not-bought');
        } else {
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove');
            removeButton.textContent = '×';
            actionButtonsDiv.insertBefore(removeButton, toggleBoughtButton);
            toggleBoughtButton.textContent = 'Куплено';
            toggleBoughtButton.classList.replace('not-bought', 'bought');
            
            removeButton.addEventListener('click', () => {
                products = products.filter(p => p !== product);
                renderProductList();
                updateStatistics();
            });
        }
        updateStatistics();
    });

    // Змінне ім'я продукта
    itemNameDiv.querySelector('.name').addEventListener('blur', (e) => {
        const newName = e.target.textContent.trim();
        if (newName === "") {
            e.target.textContent = product.name; // Якщо нове ім'я порожнє - повернути до попереднього
        } else if (!productExists(newName)) {
            product.name = newName;
        } else {
            alert('Продукт з таким іменем вже існує.');
            e.target.textContent = product.name; // Якщо нове ім'я не унікальне - повернути до попреднього
        }
        updateStatistics();
    });

    updateStatistics();
};

// Функція для додавання нового товару
const addProduct = (name) => {
    const newProduct = { name: name, quantity: 1, bought: false };
    products.push(newProduct); // Додати новий товар до масиву продуктів
    renderProductList(); 
};


addItemButton.addEventListener('click', () => {
    const name = addItemInput.value.trim();
    if (name) {
        if (!productExists(name)) {
            addProduct(name);
        } else {
            alert("Продукт з таким ім`ям вже існує в списку.");
        }
        addItemInput.value = '';
        addItemInput.focus();
    }
});

addItemInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addItemButton.click();
    }
});

renderProductList();
