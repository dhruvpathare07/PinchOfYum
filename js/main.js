let allRecipes = [];
let ratingsMap = {};

// ⭐ STAR HTML
function getStarHTML(rating) {
    let html = "";

    const rounded = Math.round(rating * 2) / 2; // ✅ FIX: proper half stars

    for (let i = 1; i <= 5; i++) {
        if (rounded >= i) {
            html += `<span class="star filled">★</span>`;
        } else if (rounded >= i - 0.5) {
            html += `<span class="star half">★</span>`;
        } else {
            html += `<span class="star">★</span>`;
        }
    }

    return html;
}

// 🚀 LOAD ALL DATA
async function loadData() {
    try {
        const res = await fetch("../data/recipes.json");
        allRecipes = await res.json();

        await loadRatings();
        applyFilters();

    } catch (err) {
        console.error("Error loading recipes:", err);
    }
}

// ⭐ LOAD RATINGS
async function loadRatings() {
    try {
        const res = await fetch("http://127.0.0.1:5000/reviews/all");
        const reviews = await res.json();

        ratingsMap = {};

        // GROUP RATINGS
        reviews.forEach(r => {
            if (!ratingsMap[r.recipe_id]) {
                ratingsMap[r.recipe_id] = [];
            }
            ratingsMap[r.recipe_id].push(r.rating);
        });

        // CALCULATE AVERAGE
        for (let id in ratingsMap) {
            const arr = ratingsMap[id];
            const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
            ratingsMap[id] = avg;
        }

    } catch (err) {
        console.warn("⚠ Ratings API not working, fallback to no ratings");
        ratingsMap = {}; // ✅ fallback
    }
}

// 🎨 DISPLAY RECIPES
function displayRecipes(recipes) {
    const grid = document.getElementById("recipeGrid");
    grid.innerHTML = "";

    recipes.forEach(recipe => {

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
                    ${rating > 0 
                        ? `${getStarHTML(rating)} <span>${rating.toFixed(1)}</span>`
                        : `<span style="color:#777;">No ratings</span>`
                    }
                </div>

                <button onclick="event.stopPropagation(); openRecipe('${recipe.id}')">
                    View Recipe
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

// 🔍 FILTERS
function applyFilters() {

    const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const calorie = document.getElementById("calorieFilter")?.value || "";
    const protein = document.getElementById("proteinFilter")?.value || "";
    const ratingFilter = document.getElementById("ratingFilter")?.value || "";

    const filtered = allRecipes.filter(r => {

        const cal = parseInt(r.calories) || 0;
        const prot = parseInt(r.protein) || 0;
        const rating = ratingsMap[r.id] || 0;

        const matchSearch =
            r.name.toLowerCase().includes(search) ||
            r.ingredients.join(" ").toLowerCase().includes(search);

        let matchCalories = true;
        if (calorie === "low") matchCalories = cal < 200;
        else if (calorie === "medium") matchCalories = cal >= 200 && cal <= 350;
        else if (calorie === "high") matchCalories = cal > 350;

        let matchProtein = true;
        if (protein === "low") matchProtein = prot < 10;
        else if (protein === "medium") matchProtein = prot >= 10 && prot <= 25;
        else if (protein === "high") matchProtein = prot > 25;

        let matchRating = true;
        if (ratingFilter === "4") matchRating = rating >= 4;
        else if (ratingFilter === "3") matchRating = rating >= 3;
        else if (ratingFilter === "2") matchRating = rating >= 2;

        return matchSearch && matchCalories && matchProtein && matchRating;
    });

    displayRecipes(filtered);
}

// 🎯 EVENTS
document.getElementById("searchInput")?.addEventListener("input", applyFilters);
document.getElementById("calorieFilter")?.addEventListener("change", applyFilters);
document.getElementById("proteinFilter")?.addEventListener("change", applyFilters);
document.getElementById("ratingFilter")?.addEventListener("change", applyFilters);

// 🔗 NAVIGATION
function openRecipe(id) {
    window.location.href = "recipe.html?id=" + id;
}

// 🚀 INIT
loadData();