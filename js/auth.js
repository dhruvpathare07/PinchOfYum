let isLogin = true

function toggleForm(){

const title=document.getElementById("formTitle")
const btn=document.querySelector("button")
const switchText=document.querySelector(".switch")

const error=document.getElementById("errorMsg")

error.innerText=""

if(isLogin){

title.innerText="Register"
btn.innerText="Register"
switchText.innerText="Already have an account? Login"

btn.setAttribute("onclick","register()")

}else{

title.innerText="Login"
btn.innerText="Login"
switchText.innerText="Don't have an account? Register"

btn.setAttribute("onclick","login()")

}

isLogin=!isLogin

}


async function register(){

const username=document.getElementById("username").value
const password=document.getElementById("password").value

const res=await fetch("http://127.0.0.1:5000/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username,
password
})

})

const data=await res.json()

if(data.message==="User registered successfully"){

alert("Registration successful")

toggleForm()

}else{

document.getElementById("errorMsg").innerText=data.message

}

}



async function login(){

const username=document.getElementById("username").value
const password=document.getElementById("password").value

const res=await fetch("http://127.0.0.1:5000/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
username,
password
})

})

const data=await res.json()

if(data.message==="Login successful"){

localStorage.setItem("currentUser",username)

window.location.href="index.html"

}else{

document.getElementById("errorMsg").innerText=data.message

}

}