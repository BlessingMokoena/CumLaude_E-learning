import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 1. Unified Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBjZIbMUozbDtPJMKhzaJZT_-P4KEP9uKE",
    authDomain: "cumlaude-blackboard.firebaseapp.com",
    projectId: "cumlaude-blackboard",
    storageBucket: "cumlaude-blackboard.firebasestorage.app",
    messagingSenderId: "495067551795",
    appId: "1:495067551795:web:011ea05b87f50bbb4aeb46",
    measurementId: "G-GZS97CVHHV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 2. Dropdown Logic
document.addEventListener("DOMContentLoaded", () => {
    const providerBtn = document.getElementById('redirectProvidersDropdownButton');
    const providerList = document.getElementById('loginRedirectProviderList');

    if (providerBtn && providerList) {
        providerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            providerList.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', () => {
        providerList?.classList.add('hidden');
    });

    // 3. Secret Admin Access (5 Clicks)
    let logoClicks = 0;
    const logoImg = document.querySelector('.logo');
    logoImg?.addEventListener('click', () => {
        logoClicks++;
        if (logoClicks === 5) {
            const secret = prompt("Enter Admin Access Key:");
            if (secret === "CL-2026") window.location.href = "admin-login.html";
        }
        setTimeout(() => { logoClicks = 0; }, 3000);
    });
});

// 4. Unified Login Handler (Handles Student, Staff, and Guest forms)
const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch Role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const role = userDoc.data().role;
            if (role === 'admin') window.location.href = "admin-dashboard.html";
            else if (role === 'staff') window.location.href = "staff-dashboard.html";
            else window.location.href = "student-dashboard.html";
        } else {
            alert("No user role assigned. Contact Admin.");
        }
    } catch (error) {
        alert("Login Error: " + error.message);
    }
};

// Attach listener to whichever form is present on the current page
document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
document.getElementById('staffLoginForm')?.addEventListener('submit', handleLogin);
document.getElementById('guestLoginForm')?.addEventListener('submit', handleLogin);
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

// Password Reset Logic
document.querySelector('a[href="#"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
});

document.getElementById('sendResetBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('resetEmail').value;
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Reset email sent! Check your inbox.");
        document.getElementById('forgotPasswordModal').classList.add('hidden');
    } catch (error) {
        alert(error.message);
    }

const resetForm = document.getElementById('resetPasswordForm');
const statusMsg = document.getElementById('statusMessage');

if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;

        try {
            // Using 'auth' which was initialized earlier in your script
            await sendPasswordResetEmail(auth, email);
            
            statusMsg.style.display = "block";
            statusMsg.style.color = "#166534"; // Success Green
            statusMsg.innerHTML = "<b>Success!</b> A reset link has been sent to your email.";
            resetForm.reset();
        } catch (error) {
            statusMsg.style.display = "block";
            statusMsg.style.color = "#991b1b"; // Error Red
            statusMsg.innerHTML = "<b>Error:</b> " + error.message;
        }
    });
}

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

    
});