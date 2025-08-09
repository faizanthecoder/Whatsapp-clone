  window.addEventListener("DOMContentLoaded", function () {

    const sidebar = document.querySelector(".side-bar");
      const bars = document.getElementById("bars");

      // Sidebar starts hidden (closed)
      sidebar.classList.add("closed");

      bars.addEventListener("click", () => {
          sidebar.classList.toggle("closed");
      });

  let cls =document.querySelector("#close")
  let body=document.querySelector("body")
  cls.addEventListener("click",function(){
    // console.dir(body);
    body.hidden=true
    
  })

      const newchat = document.querySelector("#newchat");
      const leftpanel = document.querySelector(".left-panel");
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
    </div>
  `;

  // Append to the correct container
  document.querySelector(".chats-inner").append(div);
  console.log(localStorage.getItem("chats"));


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

    // function addChatToDOM({ name, time, pic }) {
    //   const div = document.createElement("div");
    //   div.classList.add("chatss");

    //   const uniqueId = `uploadProfile-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    //   div.innerHTML = `
    //     <label class="profile-container">
    //       <img src="${pic}" alt="Profile Picture" class="profilePic" id="profilePic-${uniqueId}">
    //     </label>
    //     <input type="file" id="${uniqueId}" accept="image/*" style="display: none;">
    //     <div class="description">
    //         <h5>${name}</h5>
    //         <p>image</p>
    //     </div>
    //     <div class="meta-data">
    //         <p>${time}</p>
            
    //     </div>
    //   `;

    //   leftpanel.append(div);

    //   const fileInput = div.querySelector(`#${uniqueId}`);
    //   const profileImg = div.querySelector(`#profilePic-${uniqueId}`);

    //   profileImg.addEventListener("click", () => {
    //     fileInput.click();
    //   });


    //   fileInput.addEventListener("change", function () {
    //     const file = this.files[0];
    //     if (file) {
    //       const reader = new FileReader();
    //       reader.onload = function () {
    //         const newPic = reader.result;
    //         profileImg.src = newPic;

    //         let chats = JSON.parse(localStorage.getItem("chats")) || [];
    //         const index = chats.findIndex(c => c.name === name && c.time === time);
    //         if (index !== -1) {
    //           chats[index].pic = newPic;
    //           localStorage.setItem("chats", JSON.stringify(chats));
    //         }
    //       };
    //       reader.readAsDataURL(file);
    //     }
    //   });
    // }

    // Use event delegation on the parent container
  document.querySelector(".left-panel").addEventListener("contextmenu", function(e) {
      if (e.target.closest(".chatss")) {
          e.preventDefault();
          document.querySelector(".chats-inner-ul").style.display="inline"

          // let sdiv = document.createElement("div");
          // sdiv.classList.add("chatss-selection");
          // document.querySelector(".chats-inner").appendChild(sdiv);
      }
  });

  let msg=document.querySelector("#messages")
  let phone=document.querySelector("#phone")
  let status=document.querySelector("#status")
  let chtsearch=document.querySelector(".chat-search")
  let leftpanel1=this.document.querySelector(".left-panel-1")
  let leftpanel2=this.document.querySelector(".left-panel-2")

  // phone.addEventListener("click",function pho () {
  //   leftpanel1.style="display:block;"
  //   leftpanel2.style="display:none;"

  //   console.log("done");
    
  // })

  // // let maininner11=this.document.querySelector(".main-inner-1-1")
  // msg.addEventListener("click",function mosag () {
  //   leftpanel1.style="display:none;"
  //   leftpanel2.style="display:none;"

  //   console.log("done2");
    
  // })

  // status.addEventListener("click",function stat () {
  //   leftpanel2.style="display:block;"
  //   chtsearch.style="display:none;"
  //   console.log("done3");
    
  // })

if (phone && leftpanel1 && leftpanel2) {
  phone.addEventListener("click", function () {
    leftpanel1.style.display = "block";
    leftpanel2.style.display = "none";
    console.log("done");
  });
}

if (msg && leftpanel1 && leftpanel2) {
  msg.addEventListener("click", function () {
    leftpanel1.style.display = "none";
    leftpanel2.style.display = "none";
    console.log("done2");
  });
}

if (status && leftpanel2 && chtsearch) {
  status.addEventListener("click", function () {
    leftpanel2.style.display = "block";
    chtsearch.style.display = "none";
    console.log("done3");
  });
}


let chatContainer = document.querySelector(".chats");
let contextMenu = document.querySelector(".chats-inner-ul");

// Hide menu on click anywhere else
document.addEventListener("click", function () {
  contextMenu.style.display = "none";
});

// Show menu on right-click
chatContainer.addEventListener("contextmenu", function (e) {
  let chatItem = e.target.closest(".chatss"); // detect which chat was clicked

  if (chatItem) {
    e.preventDefault();

    // Position the menu
    contextMenu.style.display = "flex"; // show menu
    contextMenu.style.position = "absolute";
    contextMenu.style.top = `${e.clientY}px`;
    contextMenu.style.left = `${e.clientX}px`;

    // Store chat reference if needed later
    contextMenu.dataset.chatId = chatItem.dataset.id || "";
  }
});


      // let chatsss=document.querySelector(".chatss")
      // let selc=this.document.querySelector(".chats-inner")

      // chatsss.addEventListener("contextmenu",function(e){
      //     e.preventDefault(); // prevents the default right-click menu

      //   let sdiv=document.createElement("div")
      //   sdiv.classList.add="chatss-selection"
      //   selc.append(sdiv)

      // })


    // Load existing chats from localStorage on page load
    const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
    savedChats.forEach(chat => addChatToDOM(chat));
  });
