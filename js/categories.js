let recipes = [];
let currentCategory = "";
let ratingsMap = {};

// ⭐ STAR HTML
function getStarHTML(rating) {
    let html = "";

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) html += `<span class="star filled">★</span>`;
        else if (rating >= i - 0.5) html += `<span class="star half">★</span>`;
        else html += `<span class="star">★</span>`;
    }

    return html;
}

// LOAD DATA
async function loadData() {
    const res = await fetch("../data/recipes.json");
    recipes = await res.json();

    await loadRatings();
}

async function loadRatings() {
    const res = await fetch("http://127.0.0.1:5000/reviews/all");
    const reviews = await res.json();

    ratingsMap = {};

    reviews.forEach(r => {
        if (!ratingsMap[r.recipe_id]) {
            ratingsMap[r.recipe_id] = [];
        }
        ratingsMap[r.recipe_id].push(r.rating);
    });

    for (let id in ratingsMap) {
        const arr = ratingsMap[id];
        ratingsMap[id] = arr.reduce((a, b) => a + b, 0) / arr.length;
    }
}

// CATEGORY CLICK
function filterCategory(category) {
    currentCategory = category;
    document.getElementById("categoryTitle").innerText = category.toUpperCase();
    applyFilters();
}

// DISPLAY
function displayRecipes(list) {

    const grid = document.getElementById("recipeGrid");
    grid.innerHTML = "";

    list.forEach(recipe => {

        const rating = ratingsMap[recipe.id] || 0;

        const card = document.createElement("div");
        card.className = "card";

        card.onclick = () => openRecipe(recipe.id);

        card.innerHTML = `
            <img src="${recipe.image}">
            <div class="card-body">
                <h3>${recipe.name}</h3>
                <p>${recipe.calories} cal • ${recipe.protein}</p>

                <div class="rating-box">
                    ${getStarHTML(rating)}
                    <span>${rating ? rating.toFixed(1) : "N/A"}</span>
                </div>

                <button onclick="event.stopPropagation(); openRecipe('${recipe.id}')">
                    View Recipe
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// FILTER
function applyFilters() {

    const search = document.getElementById("searchInput")?.value.toLowerCase() || "";

    const filtered = recipes.filter(r => 
        r.category === currentCategory &&
        r.name.toLowerCase().includes(search)
    );

    displayRecipes(filtered);
}

function openRecipe(id) {
    window.location.href = "recipe.html?id=" + id;
}

loadData();