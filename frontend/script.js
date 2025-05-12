const API_URL = '/api/products';
const productList = document.getElementById('product-list');

async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    productList.innerHTML = products.map(product => `
      <div class="product-card" id="product-${product.id}">
        <strong>${product.name}</strong> - $${product.price}
        <button onclick="editProduct(${product.id}, '${product.name}', ${product.price})">Edit</button>
        <button onclick="deleteProduct(${product.id})">Delete</button>
      </div>
    `).join('');
  } catch (error) {
    productList.innerHTML = `<div class="error">Error loading products</div>`;
  }
}

async function addProduct() {
  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });
  loadProducts();
}

// NEW: Edit Product
async function editProduct(id, currentName, currentPrice) {
  const name = prompt('Enter new product name:', currentName);
  const price = parseFloat(prompt('Enter new product price:', currentPrice));

  if (!name || isNaN(price)) {
    alert('Invalid input');
    return;
  }

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price })
  });
  loadProducts();
}

// NEW: Delete Product
async function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    loadProducts();
  }
}

// Initialize
loadProducts();
