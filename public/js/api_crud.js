import Product from './Product.js';

class ProductAPI {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async getAll() {
        try {
            const response = await fetch(this.baseURL);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    async create(data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating product:', error);
        }
    }

    async update(id, data) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseURL}/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    async delete(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${this.baseURL}/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}


const productAPI = new ProductAPI('http://localhost:3000/api/products');

export { productAPI };