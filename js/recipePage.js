const params = new URLSearchParams(window.location.search)
const id = params.get("id")

fetch("../data/recipes.json")

    .then(res => res.json())

    .then(data => {

        const recipe = data.find(r => r.id === id)

        const container = document.getElementById("recipeContainer")

        container.innerHTML = `

<div class="recipe-header">

<h1 class="recipe-title">${recipe.name}</h1>

<img src="${recipe.image}" class="recipe-image">

</div>

<div class="recipe-stats">

<div class="stat-card">
<span>${recipe.calories}</span>
Calories
</div>

<div class="stat-card">
<span>${recipe.protein}</span>
Protein
</div>

<div class="stat-card">
<span>${recipe.time}</span>
Time
</div>

<div class="stat-card">
<span>Easy</span>
Level
</div>

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

<div class="review-section">

<h2>Reviews</h2>

<textarea placeholder="Write your review..."></textarea>

<button>Submit Review</button>

<div class="review-list"></div>

</div>

`

    })