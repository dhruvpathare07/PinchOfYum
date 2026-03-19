let selectedRating = 0;

function initReviews() {
    createStars();
    loadReviews();
}

function createStars() {
    const starContainer = document.getElementById("starInput");
    if (!starContainer) return;

    starContainer.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.innerHTML = "★";

        star.onclick = () => {
            selectedRating = i;
            updateStars();
        };

        starContainer.appendChild(star);
    }
}

function updateStars() {
    const stars = document.querySelectorAll("#starInput span");
    stars.forEach((s, index) => {
        s.classList.toggle("active", index < selectedRating);
    });
}

async function submitReview() {

    const username = localStorage.getItem("currentUser");
    const recipeId = new URLSearchParams(window.location.search).get("id");
    const comment = document.getElementById("reviewText").value;

    if (!username) {
        alert("Login first");
        return;
    }

    if (selectedRating === 0) {
        alert("Select rating");
        return;
    }

    try {
        await fetch("http://127.0.0.1:5000/add-review", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                recipe_id: recipeId,
                username,
                rating: selectedRating,
                comment
            })
        });

        document.getElementById("reviewText").value = "";
        selectedRating = 0;
        updateStars();

        loadReviews();

    } catch (err) {
        console.error(err);
        alert("Error submitting review");
    }
}

async function loadReviews() {

    const recipeId = new URLSearchParams(window.location.search).get("id");

    const res = await fetch("http://127.0.0.1:5000/reviews/" + recipeId);
    const data = await res.json();

    const container = document.getElementById("reviewList");
    const summary = document.getElementById("ratingSummary");

    container.innerHTML = "";

    if (data.length === 0) {
        container.innerHTML = "<p>No reviews yet</p>";
        summary.innerHTML = "";
        return;
    }

    const total = data.length;

    // ⭐ Average
    const avg = (data.reduce((a, b) => a + b.rating, 0) / total).toFixed(1);

    // ⭐ Count per rating
    let count = {1:0,2:0,3:0,4:0,5:0};
    data.forEach(r => count[r.rating]++);

    function getStarHTML(rating) {
        let html = "";
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) html += `<span class="star filled">★</span>`;
            else if (rating >= i - 0.5) html += `<span class="star half">★</span>`;
            else html += `<span class="star">★</span>`;
        }
        return html;
    }

    // 📊 SUMMARY UI
    summary.innerHTML = `
        <h3>${avg} ${getStarHTML(avg)} (${total} reviews)</h3>

        ${[5,4,3,2,1].map(star => `
            <div class="rating-bar">
                <span>${star}★</span>
                <div class="bar">
                    <div class="fill" style="width:${(count[star]/total)*100}%"></div>
                </div>
                <span>${count[star]}</span>
            </div>
        `).join("")}
    `;

    // 📝 REVIEWS
    data.reverse().forEach(r => {
        container.innerHTML += `
            <div class="review-item">
                <strong>${r.username}</strong> • ${getStarHTML(r.rating)}
                <p>${r.comment}</p>
                <small>${r.date}</small>
            </div>
        `;
    });
}