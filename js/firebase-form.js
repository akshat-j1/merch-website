// firebase-form.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.0/firebase-auth.js";

/* ---------- Firebase config ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyBy8kzUGY8BxnzPHwVVyCQP_3JNa3fOnsY",
  authDomain: "stylehive-merch.firebaseapp.com",
  projectId: "stylehive-merch",
  storageBucket: "stylehive-merch.firebasestorage.app",
  messagingSenderId: "739353469704",
  appId: "1:739353469704:web:afa16cadbcf68a76b0c2bd"
};

/* ---------- Initialize Firebase ---------- */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* ---------- Utility: show toast ---------- */
export function showToast(msg, isError = false) {
  let t = document.createElement('div');
  t.textContent = msg;
  t.style.position = 'fixed';
  t.style.right = '20px';
  t.style.bottom = '20px';
  t.style.padding = '10px 14px';
  t.style.borderRadius = '8px';
  t.style.zIndex = 9999;
  t.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
  t.style.background = isError ? '#ffdddd' : '#e6ffed';
  t.style.color = isError ? '#b00000' : '#056624';
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 3500);
}

/* ---------- Auth UI ---------- */
export function initAuthUI(navSelector = 'nav .links') {
  const navLinks = document.querySelector(navSelector) || document.querySelector('.links');
  if (!navLinks) return;

  const authWrap = document.createElement('span');
  authWrap.id = 'auth-wrap';
  authWrap.style.marginLeft = '12px';
  authWrap.style.display = 'inline-flex';
  authWrap.style.alignItems = 'center';
  authWrap.style.gap = '8px';

  const loginBtn = document.createElement('button');
  loginBtn.id = 'login-btn';
  loginBtn.textContent = 'Sign in';
  loginBtn.className = 'btn';
  loginBtn.style.padding = '6px 10px';
  loginBtn.style.fontSize = '0.9rem';
  loginBtn.style.cursor = 'pointer';

  const logoutBtn = document.createElement('button');
  logoutBtn.id = 'logout-btn';
  logoutBtn.textContent = 'Sign out';
  logoutBtn.className = 'btn';
  logoutBtn.style.padding = '6px 10px';
  logoutBtn.style.fontSize = '0.9rem';
  logoutBtn.style.cursor = 'pointer';
  logoutBtn.style.display = 'none';

  const userLabel = document.createElement('span');
  userLabel.id = 'user-label';
  userLabel.style.fontSize = '0.9rem';
  userLabel.style.color = '#fff';
  userLabel.style.fontWeight = '600';
  userLabel.style.display = 'none';
  userLabel.style.marginLeft = '6px';

  authWrap.appendChild(loginBtn);
  authWrap.appendChild(logoutBtn);
  authWrap.appendChild(userLabel);

  navLinks.appendChild(authWrap);

  loginBtn.addEventListener('click', async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showToast('Signed in');
    } catch (err) {
      console.error(err);
      showToast('Sign-in failed', true);
    }
  });

  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      showToast('Signed out');
    } catch (err) {
      console.error(err);
      showToast('Sign-out failed', true);
    }
  });

  onAuthStateChanged(auth, user => {
    if (user) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      userLabel.style.display = 'inline-block';
      userLabel.textContent = user.email || user.displayName || 'Signed in';
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      userLabel.style.display = 'none';
      userLabel.textContent = '';
    }
  });
}

/* ---------- Customize Form ---------- */
export function initCustomizeForm(formSelector = '#customize form') {
  const form = document.querySelector(formSelector);
  if (!form) {
    console.warn('Customize form not found:', formSelector);
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = (form.querySelector('[name="name"]') || {}).value || 'Anonymous';
    const email = (form.querySelector('[name="email"]') || {}).value || '';
    const requestText = (form.querySelector('[name="request"]') || {}).value || '';
    if (!requestText.trim()) {
      showToast('Please enter your request', true);
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('input[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const payload = {
        name,
        email,
        request: requestText,
        createdAt: serverTimestamp(),
        user: auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email } : null
      };
      await addDoc(collection(db, 'custom_requests'), payload);

      showToast('Request saved — thank you!');
      form.reset();
    } catch (err) {
      console.error('Error saving request:', err);
      showToast('Failed to save — try again', true);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}