const authArea = document.getElementById("authArea");

const user = localStorage.getItem("currentUser");

if(user){

authArea.innerHTML = `

<div class="user-menu">

<span class="username">👤 ${user} ▼</span>

<div class="dropdown">

<button onclick="logout()">Logout</button>

</div>

</div>

`;

}else{

authArea.innerHTML = `

<a href="login.html" class="login-btn">Login</a>

`;

}

function logout(){

localStorage.removeItem("currentUser");

window.location.href="login.html";

}