
(() => {
  const pakistaniNames = [
    "Ali", "Ahmed", "Fatima", "Hassan", "Ayesha", "Umar", "Zara", "Hamza", "Sana", "Zain",
    "Saad", "Iqra", "Hina", "Bilal", "Sadia", "Usman", "Nadia", "Fahad", "Mariam", "Imran",
    "Rida", "Asad", "Naveed", "Saba", "Zeeshan"
  ];

  const groupNames = [
    "Family Group", "Friends Circle", "Work Team", "College Mates", 
    "Gaming Squad", "Study Group", "Office Chat", "Project Team"
  ];

  const botReplies = [
    "Interesting!", "I see.", "Can you explain more?", "Wow!", "Nice one!",
    "Hmm...", "Cool!", "Haha, good one!", "Agreed!", "That's great!", "Shut Up!", "Get Lost"
  ];

  const emojiReactions = ["👍", "❤️", "😂", "😮", "😢", "👏"];

  // Elements
  const loginScreen = document.getElementById('loginScreen');
  const loginBtn = document.getElementById('loginBtn');
  const loginNameInput = document.getElementById('loginName');
  const loadingAnimation = document.getElementById('loadingAnimation');
  const appContainer = document.getElementById('appContainer');
  const sidebar = document.getElementById('sidebar');
  const messagesContainer = document.getElementById('messages');
  const pinnedMessagesContainer = document.querySelector('.pinned-messages-container');
  const pinnedMessagesList = document.querySelector('.pinned-messages-list');
  const hidePinnedBtn = document.querySelector('.hide-pinned-btn');
  const msgInput = document.getElementById('msgInput');
  const sendBtn = document.getElementById('sendBtn');
  const emojiBtn = document.getElementById('emojiBtn');
  const imageUploadBtn = document.getElementById('imageUploadBtn');
  const imageInput = document.getElementById('imageInput');
  const audioRecordBtn = document.getElementById('audioRecordBtn');
  const typingIndicator = document.getElementById('typingIndicator');
  const typingText = document.querySelector('.typing-text');
  const typingDots = document.querySelector('.typing-dots');
  const darkToggle = document.getElementById('darkModeToggle');
  const clock = document.getElementById('clock');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const header = document.querySelector('header');
  const newGroupBtn = document.getElementById('newGroupBtn');
  
  // Modal elements
  const groupModal = document.getElementById('groupModal');
  const groupNameInput = document.getElementById('groupNameInput');
  const groupMembersList = document.getElementById('groupMembersList');
  const closeGroupModal = document.getElementById('closeGroupModal');
  const cancelGroupBtn = document.getElementById('cancelGroupBtn');
  const createGroupBtn = document.getElementById('createGroupBtn');
  
  // Forward modal elements
  const forwardModal = document.getElementById('forwardModal');
  const forwardMessagePreview = document.getElementById('forwardMessagePreview');
  const forwardRecipientsList = document.getElementById('forwardRecipientsList');
  const closeForwardModal = document.getElementById('closeForwardModal');
  const cancelForwardBtn = document.getElementById('cancelForwardBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  
  // Context menu elements
  const contextMenu = document.getElementById('contextMenu');
  const forwardContextItem = document.getElementById('forwardContextItem');
  const pinContextItem = document.getElementById('pinContextItem');
  const editContextItem = document.getElementById('editContextItem');
  const deleteContextItem = document.getElementById('deleteContextItem');
  const reactContextItem = document.getElementById('reactContextItem');

  // Chat data structure:
  // {
  //   "user1-user2": {
  //     type: "private",
  //     messages: [{sender,text,time,seen,reactions,image,audio,isEdited,isPinned,isForwarded}, ...],
  //     pinnedMessages: [messageIndex1, messageIndex2, ...]
  //   },
  //   "group1": {
  //     type: "group",
  //     name: "Group Name",
  //     members: ["user1", "user2", ...],
  //     messages: [...],
  //     pinnedMessages: [...]
  //   },
  //   ...
  // }
  const chats = {};

  // State
  let loggedInUser = null;
  let selectedChatUser = null;
  let users = [];
  let groups = [];
  let lastMessageCount = 0;
  let headerHidden = false;
  let lastScrollPosition = 0;
  let typingTimeout = null;
  let mediaRecorder = null;
  let audioChunks = [];
  let forwardMessage = null;
  let contextMessage = null;

  // Initialize the app
  function init() {
    updateClock();
    setupEventListeners();
  }

  // Set up all event listeners
  function setupEventListeners() {
    // Clock update
    setInterval(updateClock, 1000);
    
    // Message scrolling
    messagesContainer.addEventListener('scroll', checkScrollPosition);
    
    // Scroll to bottom button
    scrollIndicator.addEventListener('click', scrollToBottom);
    
    // Hide pinned messages button
    hidePinnedBtn.addEventListener('click', () => {
      pinnedMessagesContainer.classList.remove('visible');
    });
    
    // Message input typing event
    msgInput.addEventListener("input", handleTyping);
    
    // Focus/blur effects on input
    msgInput.addEventListener('focus', () => {
      document.getElementById('chatFooter').classList.add('input-focused');
    });
    
    msgInput.addEventListener('blur', () => {
      document.getElementById('chatFooter').classList.remove('input-focused');
    });

    // Send button click
    sendBtn.onclick = () => {
      sendMessage({text: msgInput.value.trim()});
      animateButton(sendBtn);
    };

    // Send on Enter key
    msgInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage({text: msgInput.value.trim()});
      }
    });

    // Emoji button
    emojiBtn.onclick = () => {
      msgInput.value += "😊";
      msgInput.focus();
      animateButton(emojiBtn);
    };

    // Image upload button
    imageUploadBtn.onclick = () => {
      imageInput.click();
      animateButton(imageUploadBtn);
    };

    // Handle selected image file
    imageInput.onchange = handleImageUpload;

    // Audio recording button
    audioRecordBtn.onclick = toggleAudioRecording;

    // Dark mode toggle
    darkToggle.onclick = toggleDarkMode;

    // Login button
    loginBtn.onclick = handleLogin;

    // Group creation button
    newGroupBtn.onclick = showGroupModal;

    // Group modal buttons
    closeGroupModal.onclick = hideGroupModal;
    cancelGroupBtn.onclick = hideGroupModal;
    createGroupBtn.onclick = createNewGroup;

    // Forward modal buttons
    closeForwardModal.onclick = hideForwardModal;
    cancelForwardBtn.onclick = hideForwardModal;
    forwardBtn.onclick = forwardSelectedMessage;

    // Context menu items
    forwardContextItem.onclick = handleForwardFromContext;
    pinContextItem.onclick = handlePinFromContext;
    editContextItem.onclick = handleEditFromContext;
    deleteContextItem.onclick = handleDeleteFromContext;
    reactContextItem.onclick = handleReactFromContext;

    // Close context menu when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!contextMenu.contains(e.target) && contextMenu.style.display !== 'none') {
        contextMenu.style.display = 'none';
      }
    });
  }

  // Message forwarding functionality
  function handleForwardMessage(message) {
    forwardMessage = message;
    showForwardModal();
  }

  function showForwardModal() {
    if (!forwardMessage) return;
    
    // Set up the preview of the message to forward
    forwardMessagePreview.innerHTML = '';
    
    const previewDiv = document.createElement('div');
    previewDiv.classList.add('message');
    previewDiv.classList.add(forwardMessage.sender === loggedInUser ? 'me' : 'other');
    previewDiv.classList.add('forwarded');
    
    if (forwardMessage.image) {
      const img = document.createElement('img');
      img.src = forwardMessage.image;
      img.alt = "Forwarded image";
      previewDiv.appendChild(img);
    } else if (forwardMessage.audio) {
      const audioElem = document.createElement('audio');
      audioElem.controls = true;
      audioElem.src = forwardMessage.audio;
      audioElem.classList.add('audio-message');
      previewDiv.appendChild(audioElem);
    } else {
      previewDiv.textContent = forwardMessage.text;
    }
    
    forwardMessagePreview.appendChild(previewDiv);
    
    // Populate recipients list (users and groups excluding current chat)
    forwardRecipientsList.innerHTML = '';
    
    // Add individual users
    users.forEach(user => {
      if (user !== loggedInUser && user !== selectedChatUser) {
        const item = document.createElement('div');
        item.classList.add('user-select-item');
        item.innerHTML = `
          <span class="checkbox">◻</span>
          <span>${user}</span>
        `;
        item.onclick = () => toggleRecipientSelection(item, user);
        forwardRecipientsList.appendChild(item);
      }
    });
    
    // Add groups
    groups.forEach(group => {
      const item = document.createElement('div');
      item.classList.add('user-select-item');
      item.innerHTML = `
        <span class="checkbox">◻</span>
        <span>👥 ${group.name}</span>
      `;
      item.onclick = () => toggleRecipientSelection(item, group.name);
      forwardRecipientsList.appendChild(item);
    });
    
    forwardModal.style.display = 'flex';
  }

  function hideForwardModal() {
    forwardModal.style.display = 'none';
    forwardMessage = null;
  }

  function toggleRecipientSelection(element, recipient) {
    if (element.classList.contains('selected')) {
      element.classList.remove('selected');
      element.querySelector('.checkbox').textContent = '◻';
    } else {
      element.classList.add('selected');
      element.querySelector('.checkbox').textContent = '✓';
    }
  }

  function forwardSelectedMessage() {
    // Find all selected recipients
    const selectedItems = forwardRecipientsList.querySelectorAll('.selected');
    if (!selectedItems.length) {
      alert('Please select at least one recipient');
      return;
    }
    
    // Forward the message to each selected recipient/group
    selectedItems.forEach(item => {
      const recipientName = item.childNodes[3].textContent.trim();
      const isGroup = item.textContent.includes('👥');
      
      if (isGroup) {
        // Forward to group
        const group = groups.find(g => g.name === recipientName);
        if (group) {
          const chatKey = `group:${group.name.toLowerCase().replace(/\s+/g, '-')}`;
          if (!chats[chatKey]) chats[chatKey] = {
            type: 'group',
            name: group.name,
            members: group.members,
            messages: [],
            pinnedMessages: []
          };
          
          const newMessage = {
            ...forwardMessage,
            sender: loggedInUser,
            time: formatTime(new Date()),
            seen: false,
            isForwarded: true,
            isPinned: false
          };
          
          chats[chatKey].messages.push(newMessage);
        }
      } else {
        // Forward to user
        const chatKey = getChatKey(loggedInUser, recipientName);
        if (!chats[chatKey]) chats[chatKey] = {
          type: 'private',
          messages: [],
          pinnedMessages: []
        };
        
        const newMessage = {
          ...forwardMessage,
          sender: loggedInUser,
          time: formatTime(new Date()),
          seen: false,
          isForwarded: true,
          isPinned: false
        };
        
        chats[chatKey].messages.push(newMessage);
      }
    });
    
    hideForwardModal();
    renderSidebar();
    
    // If forwarding to current chat, refresh messages
    const currentSelectedItems = Array.from(selectedItems).map(item => 
      item.childNodes[3].textContent.trim()
    );
    if (currentSelectedItems.includes(selectedChatUser)) {
      renderMessages();
    }
    
    alert(`Message forwarded to ${selectedItems.length} recipient(s)`);
  }

  // Message pinning functionality
  function handlePinMessage(messageIndex) {
    const chatKey = getCurrentChatKey();
    const chat = chats[chatKey];
    
    if (!chat.pinnedMessages) chat.pinnedMessages = [];
    
    const alreadyPinned = chat.pinnedMessages.includes(messageIndex);
    
    if (alreadyPinned) {
      // Unpin the message
      chat.pinnedMessages = chat.pinnedMessages.filter(i => i !== messageIndex);
      chat.messages[messageIndex].isPinned = false;
    } else {
      // Pin the message
      chat.pinnedMessages.push(messageIndex);
      chat.messages[messageIndex].isPinned = true;
    }
    
    renderMessages();
    renderPinnedMessages();
  }

  function renderPinnedMessages() {
    const chatKey = getCurrentChatKey();
    const chat = chats[chatKey];
    
    if (!chat || !chat.pinnedMessages || chat.pinnedMessages.length === 0) {
      pinnedMessagesContainer.classList.remove('visible');
      return;
    }
    
    pinnedMessagesList.innerHTML = '';
    
    chat.pinnedMessages.forEach(index => {
      const msg = chat.messages[index];
      if (!msg) return;
      
      const msgDiv = document.createElement('div');
      msgDiv.classList.add('message');
      msgDiv.classList.add(msg.sender === loggedInUser ? 'me' : 'other');
      msgDiv.classList.add('pinned');
      
      const pinIndicator = document.createElement('span');
      pinIndicator.classList.add('pin-indicator');
      pinIndicator.textContent = '📌';
      msgDiv.appendChild(pinIndicator);
      
      if (msg.image) {
        const img = document.createElement('img');
        img.src = msg.image;
        img.alt = "Pinned image";
        msgDiv.appendChild(img);
      } else if (msg.audio) {
        const audioElem = document.createElement('audio');
        audioElem.controls = true;
        audioElem.src = msg.audio;
        audioElem.classList.add('audio-message');
        msgDiv.appendChild(audioElem);
      } else {
        msgDiv.textContent = msg.isEdited ? msg.text + " (edited)" : msg.text;
      }
      
      pinnedMessagesList.appendChild(msgDiv);
    });
    
    pinnedMessagesContainer.classList.add('visible');
  }

  // Group chat functionality
  function showGroupModal() {
    groupNameInput.value = groupNames[Math.floor(Math.random() * groupNames.length)];
    groupMembersList.innerHTML = '';
    
    // Populate with available users (excluding current user)
    users.forEach(user => {
      if (user !== loggedInUser) {
        const userItem = document.createElement('div');
        userItem.classList.add('user-select-item');
        userItem.innerHTML = `
          <span class="checkbox">◻</span>
          <span>${user}</span>
        `;
        userItem.onclick = () => toggleUserSelection(userItem);
        groupMembersList.appendChild(userItem);
      }
    });
    
    groupModal.style.display = 'flex';
  }

  function hideGroupModal() {
    groupModal.style.display = 'none';
  }

  function toggleUserSelection(element) {
    if (element.classList.contains('selected')) {
      element.classList.remove('selected');
      element.querySelector('.checkbox').textContent = '◻';
    } else {
      element.classList.add('selected');
      element.querySelector('.checkbox').textContent = '✓';
    }
  }

  function createNewGroup() {
    const groupName = groupNameInput.value.trim();
    if (!groupName) {
      alert('Please enter a group name');
      return;
    }
    
    const selectedMembers = Array.from(groupMembersList.querySelectorAll('.selected'))
      .map(el => el.childNodes[3].textContent.trim());
    
    if (selectedMembers.length < 2) {
      alert('Please select at least 2 members for the group');
      return;
    }
    
    // Add the current user to the group
    const allMembers = [...selectedMembers, loggedInUser];
    
    // Generate a unique ID for the group
    const groupId = `group:${groupName.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Add to groups list
    groups.push({
      id: groupId,
      name: groupName,
      members: allMembers
    });
    
    // Initialize chat for this group
    chats[groupId] = {
      type: 'group',
      name: groupName,
      members: allMembers,
      messages: [],
      pinnedMessages: []
    };
    
    hideGroupModal();
    renderSidebar();
    
    // Select the newly created group
    selectedChatUser = groupName;
    renderMessages();
    
    // Send a welcome message
    setTimeout(() => {
      const welcomeMsg = `Group "${groupName}" created with members: ${allMembers.join(', ')}`;
      chats[groupId].messages.push({
        sender: 'System',
        text: welcomeMsg,
        time: formatTime(new Date()),
        seen: true,
        reactions: {},
        isPinned: false
      });
      renderMessages();
    }, 500);
  }

  // Helper functions
  function getChatKey(user1, user2) {
    return [user1, user2].sort().join("-");
  }

  function getCurrentChatKey() {
    if (!selectedChatUser) return null;
    
    if (selectedChatUser.startsWith("group:")) {
      return selectedChatUser;
    }
    
    return getChatKey(loggedInUser, selectedChatUser);
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  }

  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
    
    clock.style.transform = "scale(1.1)";
    setTimeout(() => {
      clock.style.transform = "scale(1)";
    }, 200);
  }

  function animateButton(btn) {
    btn.style.transform = "scale(1.3) rotate(10deg)";
    setTimeout(() => {
      btn.style.transform = "scale(1) rotate(0)";
    }, 300);
  }

  function toggleDarkMode() {
    const isDark = document.body.style.backgroundColor === "rgb(18, 18, 18)" || document.body.style.backgroundColor === "";
    if (isDark) {
      document.body.style.backgroundColor = "#f0f0f0";
      document.body.style.color = "#222";
      document.getElementById('appContainer').style.backgroundColor = "#e0e0e0";
      document.getElementById('chatPanel').style.backgroundColor = "#d0d0d0";
      document.getElementById('sidebar').style.backgroundColor = "#c0c0c0";
      darkToggle.textContent = "🌙";
    } else {
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "#eee";
      document.getElementById('appContainer').style.backgroundColor = "#1e272e";
      document.getElementById('chatPanel').style.backgroundColor = "#192a56";
      document.getElementById('sidebar').style.backgroundColor = "#2f3640";
      darkToggle.textContent = "☀️";
    }
    
    darkToggle.style.transform = "scale(1.2) rotate(360deg)";
    setTimeout(() => {
      darkToggle.style.transform = "scale(1) rotate(0)";
    }, 300);
  }

  function scrollToBottom() {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: 'smooth'
    });
  }

  function checkScrollPosition() {
    const currentScroll = messagesContainer.scrollTop;
    const scrollHeight = messagesContainer.scrollHeight;
    const containerHeight = messagesContainer.clientHeight;
    
    if (currentScroll < scrollHeight - containerHeight - 100) {
      scrollIndicator.classList.add("visible");
    } else {
      scrollIndicator.classList.remove("visible");
    }
    
    if (currentScroll > lastScrollPosition && currentScroll > 100) {
      if (!headerHidden) {
        header.classList.add("hidden");
        headerHidden = true;
      }
    } else if (currentScroll < lastScrollPosition || currentScroll <= 50) {
      if (headerHidden) {
        header.classList.remove("hidden");
        headerHidden = false;
      }
    }
    
    lastScrollPosition = currentScroll;
  }

  function handleTyping() {
    if (!selectedChatUser) return;

    clearTimeout(typingTimeout);
    setTypingIndicator(selectedChatUser + " is typing...");

    typingTimeout = setTimeout(() => {
      setTypingIndicator("");
    }, 2000);
  }

  function setTypingIndicator(text) {
    typingText.textContent = text;
    if (text) {
      typingIndicator.classList.add("active");
    } else {
      typingIndicator.classList.remove("active");
    }
  }

  function handleImageUpload() {
    const file = imageInput.files[0];
    if (!file) return;

    imageUploadBtn.textContent = "⏳";
    imageUploadBtn.style.backgroundColor = "#f1c40f";

    const reader = new FileReader();
    reader.onload = () => {
      sendMessage({image: reader.result});
      imageUploadBtn.textContent = "🖼️";
      imageUploadBtn.style.backgroundColor = "#48c9b0";
    };
    reader.readAsDataURL(file);
    imageInput.value = "";
  }

  function toggleAudioRecording() {
    if (!mediaRecorder) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Audio recording is not supported on your browser.");
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.ondataavailable = e => {
            audioChunks.push(e.data);
          };
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            audioChunks = [];
            const audioUrl = URL.createObjectURL(audioBlob);
            sendMessage({audio: audioUrl});
          };
          mediaRecorder.start();
          audioRecordBtn.classList.add("recording");
          audioRecordBtn.title = "Stop Recording";
        })
        .catch(() => {
          alert("Permission denied for audio recording.");
          audioRecordBtn.classList.remove("recording");
        });
    } else if (mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      mediaRecorder = null;
      audioRecordBtn.classList.remove("recording");
      audioRecordBtn.title = "Record Audio";
    }
  }

  function generateUsers(excludeName) {
    return pakistaniNames.filter(name => name !== excludeName).slice(0, 25);
  }

  function renderSidebar() {
    sidebar.innerHTML = "";
    
    // Add users
    users.forEach((user, index) => {
      const div = document.createElement("div");
      div.textContent = user;
      div.classList.add("user-item");
      if (user === selectedChatUser) {
        div.classList.add("active");
      }
      
      const dot = document.createElement("div");
      dot.classList.add("online-dot");
      div.appendChild(dot);
      
      div.style.animationDelay = `${index * 0.05}s`;
      
      div.onclick = () => {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        div.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
        
        selectedChatUser = user;
        renderSidebar();
        renderMessages();
        setTypingIndicator("");
      };
      sidebar.appendChild(div);
    });
    
    // Add groups
    groups.forEach((group, index) => {
      const div = document.createElement("div");
      div.textContent = `👥 ${group.name}`;
      div.classList.add("group-item");
      if (group.name === selectedChatUser) {
        div.classList.add("active");
      }
      
      div.style.animationDelay = `${(index + users.length) * 0.05}s`;
      
      div.onclick = () => {
        const ripple = document.createElement("span");
        ripple.classList.add("ripple");
        div.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
        
        selectedChatUser = group.name;
        renderSidebar();
        renderMessages();
        setTypingIndicator("");
      };
      sidebar.appendChild(div);
    });
  }

  function renderMessages() {
    const currentMessageCount = messagesContainer.childElementCount;
    messagesContainer.innerHTML = "";
    
    // Add pinned messages section at the top
    renderPinnedMessages();
    
    if (!selectedChatUser) {
      const placeholder = document.createElement("p");
      placeholder.textContent = "Select a user to chat with.";
      placeholder.classList.add("no-messages");
      placeholder.style.animationDelay = "0.2s";
      messagesContainer.appendChild(placeholder);
      return;
    }
    
    const chatKey = getCurrentChatKey();
    const chatMsgs = chats[chatKey]?.messages || [];

    if (chatMsgs.length === 0) {
      const placeholder = document.createElement("p");
      const displayName = chatKey?.startsWith('group:') ? 
        `the ${chats[chatKey]?.name} group` : 
        selectedChatUser;
      placeholder.textContent = `Start chatting with ${displayName}!`;
      placeholder.classList.add("no-messages");
      placeholder.style.animationDelay = "0.2s";
      messagesContainer.appendChild(placeholder);
      return;
    }

    chatMsgs.forEach((msg, index) => {
      if (msg.isPinned && !pinnedMessagesContainer.classList.contains('visible')) {
        return; // Skip pinned messages if we're not showing them separately
      }
      
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("message");
      
      if (chatKey?.startsWith('group:')) {
        msgDiv.classList.add("group");
      } else {
        msgDiv.classList.add(msg.sender === loggedInUser ? "me" : "other");
      }
      
      if (msg.isForwarded) {
        msgDiv.classList.add("forwarded");
      }
      
      if (msg.isPinned) {
        msgDiv.classList.add("pinned");
      }
      
      msgDiv.dataset.index = index;
      
      if (index >= currentMessageCount) {
        msgDiv.style.animationDelay = `${index * 0.05}s`;
      } else {
        msgDiv.style.animation = "none";
      }

      // Context menu event
      msgDiv.oncontextmenu = (e) => {
        e.preventDefault();
        showContextMenu(e, index, msg);
        return false;
      };
      
      // Content: text, image or audio
      if (msg.image) {
        const img = document.createElement("img");
        img.src = msg.image;
        img.alt = "Sent image";
        img.onclick = () => window.open(msg.image, '_blank');
        msgDiv.appendChild(img);
      } else if (msg.audio) {
        const audioElem = document.createElement("audio");
        audioElem.controls = true;
        audioElem.src = msg.audio;
        audioElem.classList.add("audio-message");
        msgDiv.appendChild(audioElem);
      } else {
        const textDiv = document.createElement("div");
        textDiv.textContent = msg.isEdited ? msg.text + " (edited)" : msg.text;
        msgDiv.appendChild(textDiv);
      }

      // Reactions container
      const reactionsDiv = document.createElement("div");
      reactionsDiv.classList.add("reactions-container");
      if (msg.reactions) {
        Object.entries(msg.reactions).forEach(([emoji, count]) => {
          const reactionSpan = document.createElement("span");
          reactionSpan.textContent = emoji + (count > 1 ? ` ${count}` : "");
          reactionSpan.classList.add("reaction");
          if (msg.reactions[emoji] > 1) reactionSpan.classList.add("selected");
          reactionSpan.title = "Click to add your reaction";
          reactionSpan.onclick = (e) => {
            e.stopPropagation();
            addReactionToMessage(index, emoji);
          };
          reactionsDiv.appendChild(reactionSpan);
        });
      }
      msgDiv.appendChild(reactionsDiv);

      // Timestamp and seen status container
      const tsStatusDiv = document.createElement("div");
      tsStatusDiv.classList.add("timestamp-status");
      const timeSpan = document.createElement("span");
      timeSpan.textContent = msg.time;
      tsStatusDiv.appendChild(timeSpan);

      // Seen/read checkmark only for messages sent by loggedInUser
      if (msg.sender === loggedInUser) {
        const seenSpan = document.createElement("span");
        seenSpan.classList.add("seen-status");
        seenSpan.title = "Seen status";
        seenSpan.textContent = msg.seen ? "✓✓" : "✓";
        tsStatusDiv.appendChild(seenSpan);
      }
      msgDiv.appendChild(tsStatusDiv);

      // Message actions (edit, delete, react, forward, pin)
      const actionsDiv = document.createElement("div");
      actionsDiv.classList.add("message-actions");
      
      // Forward button
      const forwardBtn = document.createElement("button");
      forwardBtn.title = "Forward message";
      forwardBtn.textContent = "📤";
      forwardBtn.onclick = (e) => {
        e.stopPropagation();
        handleForwardMessage(msg);
      };
      actionsDiv.appendChild(forwardBtn);
      
      // Pin button
      const pinBtn = document.createElement("button");
      pinBtn.title = msg.isPinned ? "Unpin message" : "Pin message";
      pinBtn.textContent = "📌";
      pinBtn.onclick = (e) => {
        e.stopPropagation();
        handlePinMessage(index);
      };
      actionsDiv.appendChild(pinBtn);

      // Edit button (only for your own text messages)
      if (msg.sender === loggedInUser && !msg.audio && !msg.image) {
        const editBtn = document.createElement("button");
        editBtn.title = "Edit message";
        editBtn.textContent = "✏️";
        editBtn.onclick = (e) => {
          e.stopPropagation();
          editMessage(index);
        };
        actionsDiv.appendChild(editBtn);
      }

      // Delete button (only for your own messages)
      if (msg.sender === loggedInUser) {
        const deleteBtn = document.createElement("button");
        deleteBtn.title = "Delete message";
        deleteBtn.textContent = "🗑️";
        deleteBtn.onclick = (e) => {
          e.stopPropagation();
          deleteMessage(index);
        };
        actionsDiv.appendChild(deleteBtn);
      }

      // Reaction picker button
      const reactBtn = document.createElement("button");
      reactBtn.title = "Add reaction";
      reactBtn.textContent = "😊";
      reactBtn.onclick = (e) => {
        e.stopPropagation();
        showReactionPicker(index, reactBtn);
      };
      actionsDiv.appendChild(reactBtn);

      msgDiv.appendChild(actionsDiv);
      messagesContainer.appendChild(msgDiv);
    });

    setTimeout(() => {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
    
    setTimeout(checkScrollPosition, 500);
    lastMessageCount = chatMsgs.length;
  }

  function showContextMenu(e, index, message) {
    contextMessage = { index, message };
    
    // Position the context menu
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.classList.add('visible');
    
    // Update context menu items based on message properties
    if (message.isPinned) {
      pinContextItem.textContent = "📌 Unpin Message";
    } else {
      pinContextItem.textContent = "📌 Pin Message";
    }
    
    // Hide edit option if not your message or not text
    if (message.sender !== loggedInUser || message.image || message.audio) {
      editContextItem.style.display = 'none';
    } else {
      editContextItem.style.display = 'flex';
    }
    
    // Hide delete option if not your message
    if (message.sender !== loggedInUser) {
      deleteContextItem.style.display = 'none';
    } else {
      deleteContextItem.style.display = 'flex';
    }
  }

  function handleForwardFromContext() {
    if (!contextMessage) return;
    handleForwardMessage(contextMessage.message);
    contextMenu.style.display = 'none';
  }

  function handlePinFromContext() {
    if (!contextMessage) return;
    handlePinMessage(contextMessage.index);
    contextMenu.style.display = 'none';
  }

  function handleEditFromContext() {
    if (!contextMessage) return;
    editMessage(contextMessage.index);
    contextMenu.style.display = 'none';
  }

  function handleDeleteFromContext() {
    if (!contextMessage) return;
    deleteMessage(contextMessage.index);
    contextMenu.style.display = 'none';
  }

  function handleReactFromContext() {
    if (!contextMessage) return;
    const reactBtn = document.querySelector(`.message[data-index="${contextMessage.index}"] .message-actions button:last-child`);
    showReactionPicker(contextMessage.index, reactBtn);
    contextMenu.style.display = 'none';
  }

  function addReactionToMessage(index, emoji) {
    const chatKey = getCurrentChatKey();
    const msg = chats[chatKey]?.messages[index];
    if (!msg) return;
    
    if (!msg.reactions) msg.reactions = {};
    msg.reactions[emoji] = (msg.reactions[emoji] || 0) + 1;
    
    // Find and animate the reaction
    const messageElement = document.querySelector(`.message[data-index="${index}"]`);
    if (messageElement) {
      const reactionSpans = messageElement.querySelectorAll('.reaction');
      const reactionToAnimate = Array.from(reactionSpans).find(span => 
        span.textContent.startsWith(emoji)
      );
      
      if (reactionToAnimate) {
        reactionToAnimate.style.transform = "scale(1.5)";
        setTimeout(() => {
          reactionToAnimate.style.transform = "scale(1)";
        }, 300);
      }
    }
    
    renderMessages();
  }

  function sendMessage({text=null, image=null, audio=null} = {}) {
    if (!selectedChatUser) {
      alert("Please select a user from the sidebar to chat.");
      return;
    }
    if (!text && !image && !audio) return;

    const chatKey = getCurrentChatKey();
    if (!chats[chatKey]) {
      chats[chatKey] = {
        type: chatKey.startsWith('group:') ? 'group' : 'private',
        messages: [],
        pinnedMessages: []
      };
      
      if (chatKey.startsWith('group:')) {
        const group = groups.find(g => `group:${g.name.toLowerCase().replace(/\s+/g, '-')}` === chatKey);
        if (group) {
          chats[chatKey].name = group.name;
          chats[chatKey].members = group.members;
        }
      }
    }

    const now = formatTime(new Date());

    chats[chatKey].messages.push({
      sender: loggedInUser,
      text: text || "",
      time: now,
      seen: false,
      reactions: {},
      image: image || null,
      audio: audio || null,
      isEdited: false,
      isPinned: false,
      isForwarded: false
    });

    renderMessages();
    msgInput.value = "";
    msgInput.focus();

    setTimeout(() => {
      const lastMsg = chats[chatKey].messages[chats[chatKey].messages.length - 1];
      lastMsg.seen = true;
      renderMessages();
    }, 1000);

    // Bot auto reply after 1.5 seconds (only for private chats and text replies)
    setTimeout(() => {
      if (!chatKey.startsWith('group:') && text) {
        const botText = botReplies[Math.floor(Math.random() * botReplies.length)];
        chats[chatKey].messages.push({
          sender: selectedChatUser,
          text: botText,
          time: formatTime(new Date()),
          seen: true,
          reactions: {},
          image: null,
          audio: null,
          isEdited: false,
          isPinned: false
        });
        renderMessages();
      }
    }, 1500);
  }

  function editMessage(index) {
    const chatKey = getCurrentChatKey();
    const msg = chats[chatKey]?.messages[index];
    if (!msg) return;
    
    const newText = prompt("Edit your message:", msg.text);
    if (newText !== null && newText.trim() !== "") {
      msg.text = newText.trim();
      msg.isEdited = true;
      renderMessages();
    }
  }

  function deleteMessage(index) {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    const chatKey = getCurrentChatKey();
    const messageElement = document.querySelector(`.message[data-index="${index}"]`);
    
    if (messageElement) {
      messageElement.style.animation = "none";
      messageElement.style.transition = "all 0.3s";
      messageElement.style.transform = "translateX(100px)";
      messageElement.style.opacity = "0";
      
      setTimeout(() => {
        chats[chatKey].messages.splice(index, 1);
        
        // Remove from pinned messages if it was pinned
        chats[chatKey].pinnedMessages = chats[chatKey].pinnedMessages.filter(i => i !== index);
        
        // Adjust remaining pinned message indexes
        chats[chatKey].pinnedMessages = chats[chatKey].pinnedMessages.map(i => {
          return i > index ? i - 1 : i;
        });
        
        renderMessages();
      }, 300);
    }
  }

  function handleLogin() {
    const name = loginNameInput.value.trim();
    if (!name) {
      loginNameInput.style.animation = "none";
      loginNameInput.offsetHeight;
      loginNameInput.style.animation = "shake 0.5s";
      setTimeout(() => loginNameInput.style.animation = "", 500);
      
      alert("Please enter your display name.");
      return;
    }
    
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    loginBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    loggedInUser = name;
    localStorage.setItem("kahutschat_name", loggedInUser);
    users = generateUsers(loggedInUser);
    selectedChatUser = users[0];
    
    loginScreen.style.animation = "fadeOut 0.5s forwards";
    
    loadingAnimation.style.display = "flex";
    setTimeout(() => {
      loginScreen.style.display = "none";
      loadingAnimation.style.animation = "fadeOut 0.5s forwards";
      
      setTimeout(() => {
        loadingAnimation.style.display = "none";
        appContainer.style.display = "flex";
        appContainer.style.animation = "fadeIn 0.6s ease-out forwards";
        renderSidebar();
        renderMessages();
        msgInput.focus();
      }, 2000);
    }, 500);
  }

  window.onload = () => {
    const savedName = localStorage.getItem("kahutschat_name");
    if (savedName) {
      loggedInUser = savedName;
      users = generateUsers(loggedInUser);
      selectedChatUser = users[0];
      loginScreen.style.display = "none";
      loadingAnimation.style.display = "flex";
      setTimeout(() => {
        loadingAnimation.style.display = "none";
        appContainer.style.display = "flex";
        renderSidebar();
        renderMessages();
        msgInput.focus();
      }, 2000);
    }
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translateY(20px); }
      }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.7);
        width: 10px;
        height: 10px;
        animation: rippleEffect 0.6s linear;
      }
      @keyframes rippleEffect {
        to {
          transform: scale(40);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    init();
  };

})();
