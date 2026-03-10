const params = new URLSearchParams(window.location.search)

const id = params.get("id")

fetch("../data/recipes.json")

    .then(res => res.json())

    .then(data => {

        const recipe = data.find(r => r.id === id)

        const container = document.getElementById("recipeContainer")

        container.innerHTML = `

<h1>${recipe.name}</h1>

<img src="${recipe.image}" width="400">

<p>Calories: ${recipe.calories}</p>

<p>Protein: ${recipe.protein}</p>

<p>Time: ${recipe.time}</p>

<h2>Ingredients</h2>

<ul>

${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}

</ul>

<h2>Steps</h2>

<ol>

${recipe.steps.map(s => `<li>${s}</li>`).join("")}

</ol>

<button onclick="addFavorite('${recipe.id}')">
Save Recipe
</button>

`

    })
async function addFavorite(recipeId){

const username = localStorage.getItem("currentUser");

if(!username){

alert("Please login first");

window.location.href="login.html";

return;

}

await fetch("http://127.0.0.1:5000/favorite",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username:username,
recipe_id:recipeId
})

});

alert("Recipe saved!");

}
function toggleLike() {

    let likes = localStorage.getItem("likes") || 0

    likes++

    localStorage.setItem("likes", likes)

    alert("You liked this recipe!")

}
