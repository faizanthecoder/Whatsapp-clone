// let bar=document.querySelector("#bars")
// let sbar=document.querySelector(".side-bar")
// // let ctm =document.querySelectorAll(".c-t-m")

// // console.dir(ctm);



// bar.addEventListener("click",function(){
// let ctm =document.querySelectorAll(".c-t-m")

//     // sbar.style.marginRight = "50px";
//     ctm.hidden = !ctm.hidden;

// // sbar.classList.toggle("m-r");
// })

let bar = document.querySelector("#bars");
let sbar = document.querySelector(".side-bar");

let allCtm = document.querySelectorAll(".c-t-m");

bar.addEventListener("click", function () {
    // sbar.style="  border-right: 1px solid #c9c9c9;"
sbar.classList.toggle("b-c");
sbar.classList.toggle("s-b");


  allCtm.forEach(el => {
    let currentDisplay = getComputedStyle(el).display;

    if (currentDisplay === "none") {
      el.style.display = "block"; // Show
    } else {
      el.style.display = "none"; // Hide
    }
  });

});

// let bar = document.querySelector("#bars");
// let allCtm = document.querySelectorAll(".c-t-m");

// bar.addEventListener("click", function () {
//   allCtm.forEach(el => {
//     el.classList.toggle("show");
//   });
// });


// let bar = document.querySelector("#bars");
// let allCtm = document.querySelectorAll(".c-t-m");

// bar.addEventListener("click", function () {
//   allCtm.forEach(el => {
//     // Check if already hidden
//     if (el.style.display === "none") {
//       el.style.display = "block"; // Show it
    
//     } else {
//       el.style.display = "none"; // Hide it
//     }
//   });
// });
