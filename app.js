// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const content = document.getElementById('content');
const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const newPostLink = document.getElementById('new-post-link');
const logoutLink = document.getElementById('logout-link');

const supBtn = document.getElementById('btn')
supBtn.addEventListener('click', function(){
    window.location.href = 'login.html'

})
// Event listeners
loginLink.addEventListener('click', showLogin);
signupLink.addEventListener('click', showSignup);
newPostLink.addEventListener('click', showNewPost);
logoutLink.addEventListener('click', logoutUser);

// Show different content based on user authentication state
function showHome() {
  content.innerHTML = `<h1>Welcome to the Blog</h1>`;
  loadBlogs();
}

function showLogin() {
  content.innerHTML = `
      <h1>Login</h1>
      <form id="login-form">
          <input type="email" id="login-email" placeholder="Email" required>
          <input type="password" id="login-password" placeholder="Password" required>
          <button type="submit">Login</button>
      </form>
  `;
  document.getElementById('login-form').addEventListener('submit', loginUser);
}

function showSignup() {
  content.innerHTML = `
      <h1>Sign Up</h1>
      <form id="signup-form">
          <input type="email" id="signup-email" placeholder="Email" required>
          <input type="password" id="signup-password" placeholder="Password" required>
          <button type="submit">Sign Up</button>
      </form>
  `;
  document.getElementById('signup-form').addEventListener('submit', signupUser);
}


function showNewPost() {
  content.innerHTML = `
      <h1>New Post</h1>
      <form id="new-post-form">
          <input type="text" id="post-title" placeholder="Title" required>
          <textarea id="post-content" rows="5" placeholder="Content" required></textarea>
          <button type="submit">Submit</button>
      </form>
  `;
  document.getElementById('new-post-form').addEventListener('submit', submitPost);
}

function loadBlogs() {
  db.collection('blogs').get().then(snapshot => {
      let html = '';
      snapshot.forEach(doc => {
          const data = doc.data();
          html += `
              <div class="blog-post">
                  <h2>${data.title}</h2>
                  <p>${data.content}</p>
              </div>
          `;
      });
      content.innerHTML = html;
  });
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password).then(() => {
      showHome();
  }).catch(error => {
      alert(error.message);
  });
}

function signupUser(event) {
  event.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  auth.createUserWithEmailAndPassword(email, password).then(() => {
      showHome();
  }).catch(error => {
      alert(error.message);
  });
}

function submitPost(event) {
  event.preventDefault();
  const title = document.getElementById('post-title').value;
  const content = document.getElementById('post-content').value;
  db.collection('blogs').add({
      title: title,
      content: content,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
      showHome();
  }).catch(error => {
      alert(error.message);
  });
}

function logoutUser() {
  auth.signOut().then(() => {
      showLogin();
  }).catch(error => {
      alert(error.message);
  });
}

// Initial load
auth.onAuthStateChanged(user => {
  if (user) {
      showHome();
  } else {
      showLogin();
  }
});
