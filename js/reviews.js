function submitReview(){

const name=document.getElementById("revName").value
const comment=document.getElementById("revComment").value

const review={
name,
comment
}

let reviews=JSON.parse(localStorage.getItem("reviews"))||[]

reviews.push(review)

localStorage.setItem("reviews",JSON.stringify(reviews))

displayReviews()

}

function displayReviews(){

let reviews=JSON.parse(localStorage.getItem("reviews"))||[]

const container=document.getElementById("reviewList")

container.innerHTML=""

reviews.forEach(r=>{

container.innerHTML+=`
<div class="review">
<b>${r.name}</b>
<p>${r.comment}</p>
</div>
`

})

}