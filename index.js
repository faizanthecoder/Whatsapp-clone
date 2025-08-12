window.addEventListener("DOMContentLoaded", function () {
  // ----- basic UI element lookups (guarded) -----
  const sidebar = document.querySelector(".side-bar");
  const bars = document.getElementById("bars");
  if (sidebar && bars) {
    sidebar.classList.add("closed");
    bars.addEventListener("click", () => sidebar.classList.toggle("closed"));
  }

  const cls = document.querySelector("#close");
  if (cls) cls.addEventListener("click", () => (document.body.hidden = true));

  const newchat = document.querySelector("#newchat");
  const uploadInput = document.getElementById("uploadProfile");
  const defaultPic = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
  let currentProfilePic = localStorage.getItem("profile-pic") || defaultPic;

  const bulkDeleteBtn = document.getElementById("deleteSelected");

  if (uploadInput) {
    uploadInput.addEventListener("change", function () {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        currentProfilePic = reader.result;
        localStorage.setItem("profile-pic", currentProfilePic);
      };
      reader.readAsDataURL(file);
    });
  }

  function saveChat(chat) {
    const chats = JSON.parse(localStorage.getItem("chats")) || [];
    chats.push(chat);
    localStorage.setItem("chats", JSON.stringify(chats));
  }

  function updateChat(id, updates) {
    const chats = JSON.parse(localStorage.getItem("chats")) || [];
    const idx = chats.findIndex((c) => c.id === id);
    if (idx !== -1) {
      chats[idx] = { ...chats[idx], ...updates };
      localStorage.setItem("chats", JSON.stringify(chats));
    }
  }

  function removeChatFromStorage(chatId) {
    const storedChats = JSON.parse(localStorage.getItem("chats") || "[]");
    const updatedChats = storedChats.filter(chat => String(chat.id) !== String(chatId));
    localStorage.setItem("chats", JSON.stringify(updatedChats));
  }

  function toggleBulkDeleteButton() {
    const checkedCount = document.querySelectorAll(".chat-select:checked").length;
    if (bulkDeleteBtn) bulkDeleteBtn.style.display = checkedCount > 0 ? "inline-block" : "none";
  }

  if (bulkDeleteBtn) {
    bulkDeleteBtn.addEventListener("click", () => {
      const checkedBoxes = document.querySelectorAll(".chat-select:checked");
      checkedBoxes.forEach((checkbox) => {
        const chatEl = checkbox.closest(".chatss");
        if (!chatEl) return;
        const chatId = chatEl.dataset.id;
        removeChatFromStorage(chatId);
        chatEl.remove();
      });
      toggleBulkDeleteButton();
    });
  }

  function addChatToDOM(chat) {
    const { id, name, time, pic, favourite } = chat;
    const div = document.createElement("div");
    div.classList.add("chatss");
    if (favourite) div.classList.add("favourite");
    div.dataset.id = id;
    div.dataset.pic = pic; // store pic in dataset for easy access later
    div.dataset.name = name; // store pic in dataset for easy access later


    const uniqueId = `uploadProfile-${id}`;

    div.innerHTML = `
      <input type="checkbox" class="chat-select" style="margin-right:8px; display:none;">
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

    const chatsInner = document.querySelector(".chats-inner");
    if (!chatsInner) return;
    chatsInner.append(div);

    const fileInput = div.querySelector(`#${uniqueId}`);
    const profileImg = div.querySelector(`#profilePic-${uniqueId}`);
    if (profileImg && fileInput) {
      profileImg.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function () {
          const newPic = reader.result;
          profileImg.src = newPic;
          div.dataset.pic = newPic; // keep dataset in sync
          updateChat(id, { pic: newPic });
        };
        reader.readAsDataURL(file);
      });
    }

    const checkbox = div.querySelector(".chat-select");
    if (checkbox) checkbox.addEventListener("change", toggleBulkDeleteButton);
  }

  if (newchat) {
    newchat.addEventListener("click", () => {
      const name = prompt("Enter chat name:");
      if (!name) return;

      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      const currentTime = `${hours}:${minutes} ${ampm}`;

      const chatObj = {
        id: Date.now() + "-" + Math.floor(Math.random() * 1000),
        name,
        time: currentTime,
        pic: currentProfilePic,
        favourite: false,
      };

      addChatToDOM(chatObj);
      saveChat(chatObj);
    });
  }

  let selectedChatEl = null;
  const chatContainer = document.querySelector(".chats");
  const contextMenu = document.querySelector(".chats-inner-ul");

  document.addEventListener("click", () => {
    if (contextMenu) contextMenu.style.display = "none";
  });

  if (chatContainer && contextMenu) {
    chatContainer.addEventListener("contextmenu", function (e) {
      const chatItem = e.target.closest(".chatss");
      if (chatItem) {
        e.preventDefault();
        selectedChatEl = chatItem;
        contextMenu.style.display = "flex";
        contextMenu.style.position = "absolute";
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
      }
    });
  }
 
  //right panel selection
    let selectedChatE2 = null;
  const rightchats= document.querySelector(".right-panel-chats");
  const contextMenu2 = document.querySelector(".right-panel-ul");

  document.addEventListener("click", () => {
    if (contextMenu2) contextMenu2.style.display = "none";
  });

  if (rightchats && contextMenu2) {
    rightchats.addEventListener("contextmenu", function (e) {
      const chatItem2 = e.target.closest(".right-panel-chats");
      if (chatItem2) {
        e.preventDefault();
        selectedChatE2 = chatItem2;
        contextMenu2.style.display = "block";
        // contextMenu2.style.position = "absolute";
        contextMenu2.style.top = `${e.clientY}px`;
        contextMenu2.style.left = `${e.clientX}px`;
      }
    });
  }


  const closechat = document.getElementById("closechat");
  let rightpaneel=document.querySelector(".right-panel")
  if (closechat) {
    closechat.addEventListener("click", function () {
      // if (!selectedChatE2) return;
      // if (rightchats) rightchats.style.display = "none";
      rightchats.style.display = "none";
       rightpaneel.style.display = "block flex";



      // const id = selectedChatEl.dataset.id;
      // removeChatFromStorage(id);
      // selectedChatEl.remove();
      // if (contextMenu) contextMenu.style.display = "none";
      // toggleBulkDeleteButton();
    });
  }

  const addTopBtn = document.getElementById("addTop");
  if (addTopBtn) {
    addTopBtn.addEventListener("click", function () {
      if (!selectedChatEl) return;
      selectedChatEl.parentNode.prepend(selectedChatEl);
      if (contextMenu) contextMenu.style.display = "none";
    });
  }

  const deleteChatBtn = document.getElementById("deleteChat");
  if (deleteChatBtn) {
    deleteChatBtn.addEventListener("click", function () {
      if (!selectedChatEl) return;
      const id = selectedChatEl.dataset.id;
      removeChatFromStorage(id);
      selectedChatEl.remove();
      if (contextMenu) contextMenu.style.display = "none";
      toggleBulkDeleteButton();
    });
  }

  const renameChatBtn = document.getElementById("renameChat");
  if (renameChatBtn) {
    renameChatBtn.addEventListener("click", function () {
      if (!selectedChatEl) return;
      const newName = prompt("Enter new chat name:");
      if (!newName) return;
      selectedChatEl.querySelector("h5").textContent = newName;
      updateChat(selectedChatEl.dataset.id, { name: newName });
      if (contextMenu) contextMenu.style.display = "none";
    });
  }

  const addFavBtn = document.getElementById("addFav");
  if (addFavBtn) {
    addFavBtn.addEventListener("click", function () {
      if (!selectedChatEl) return;
      selectedChatEl.classList.toggle("favourite");
      updateChat(selectedChatEl.dataset.id, {
        favourite: selectedChatEl.classList.contains("favourite"),
      });
      if (contextMenu) contextMenu.style.display = "none";
    });
  }

  const selectThisOption = document.getElementById("selectThisOption");
  if (selectThisOption) {
    selectThisOption.addEventListener("click", function () {
      if (!selectedChatEl) return;
      const cb = selectedChatEl.querySelector(".chat-select");
      if (cb) {
        cb.style.display = "inline-block";
        cb.checked = true;
        toggleBulkDeleteButton();
      }
      if (contextMenu) contextMenu.style.display = "none";
    });
  }

  const selectAllOption = document.getElementById("selectAllOption");
  if (selectAllOption) {
    selectAllOption.addEventListener("click", function () {
      const boxes = Array.from(document.querySelectorAll(".chat-select"));
      if (boxes.length === 0) {
        if (contextMenu) contextMenu.style.display = "none";
        return;
      }
      const anyUnchecked = boxes.some((b) => !b.checked);
      boxes.forEach((b) => {
        b.style.display = "inline-block";
        b.checked = anyUnchecked;
      });
      toggleBulkDeleteButton();
      if (contextMenu) contextMenu.style.display = "none";
    });
  }

  let rightpanelchatss = document.querySelector(".right-panel-chats");
  let rightpanel = document.querySelector(".right-panel");
  let rightpanelheaderimg = document.querySelector("#right-panel-header-img");
  let rightpanelheadername = document.querySelector("#right-panel-header-name");

