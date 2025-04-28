import { productAPI } from './api_crud.js';

const predefinedProducts = [
    { 
        name: 'Hashmap', 
        price: 1500, 
        description: 'A hashmap stores key-value pairs for fast lookup, like a dictionary that quickly finds a word’s meaning using a unique key.',
        image: 'https://miro.medium.com/v2/resize:fit:4800/format:webp/1*jPM0jwnyL_przj93M_u0bQ.png' 
    },
    { 
        name: 'Binary Tree', 
        price: 1800, 
        description: 'A hierarchical structure where each node has up to two children, making data organization and searching highly efficient.',
        image: 'https://www.oreilly.com/api/v2/epubs/9781449373931/files/assets/dsaj_0501.png' 
    },
    { 
        name: 'Graph', 
        price: 2000, 
        description: 'A collection of nodes connected by edges, used to represent networks and relationships.',
        image: 'https://static.takeuforward.org/content/Screenshot%202024-01-06%20at%2010.19.01%20PM-beC6QNhi' 
    },
    { 
        name: 'Stack', 
        price: 1200, 
        description: 'A Last In, First Out (LIFO) structure where elements are added and removed from the top, like a stack of plates.',
        image: 'https://quescol.com/wp-content/uploads/2021/04/stack-implementation-using-linked-list.png' 
    },
];

async function loadPredefinedProducts() {
    try {
        const existingProducts = await productAPI.getAll();
        
        // Only load predefined products if no products exist
        if (existingProducts.length === 0) {
            for (const product of predefinedProducts) {
                await productAPI.create(product);
            }
        }
    } catch (error) {
        console.error('Error loading predefined products:', error);
    }
}

async function loadProducts() {
    const productTableBody = document.getElementById('product-table-body');
    if (!productTableBody) return;

    productTableBody.innerHTML = '';
    const products = await productAPI.getAll();

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: auto;"></td>
            <td>${product.description}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editProduct('${product._id}', '${product.name}', ${product.price}, '${product.description}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

function openProductModal() {
    window.editingProductId = null;
    document.getElementById('productModalLabel').innerText = 'Add Product';
    document.getElementById('product-form').reset();
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function editProduct(id, name, price, description) {
    window.editingProductId = id;
    document.getElementById('productModalLabel').innerText = 'Edit Product';
    document.getElementById('product-name').value = name;
    document.getElementById('product-price').value = price;
    document.getElementById('product-description').value = description;
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        await productAPI.delete(id);
        await loadProducts();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadPredefinedProducts();
    await loadProducts();

    // Add event listener for the Add Product button
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            openProductModal();
        });
    }

    const saveProductBtn = document.getElementById('save-product-btn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', async () => {
            const name = document.getElementById('product-name').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const description = document.getElementById('product-description').value;

            if (!name || isNaN(price) || !description) {
                alert('Please enter a valid name, price, and description');
                return;
            }

            // Get the image URL
            const image = document.getElementById('product-image')?.value || 'https://via.placeholder.com/150';
            
            // Add stock and category fields (required by backend model)
            const stock = 10; // Default value
            const category = 'Other'; // Default value
            
            try {
                if (window.editingProductId) {
                    await productAPI.update(window.editingProductId, { 
                        name, 
                        price, 
                        description, 
                        image,
                        stock,
                        category
                    });
                } else {
                    await productAPI.create({ 
                        name, 
                        price, 
                        description, 
                        image,
                        stock,
                        category
                    });
                }

                const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
                if (modal) modal.hide();
                window.editingProductId = null;
                await loadProducts();
            } catch (error) {
                console.error('Error saving product:', error);
                alert('An error occurred while saving the product');
            }
        });
    }
});