
    window.addEventListener("DOMContentLoaded", function () {


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

    const newchat = document.querySelector("#newchat");
    const main = document.querySelector(".main-inner-1");
    const uploadInput = document.getElementById("uploadProfile");

    // Default icon
    const defaultPic = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    // Store uploaded profile pic
    let currentProfilePic = localStorage.getItem("profile-pic") || defaultPic;

    // Only add event listeners if elements exist
    if (uploadInput) {
      uploadInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function () {
            currentProfilePic = reader.result;
            localStorage.setItem("profile-pic", currentProfilePic);
          };
          reader.readAsDataURL(file);
        }
      });
    }

  newchat.addEventListener("click", () => {
    let name = prompt("Enter chat name:");
    if (!name) return;

    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const currentTime = `${hours}:${minutes} ${ampm}`;

    const chatObj = {
      name,
      time: currentTime,
      pic: currentProfilePic
    };

    addChatToDOM(chatObj);

    let chats = JSON.parse(localStorage.getItem("chats")) || [];
    chats.push(chatObj);
    localStorage.setItem("chats", JSON.stringify(chats));
  });

  function addChatToDOM({ name, time, pic }) {
    const div = document.createElement("div");
    div.classList.add("chatss");

    const uniqueId = `uploadProfile-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    div.innerHTML = `
      <label class="profile-container">
        <img src="${pic}" alt="Profile Picture" class="profilePic" id="profilePic-${uniqueId}">
      </label>
      <input type="file" id="${uniqueId}" accept="image/*" style="display: none;">
      <div class="description">
          <h5>${name}</h5>
          <p>image</p>
      </div>
      <div class="meta-data">
          <p>${time}</p>
          <p><!-- svg here --></p>
      </div>
    `;

    main.append(div);

    const fileInput = div.querySelector(`#${uniqueId}`);
    const profileImg = div.querySelector(`#profilePic-${uniqueId}`);

    profileImg.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          const newPic = reader.result;
          profileImg.src = newPic;

          let chats = JSON.parse(localStorage.getItem("chats")) || [];
          const index = chats.findIndex(c => c.name === name && c.time === time);
          if (index !== -1) {
            chats[index].pic = newPic;
            localStorage.setItem("chats", JSON.stringify(chats));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Load existing chats from localStorage on page load
  const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
  savedChats.forEach(chat => addChatToDOM(chat));
});