document.addEventListener("click", function (e) {
  let chat = e.target.closest(".chatss");
  if (chat) {
    rightpanel.style.display = "none";
    rightpanelchatss.style.display = "block flex";

    if (rightpanelheaderimg) {
      rightpanelheaderimg.setAttribute("src", chat.dataset.pic || defaultPic);
    }
console.log("Dataset name:", chat.dataset.name);
console.log("Header element:", rightpanelheadername);
    if (rightpanelheadername) {
      rightpanelheadername.textContent = chat.dataset.name || "";
    }
  }
});


  const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
  savedChats.forEach((chat) => addChatToDOM(chat));
  toggleBulkDeleteButton();
});

// attachment icon
let realattachment = document.querySelector("#realattachment");
let attachment = document.querySelector("#attachment");
if (realattachment && attachment) {
  realattachment.addEventListener("click", function () {
    attachment.click();
  });
}


// window.addEventListener("DOMContentLoaded", function () {
//     const sidebar = document.querySelector(".side-bar");
//     const bars = document.getElementById("bars");

//     sidebar.classList.add("closed");
//     bars.addEventListener("click", () => {
//         sidebar.classList.toggle("closed");
//     });

//     let cls = document.querySelector("#close");
//     let body = document.querySelector("body");
//     cls.addEventListener("click", function () {
//         body.hidden = true;
//     });

