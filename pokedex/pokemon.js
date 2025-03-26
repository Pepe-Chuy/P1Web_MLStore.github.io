export default class Pokemon {
    constructor({ id, name, types, sprites }) {
        this.id = id;
        this.name = name;
        this.types = types.map(typeinfo => typeinfo.type.name);
        this.image = sprites.front_default;
    }

    renderCard() {
        const card = document.createElement("div");
        card.classList.add("col");

        card.innerHTML = `
                <div class="card h-100">
                    <img src="${this.image}"
                        class="card-img-top" alt="${this.name}">
                    <div class="card-body">
                        <h5 class="card-title">${this.name}</h5>
                        <p class="card-text">ID: ${this.id}</p>
                        <p class="card-text">Tipos: ${this.types}</p>
                    </div>
                </div>
        `;
        return card;
    }
}
