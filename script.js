document.addEventListener("DOMContentLoaded", function() {
    
    // Elements for the dropdown toggle
    const providerListDropdownButton = document.getElementById('redirectProvidersDropdownButton');
    const providerList = document.getElementById('loginRedirectProviderList');

    // Open/close providers list dropdown
    if (providerListDropdownButton && providerList) {
        providerListDropdownButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent immediate closing
            providerList.classList.toggle('hidden');
            
            // Update aria attribute for accessibility
            const isHidden = providerList.classList.contains('hidden');
            providerList.setAttribute('aria-hidden', isHidden);
        });
    }

    // Close the dropdown when an option is selected
providerList.addEventListener('click', () => {
    providerList.classList.add('hidden');
});
    // Close provider list when clicking elsewhere on the page
    document.body.addEventListener('click', function(event) {
        if (providerList && !providerList.classList.contains('hidden')) {
            // Check if the click was outside the dropdown button
            if (event.target !== providerListDropdownButton) {
                providerList.classList.add('hidden');
                providerList.setAttribute('aria-hidden', 'true');
            }
        }
    });

    let logoClicks = 0;
const logoImg = document.querySelector('.logo');

logoImg.addEventListener('click', () => {
    logoClicks++;
    if (logoClicks === 5) { // Secret: Click 5 times
        const secretCode = prompt("Enter Admin Access Key:");
        if (secretCode === "CL-2026") { // A second layer of security
            window.location.href = "admin-login.html";
        }
    }
    // Reset counter if they don't click fast enough
    setTimeout(() => { logoClicks = 0; }, 3000);
});

    // Optional: Basic Form Validation before submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            // 1. Email Validation (Regex)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // 2. Password Security Requirements:
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!emailPattern.test(email)) {
            event.preventDefault();
            alert("Please enter a valid email address (e.g., student@gmail.com).");
            return;
        }

        if (!passwordPattern.test(password)) {
            event.preventDefault();
            alert("Password is not secure enough!\n\nIt must be at least 8 characters long and include:\n- One uppercase letter\n- One lowercase letter\n- One number");
            return;
        }

            if (!username || !password) {
                event.preventDefault();
                alert("Please enter both your Student ID and password.");
            }
        });
    }

    // Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Your Firebase Config (Paste your actual config here)
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "cumlaude-portal.firebaseapp.com",
  projectId: "cumlaude-portal",
  // ... rest of your config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // 1. Authenticate user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Fetch User Role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // 3. Redirect based on role
            if (userData.role === 'admin') {
                window.location.href = "admin-dashboard.html";
            } else if (userData.role === 'staff') {
                window.location.href = "staff-login.html"; // Or a specific dashboard
            } else {
                window.location.href = "student-portal.html";
            }
        } else {
            alert("User profile not found in database.");
        }
    } catch (error) {
        alert("Error: " + error.message);
    }
});

});