//     const newchat = document.querySelector("#newchat");
//     const uploadInput = document.getElementById("uploadProfile");
//     const defaultPic = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
//     let currentProfilePic = localStorage.getItem("profile-pic") || defaultPic;

//     if (uploadInput) {
//         uploadInput.addEventListener("change", function () {
//             const file = this.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = function () {
//                     currentProfilePic = reader.result;
//                     localStorage.setItem("profile-pic", currentProfilePic);
//                 };
//                 reader.readAsDataURL(file);
//             }
//         });
//     }

//     newchat.addEventListener("click", () => {
//         let name = prompt("Enter chat name:");
//         if (!name) return;

//         const now = new Date();
//         let hours = now.getHours();
//         let minutes = now.getMinutes();
//         const ampm = hours >= 12 ? 'PM' : 'AM';
//         hours = hours % 12 || 12;
//         minutes = minutes < 10 ? '0' + minutes : minutes;
//         const currentTime = `${hours}:${minutes} ${ampm}`;

//         const chatObj = {
//             id: Date.now() + "-" + Math.floor(Math.random() * 1000),
//             name,
//             time: currentTime,
//             pic: currentProfilePic,
//             favourite: false
//         };

//         addChatToDOM(chatObj);
//         saveChat(chatObj);
//     });

//     function addChatToDOM(chat) {
//     const { id, name, time, pic, favourite } = chat;
//     const div = document.createElement("div");
//     div.classList.add("chatss");
//     if (favourite) div.classList.add("favourite");
//     div.dataset.id = id;

//     const uniqueId = `uploadProfile-${id}`;

//     div.innerHTML = `
//         <input type="checkbox" class="chat-select" style="margin-right:8px;">
//         <label class="profile-container">
//             <img src="${pic}" alt="Profile Picture" class="profilePic" id="profilePic-${uniqueId}">
//         </label>
//         <input type="file" id="${uniqueId}" accept="image/*" style="display: none;">
//         <div class="description">
//             <h5>${name}</h5>
//             <p>image</p>
//         </div>
//         <div class="meta-data">
//             <p>${time}</p>
//         </div>
//     `;

//     document.querySelector(".chats-inner").append(div);

//     const fileInput = div.querySelector(`#${uniqueId}`);
//     const profileImg = div.querySelector(`#profilePic-${uniqueId}`);

//     profileImg.addEventListener("click", () => {
//         fileInput.click();
//     });

//     fileInput.addEventListener("change", function () {
//         const file = this.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function () {
//                 const newPic = reader.result;
//                 profileImg.src = newPic;
//                 updateChat(id, { pic: newPic });
//             };
//             reader.readAsDataURL(file);
//         }
//     });

