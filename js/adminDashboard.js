async function loadStats() {

    // RECIPES
    const res = await fetch("../data/recipes.json");
    const recipes = await res.json();
    document.getElementById("totalRecipes").innerText = recipes.length;

    // REVIEWS
    const reviewRes = await fetch("http://127.0.0.1:5000/reviews/all");
    const reviews = await reviewRes.json();
    document.getElementById("totalReviews").innerText = reviews.length;

    // USERS + BLOCKED
    const userRes = await fetch("http://127.0.0.1:5000/users");
    const users = await userRes.json();

    document.getElementById("totalUsers").innerText = users.total;
    document.getElementById("blockedUsers").innerText = users.blocked;
}

// NAVIGATION
function goToAddRecipe() {
    window.location.href = "addRecipe.html";
}

loadStats();