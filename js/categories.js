let recipes=[]

fetch("../data/recipes.json")

.then(res=>res.json())

.then(data=>{

recipes=data

})

function filterCategory(category){

const grid=document.getElementById("recipeGrid")

const title=document.getElementById("categoryTitle")

title.innerText=category.toUpperCase()+" Recipes"

grid.innerHTML=""

const filtered=recipes.filter(r=>r.category===category)

filtered.forEach(recipe=>{

const card=document.createElement("div")

card.className="card"

card.innerHTML=`

<img src="${recipe.image}">

<div class="card-body">

<h3>${recipe.name}</h3>

<p>${recipe.calories} calories</p>

<button onclick="openRecipe('${recipe.id}')">

View Recipe

</button>

</div>

`

grid.appendChild(card)

})

}

function openRecipe(id){

window.location.href="recipe.html?id="+id

}