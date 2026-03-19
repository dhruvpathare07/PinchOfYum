const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../data/recipes.json")
.then(res => res.json())
.then(data => {

    const recipe = data.find(r => r.id === id);
    const container = document.getElementById("recipeContainer");

    container.innerHTML = `
        <div class="recipe-header">
            <h1 class="recipe-title">${recipe.name}</h1>
            <img src="${recipe.image}" class="recipe-image">
        </div>

        <div class="recipe-stats">
            <div class="stat-card"><span>${recipe.calories}</span>Calories</div>
            <div class="stat-card"><span>${recipe.protein}</span>Protein</div>
            <div class="stat-card"><span>${recipe.time}</span>Time</div>
            <div class="stat-card"><span>Easy</span>Level</div>
        </div>

        <div class="section-grid">
            <div class="recipe-card">
                <h2>Ingredients</h2>
                <ul>
                    ${recipe.ingredients.map(i => `<li>• ${i}</li>`).join("")}
                </ul>
            </div>

            <div class="recipe-card">
                <h2>How To Make</h2>
                <ol class="steps">
                    ${recipe.steps.map(s => `<li>${s}</li>`).join("")}
                </ol>
            </div>
        </div>

        <button class="save-btn" onclick="addFavorite('${recipe.id}')">
            Save Recipe
        </button>

        <!-- ✅ NEW REVIEW SYSTEM (CORRECT ONE) -->
        <div class="review-section">

            <h2>⭐ Reviews & Ratings</h2>

            <div id="ratingSummary"></div>

            <div class="review-form">
                <div id="starInput" class="stars"></div>
                <textarea id="reviewText" placeholder="Write your review..."></textarea>
                <button onclick="submitReview()">Submit Review</button>
            </div>

            <div id="reviewList"></div>

        </div>
    `;

    // ✅ IMPORTANT: initialize AFTER DOM created
    initReviews();

});

// FAVORITE
function addFavorite(recipeId) {
    const username = localStorage.getItem("currentUser");

    if (!username) {
        alert("Please login first");
        return;
    }

    fetch("http://127.0.0.1:5000/favorite", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, recipe_id: recipeId })
    })
    .then(res => res.json())
    .then(() => alert("Recipe saved!"))
    .catch(() => alert("Error saving recipe"));
}