//     // Selection logic
//     const checkbox = div.querySelector(".chat-select");
//     checkbox.addEventListener("change", toggleBulkDeleteButton);
// }

// function toggleBulkDeleteButton() {
//     const checkedCount = document.querySelectorAll(".chat-select:checked").length;
//     const bulkDeleteBtn = document.getElementById("deleteSelected");
//     bulkDeleteBtn.style.display = checkedCount > 0 ? "block" : "none";
// }

// document.getElementById("deleteSelected").addEventListener("click", function () {
//     const checkedBoxes = document.querySelectorAll(".chat-select:checked");
//     checkedBoxes.forEach(checkbox => {
//         const chatEl = checkbox.closest(".chatss");
//         deleteChat(chatEl.dataset.id);
//         chatEl.remove();
//     });
//     toggleBulkDeleteButton();
// });


// document.addEventListener("DOMContentLoaded", () => {
//     const selectAllCheckbox = document.getElementById("selectAllChats");
//     const deleteBtn = document.getElementById("deleteChat");

//     // Toggle all checkboxes when Select All is clicked
//     selectAllCheckbox.addEventListener("change", () => {
//         const checkboxes = document.querySelectorAll(".chat-select");
//         checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
//     });

//     // Delete selected chats
//     deleteBtn.addEventListener("click", () => {
//         const selectedChats = document.querySelectorAll(".chat-select:checked");
//         selectedChats.forEach(chatCheckbox => {
//             const chatItem = chatCheckbox.closest(".chat-item");
//             if (chatItem) {
//                 chatItem.remove();
//             }
//         });

//         // Uncheck Select All if all deleted
//         selectAllCheckbox.checked = false;
//     });
// });


//     function saveChat(chat) {
//         let chats = JSON.parse(localStorage.getItem("chats")) || [];
//         chats.push(chat);
//         localStorage.setItem("chats", JSON.stringify(chats));
//     }

//     function updateChat(id, updates) {
//         let chats = JSON.parse(localStorage.getItem("chats")) || [];
//         let index = chats.findIndex(c => c.id === id);
//         if (index !== -1) {
//             chats[index] = { ...chats[index], ...updates };
//             localStorage.setItem("chats", JSON.stringify(chats));
//         }
//     }

//     function deleteChat(id) {
//         let chats = JSON.parse(localStorage.getItem("chats")) || [];
//         chats = chats.filter(c => c.id !== id);
//         localStorage.setItem("chats", JSON.stringify(chats));
//     }

//     // Context menu
//     let selectedChatEl = null;
//     let chatContainer = document.querySelector(".chats");
//     let contextMenu = document.querySelector(".chats-inner-ul");

//     document.addEventListener("click", function () {
//         contextMenu.style.display = "none";
//     });

//     chatContainer.addEventListener("contextmenu", function (e) {
//         let chatItem = e.target.closest(".chatss");
//         if (chatItem) {
//             e.preventDefault();
//             selectedChatEl = chatItem;

//             contextMenu.style.display = "flex";
//             contextMenu.style.position = "absolute";
//             contextMenu.style.top = `${e.clientY}px`;
//             contextMenu.style.left = `${e.clientX}px`;
//         }
//     });

//     document.getElementById("addTop").addEventListener("click", function () {
//         if (!selectedChatEl) return;
//         selectedChatEl.parentNode.prepend(selectedChatEl);
//         contextMenu.style.display = "none";
//     });

//     document.getElementById("deleteChat").addEventListener("click", function () {
//         if (!selectedChatEl) return;
//         deleteChat(selectedChatEl.dataset.id);
//         selectedChatEl.remove();
//         contextMenu.style.display = "none";
//     });

//     document.getElementById("renameChat").addEventListener("click", function () {
//         if (!selectedChatEl) return;
//         let newName = prompt("Enter new chat name:");
//         if (!newName) return;

//         selectedChatEl.querySelector("h5").textContent = newName;
//         updateChat(selectedChatEl.dataset.id, { name: newName });
//         contextMenu.style.display = "none";
//     });

//     document.getElementById("addFav").addEventListener("click", function () {
//         if (!selectedChatEl) return;
//         selectedChatEl.classList.toggle("favourite");
//         updateChat(selectedChatEl.dataset.id, { favourite: selectedChatEl.classList.contains("favourite") });
//         contextMenu.style.display = "none";
//     });

