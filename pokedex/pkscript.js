import Pokemon from './pokemon.js';

const API_URL = "https://pokeapi.co/api/v2/pokemon";
const pokedex = document.getElementById("pokedex");
const pagination = document.getElementById("pagination");

const POKEMONS_PER_PAGE = 9;
let currentPage = 1; // just call 9 pokemos at the time, per page

async function showPage(page) {
  pokedex.innerHTML = "";
  const offset = (page - 1) * POKEMONS_PER_PAGE;

  const res = await fetch(`${API_URL}?limit=${POKEMONS_PER_PAGE}&offset=${offset}`);
  const data = await res.json();

  // Display Pokémon cards
  for (const pokemon of data.results) {
    const res = await fetch(pokemon.url);
    const pokeData = await res.json();
    const poke = new Pokemon(pokeData);
    pokedex.appendChild(poke.renderCard());
  }

  // Create the pagination controls
  createPagination(Math.ceil(data.count / POKEMONS_PER_PAGE), page);
}

function createPagination(totalPages, currentPage) {
  pagination.innerHTML = "";

  const renderButton = (text, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.className = "btn m-1 " + (disabled ? "btn-secondary disabled" : "btn-outline-primary");
    btn.disabled = disabled;

    if (!disabled) btn.onclick = onClick;
    pagination.appendChild(btn);
  };

  // Previous button
  renderButton("«", currentPage === 1, () => showPage(currentPage - 1));

  // Only show 10 pages at the time
  const maxPagesToShow = 10;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    renderButton(i, i === currentPage, () => showPage(i));
  }

  // Next button
  renderButton("»", currentPage === totalPages, () => showPage(currentPage + 1));
}

// Initial page load
showPage(currentPage);
