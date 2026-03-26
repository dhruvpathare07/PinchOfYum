function addRecipe() {

    const recipe = {
        id: document.getElementById("id").value.trim(),
        name: document.getElementById("name").value.trim(),
        category: document.getElementById("category").value.trim(),
        image: document.getElementById("image").value.trim(),
        calories: document.getElementById("calories").value.trim(),
        protein: document.getElementById("protein").value.trim(),
        time: document.getElementById("time").value.trim(),

        ingredients: document.getElementById("ingredients").value
            .split(",")
            .map(i => i.trim())
            .filter(i => i !== ""),

        steps: document.getElementById("steps").value
            .split(",")
            .map(s => s.trim())
            .filter(s => s !== "")
    };

    fetch("http://127.0.0.1:5000/add-recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe)
    })
    .then(res => res.json())
    .then(() => {
        alert("Recipe added successfully!");
    })
    .catch(err => {
        console.error(err);
        alert("Error adding recipe");
    });
}