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


let cls =document.querySelector("#close")
let body=document.querySelector("body")

cls.addEventListener("click",function(){
  // console.dir(body);
  body.hidden=true
  
})

// let cht=document.querySelector(".main-inner-chats")
// let chts=document.querySelector(".chatss")
// let maininner=document.querySelector(".main-inner-2")



// chts.addEventListener("click",function(){
  
//   maininner.style="display:none;"
//   // console.dir(chts);
//   cht.style="display:inline;"

  
// })



// // let animationIndex = 0;
// function cratediv(){

//   // const animations = ["moveRight", "scaleUp", "rotateDiv", "fadeInOut","jump"];
//   const main = document.querySelector("main");

//   // Randomly pick one animation
//   const randomIndex = Math.floor(Math.random() * animations.length);
//   const randomAnimation = animations[randomIndex];

//   const div = document.createElement("div");
//   div.classList.add("box", randomAnimation);

//   main.appendChild(div);
// }


let newchat = document.body.querySelector("#newchat");
let main = document.querySelector(".main-inner-1");
let counter = 1;

newchat.addEventListener("click", function () {
  let div = document.createElement("div");
  let pmt = prompt("What is the name of chat?");
  if (!pmt) return;

  // ✅ Time
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let currentTime = `${hours}:${minutes} ${ampm}`;

  div.classList.add("chatss");

  // 👇 Unique IDs for each profile picture and input
  let profileId = `profilePic${counter}`;
  let inputId = `uploadInput${counter}`;

  div.innerHTML = `
    <label class="profile-container" for="${inputId}">
      <img id="${profileId}" src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Profile Picture">
    </label>
    <input type="file" id="${inputId}" accept="image/*">
    <div class="description">
        <h5>${pmt}</h5>
        <p>image</p>
    </div>
    <div class="meta-data">
        <p>${currentTime}</p>
        <p><!-- svg here --></p>
    </div>`;

  div.id = `d${counter}`;
  main.append(div);

  // ✅ Add event listener for this specific chat's profile input
  const uploadInput = document.getElementById(inputId);
  const profilePic = document.getElementById(profileId);

  uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        profilePic.src = reader.result;
        // Optional: Save to localStorage (not really needed per chat)
      };
      reader.readAsDataURL(file);
    }
  });

  counter++;
});

// ..........................................
// let newchat = document.body.querySelector("#newchat");
// let main = document.querySelector(".main-inner-1");
// let counter = 1;

// newchat.addEventListener("click", function () {
//   let div = document.createElement("div");
//   let pmt = prompt("What is the name of chat?");
//   console.dir(pmt);

//   // ✅ Get current time
//   let now = new Date();
//   let hours = now.getHours();
//   let minutes = now.getMinutes();
//   let ampm = hours >= 12 ? 'PM' : 'AM';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // convert 0 to 12
//   minutes = minutes < 10 ? '0' + minutes : minutes;
//   let currentTime = `${hours}:${minutes} ${ampm}`;

//   div.classList.add("chatss");
// {/* <img src="img.png" alt="error"></img> */}
//   div.innerHTML = ` 
//      <label class="profile-container" for="uploadProfile">
//   <img id="profilePic" src="img.png" alt="Profile Picture">
// </label>
// <input type="file" id="uploadProfile" accept="image/*">
//     <div class="description">
//         <h5>${pmt}</h5>
//         <p>image</p>
//     </div>
//     <div class="meta-data">
//         <p>${currentTime}</p>
//         <p><!-- svg here --></p>
//     </div>`;

//   div.id = `d${counter}`;
//   main.append(div);
//   counter++;
//   console.log(div);
// });

// let uploadInput = document.getElementById("uploadProfile");
// let profilePic = document.getElementById("profilePic");

// console.log(uploadInput);

// uploadInput.addEventListener("change", function () {
//   const file = this.files[0];

//   if (file) {
//     const reader = new FileReader();

//     reader.onload = function () {
//       profilePic.src = reader.result;

//       // Optional: Save in localStorage to keep image on reload
//       localStorage.setItem("profile-pic", reader.result);
//     };

//     reader.readAsDataURL(file);
//   }
// });

// // Load saved image on page load (optional)
// window.addEventListener("DOMContentLoaded", () => {
//   const saved = localStorage.getItem("profile-pic");
//   if (saved) profilePic.src = saved;
// });
// .............................................

// document.querySelector(div)
// let newchat =document.body.querySelector("#newchat")
// let main=document.querySelector(".main-inner-1")
// // let p=document.querySelector("p")
// let counter =1;

// newchat.addEventListener("click",function(){
// let div =document.createElement("div")
// let pmt=prompt("What is the name of chat?")
// console.dir(pmt);

//  div.classList.add("chatss")

//  div.innerHTML=` <img src="img.png" alt="error">
//                             <div class="description">
//                                 <h5>${pmt}</h5><p>image</p>
//                             </div>
//                             <div class="meta-data">
//                                 <p> 1:00 pm </p>
//                                 <p>svg</p>
//                             </div>`;
// // for(let i=0;i<=10;i++){}
// //sets id
// div.id=`d${counter}`
// // div.classList="all"
// //set inner text
// // div.innerHTML=`<p>D ${counter}</p>`
// // div.querySelector("p").style.padding="50px;"
// //  let p = div.querySelector("p");
//   // p.style.margin = "100px";

// // div.innerHTML=`d${counter}`
// // p.style="margin:50px;""
//  main.append(div)
// counter ++;
//   console.log(div);
  
// })

// let cht=document.querySelector(".main-inner-chats")
// let chts=document.querySelector(".chatss")
// let maininner=document.querySelector(".main-inner-2")



// chts.addEventListener("click",function(){
  
//   maininner.style="display:none;"
//   // console.dir(chts);
//   cht.style="display:inline;"

  
// })


let chats=document.querySelector(".chatss")
const chatName = document.getElementById("chatName");
    const chatBody = document.getElementById("chatBody");

 chats.forEach(chat => {
      chat.addEventListener("click", () => {
        // const name = chat.getAttribute("id");
        // chatName.textContent = name;
        
  maininner.style="display:none;"
  console.dir(chat);
  chats.style="display:inline;"
        // chatBody.innerHTML = `<p>This is a conversation with <strong>${name}</strong>.</p>`;
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