//     // Load chats on page load
//     const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
//     savedChats.forEach(chat => addChatToDOM(chat));
// });



//code of the perfect js

//   window.addEventListener("DOMContentLoaded", function () {

//     const sidebar = document.querySelector(".side-bar");
//       const bars = document.getElementById("bars");

//       // Sidebar starts hidden (closed)
//       sidebar.classList.add("closed");

//       bars.addEventListener("click", () => {
//           sidebar.classList.toggle("closed");
//       });

//   let cls =document.querySelector("#close")
//   let body=document.querySelector("body")
//   cls.addEventListener("click",function(){
//     // console.dir(body);
//     body.hidden=true
    
//   })

//       const newchat = document.querySelector("#newchat");
//       const leftpanel = document.querySelector(".left-panel");
//       const uploadInput = document.getElementById("uploadProfile");

//       // Default icon
//       const defaultPic = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

//       // Store uploaded profile pic
//       let currentProfilePic = localStorage.getItem("profile-pic") || defaultPic;

//       // Only add event listeners if elements exist
//       if (uploadInput) {
//         uploadInput.addEventListener("change", function () {
//           const file = this.files[0];
//           if (file) {
//             const reader = new FileReader();
//             reader.onload = function () {
//               currentProfilePic = reader.result;
//               localStorage.setItem("profile-pic", currentProfilePic);
//             };
//             reader.readAsDataURL(file);
//           }
//         });
//       }



//     newchat.addEventListener("click", () => {
//       let name = prompt("Enter chat name:");
//       if (!name) return;

//       const now = new Date();
//       let hours = now.getHours();
//       let minutes = now.getMinutes();
//       const ampm = hours >= 12 ? 'PM' : 'AM';
//       hours = hours % 12 || 12;
//       minutes = minutes < 10 ? '0' + minutes : minutes;
//       const currentTime = `${hours}:${minutes} ${ampm}`;

//       const chatObj = {
//         name,
//         time: currentTime,
//         pic: currentProfilePic
//       };

//       addChatToDOM(chatObj);

//       let chats = JSON.parse(localStorage.getItem("chats")) || [];
//       chats.push(chatObj);
//       localStorage.setItem("chats", JSON.stringify(chats));
//     });


//     function addChatToDOM({ name, time, pic }) {
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

//   // Append to the correct container
//   document.querySelector(".chats-inner").append(div);
//   console.log(localStorage.getItem("chats"));


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

//     // function addChatToDOM({ name, time, pic }) {
//     //   const div = document.createElement("div");
//     //   div.classList.add("chatss");

//     //   const uniqueId = `uploadProfile-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//     //   div.innerHTML = `
//     //     <label class="profile-container">
//     //       <img src="${pic}" alt="Profile Picture" class="profilePic" id="profilePic-${uniqueId}">
//     //     </label>
//     //     <input type="file" id="${uniqueId}" accept="image/*" style="display: none;">
//     //     <div class="description">
//     //         <h5>${name}</h5>
//     //         <p>image</p>
//     //     </div>
//     //     <div class="meta-data">
//     //         <p>${time}</p>
            
//     //     </div>
//     //   `;

//     //   leftpanel.append(div);

//     //   const fileInput = div.querySelector(`#${uniqueId}`);
//     //   const profileImg = div.querySelector(`#profilePic-${uniqueId}`);

//     //   profileImg.addEventListener("click", () => {
//     //     fileInput.click();
//     //   });


//     //   fileInput.addEventListener("change", function () {
//     //     const file = this.files[0];
//     //     if (file) {
//     //       const reader = new FileReader();
//     //       reader.onload = function () {
//     //         const newPic = reader.result;
//     //         profileImg.src = newPic;

//     //         let chats = JSON.parse(localStorage.getItem("chats")) || [];
//     //         const index = chats.findIndex(c => c.name === name && c.time === time);
//     //         if (index !== -1) {
//     //           chats[index].pic = newPic;
//     //           localStorage.setItem("chats", JSON.stringify(chats));
//     //         }
//     //       };
//     //       reader.readAsDataURL(file);
//     //     }
//     //   });
//     // }

//     // Use event delegation on the parent container
//   document.querySelector(".left-panel").addEventListener("contextmenu", function(e) {
//       if (e.target.closest(".chatss")) {
//           e.preventDefault();
//           document.querySelector(".chats-inner-ul").style.display="inline"

