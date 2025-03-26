class Product {
    constructor(name, price, description = '', image = '') {
        this.name = name;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    // Getters and Setters
    get name() {
        return this._name;
    }

    set name(value) {
        if (!value || value.trim() === "") {
            throw new Error("Product name cannot be empty");
        }
        this._name = value.trim();
    }

    get price() {
        return this._price;
    }

    set price(value) {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0) {
            throw new Error("Price must be a non-negative number");
        }
        this._price = numValue;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value || '';
    }

    get image() {
        return this._image;
    }

    set image(value) {
        this._image = value || '';
    }

    static createFromJson(jsonValue) {
        const data = JSON.parse(jsonValue);
        return new Product(data.name, data.price, data.description, data.image);
    }

    static createFromObject(obj) {
        return new Product(obj.name, obj.price, obj.description, obj.image);
    }
}

export default Product;