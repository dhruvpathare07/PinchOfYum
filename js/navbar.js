document.addEventListener("DOMContentLoaded", () => {

    const authArea = document.getElementById("authArea");

    if (!authArea) return; // safety

    const username = localStorage.getItem("currentUser");
    const role = localStorage.getItem("role");

    // ✅ ACTIVE LINK
    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll("nav a").forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active-link");
        }
    });

    // ✅ AUTH UI
    if (username) {

        authArea.innerHTML = `
            ${role === "admin" ? `<a href="adminDashboard.html">Dashboard</a>` : ""}

            <div class="user-menu">
                <span class="username">${username}</span>
                <div class="dropdown">
                    <button onclick="logout()">Logout</button>
                </div>
            </div>
        `;

    } else {
        authArea.innerHTML = `<a href="login.html">Login</a>`;
    }

});

// LOGOUT (global)
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}