//           // let sdiv = document.createElement("div");
//           // sdiv.classList.add("chatss-selection");
//           // document.querySelector(".chats-inner").appendChild(sdiv);
//       }
//   });

//   let msg=document.querySelector("#messages")
//   let phone=document.querySelector("#phone")
//   let status=document.querySelector("#status")
//   let chtsearch=document.querySelector(".chat-search")
//   let leftpanel1=this.document.querySelector(".left-panel-1")
//   let leftpanel2=this.document.querySelector(".left-panel-2")

//   // phone.addEventListener("click",function pho () {
//   //   leftpanel1.style="display:block;"
//   //   leftpanel2.style="display:none;"

//   //   console.log("done");
    
//   // })

//   // // let maininner11=this.document.querySelector(".main-inner-1-1")
//   // msg.addEventListener("click",function mosag () {
//   //   leftpanel1.style="display:none;"
//   //   leftpanel2.style="display:none;"

//   //   console.log("done2");
    
//   // })

//   // status.addEventListener("click",function stat () {
//   //   leftpanel2.style="display:block;"
//   //   chtsearch.style="display:none;"
//   //   console.log("done3");
    
//   // })

// if (phone && leftpanel1 && leftpanel2) {
//   phone.addEventListener("click", function () {
//     leftpanel1.style.display = "block";
//     leftpanel2.style.display = "none";
//     console.log("done");
//   });
// }

// if (msg && leftpanel1 && leftpanel2) {
//   msg.addEventListener("click", function () {
//     leftpanel1.style.display = "none";
//     leftpanel2.style.display = "none";
//     console.log("done2");
//   });
// }

// if (status && leftpanel2 && chtsearch) {
//   status.addEventListener("click", function () {
//     leftpanel2.style.display = "block";
//     chtsearch.style.display = "none";
//     console.log("done3");
//   });
// }


// let chatContainer = document.querySelector(".chats");
// let contextMenu = document.querySelector(".chats-inner-ul");

// // Hide menu on click anywhere else
// document.addEventListener("click", function () {
//   contextMenu.style.display = "none";
// });

// // Show menu on right-click
// chatContainer.addEventListener("contextmenu", function (e) {
//   let chatItem = e.target.closest(".chatss"); // detect which chat was clicked

//   if (chatItem) {
//     e.preventDefault();

//     // Position the menu
//     contextMenu.style.display = "flex"; // show menu
//     contextMenu.style.position = "absolute";
//     contextMenu.style.top = `${e.clientY}px`;
//     contextMenu.style.left = `${e.clientX}px`;

//     // Store chat reference if needed later
//     contextMenu.dataset.chatId = chatItem.dataset.id || "";
//   }
// });


// // Handle Rename
// document.getElementById("renameChat").addEventListener("click", function () {
//   if (!selectedChatEl) return;

//   let newName = prompt("Enter new chat name:");
//   if (!newName) return;

//   // Update DOM
//   selectedChatEl.querySelector("h5").textContent = newName;

//   // Update localStorage
//   let chats = JSON.parse(localStorage.getItem("chats")) || [];
//   let time = selectedChatEl.querySelector(".meta-data p").textContent;
//   let index = chats.findIndex(c => c.time === time);
//   if (index !== -1) {
//     chats[index].name = newName;
//     localStorage.setItem("chats", JSON.stringify(chats));
//   }

//   contextMenu.style.display = "none";
// });

// // Handle Delete
// document.getElementById("deleteChat").addEventListener("click", function () {
//   if (!selectedChatEl) return;

//   // Remove from DOM
//   selectedChatEl.remove();

//   // Remove from localStorage
//   let chats = JSON.parse(localStorage.getItem("chats")) || [];
//   let time = selectedChatEl.querySelector(".meta-data p").textContent;
//   chats = chats.filter(c => c.time !== time);
//   localStorage.setItem("chats", JSON.stringify(chats));

//   contextMenu.style.display = "none";
// });

//       // let chatsss=document.querySelector(".chatss")
//       // let selc=this.document.querySelector(".chats-inner")

//       // chatsss.addEventListener("contextmenu",function(e){
//       //     e.preventDefault(); // prevents the default right-click menu

//       //   let sdiv=document.createElement("div")
//       //   sdiv.classList.add="chatss-selection"
//       //   selc.append(sdiv)

//       // })


//     // Load existing chats from localStorage on page load
//     const savedChats = JSON.parse(localStorage.getItem("chats")) || [];
//     savedChats.forEach(chat => addChatToDOM(chat));
//   });
