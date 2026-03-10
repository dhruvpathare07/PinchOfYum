const username = localStorage.getItem("currentUser");

async function loadFavorites() {

    const res = await fetch(
        "http://127.0.0.1:5000/favorites/" + username
    );

    const favoriteIds = await res.json();

    fetch("../data/recipes.json")
        .then(res => res.json())
        .then(recipes => {

            const grid = document.getElementById("favGrid");

            grid.innerHTML = "";

            const favRecipes = recipes.filter(r =>
                favoriteIds.includes(r.id)
            );

            if (favRecipes.length === 0) {

                document.getElementById("emptyMsg").innerText =
                    "No saved recipes yet.";

                return;

            }

            favRecipes.forEach(recipe => {

                const card = document.createElement("div");

                card.className = "card";

                card.innerHTML = `

<img src="${recipe.image}">

<div class="card-body">

<h3>${recipe.name}</h3>

<button onclick="openRecipe('${recipe.id}')">
View Recipe
</button>

</div>

`;

                grid.appendChild(card);

            });

        });

}

loadFavorites();

function openRecipe(id) {

    window.location.href = "recipe.html?id=" + id;

}