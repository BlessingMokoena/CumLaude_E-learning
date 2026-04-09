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

document.addEventListener("DOMContentLoaded", () => {

    // --- 2. Dropdown Logic ---
    const providerBtn = document.getElementById('redirectProvidersDropdownButton');
    const providerList = document.getElementById('loginRedirectProviderList');

    if (providerBtn && providerList) {
        providerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            providerList.classList.toggle('hidden');
            const isHidden = providerList.classList.contains('hidden');
            providerList.setAttribute('aria-hidden', isHidden);
        });

        // Close when an option is selected
        providerList.addEventListener('click', () => {
            providerList.classList.add('hidden');
            providerList.setAttribute('aria-hidden', 'true');
        });
    }

    // Close provider list when clicking elsewhere on the page
    document.body.addEventListener('click', (event) => {
        if (providerList && !providerList.classList.contains('hidden')) {
            if (event.target !== providerBtn) {
                providerList.classList.add('hidden');
                providerList.setAttribute('aria-hidden', 'true');
            }
        }
    });

    // --- 3. Secret Admin Access (5 Clicks) ---
    let logoClicks = 0;
    const logoImg = document.querySelector('.logo');
    
    if (logoImg) {
        logoImg.addEventListener('click', () => {
            logoClicks++;
            if (logoClicks === 5) {
                const secret = prompt("Enter Admin Access Key:");
                if (secret === "CL-2026") window.location.href = "admin-login.html";
            }
            setTimeout(() => { logoClicks = 0; }, 3000);
        });
    }

    // --- 4. Unified Login Handler & Validation ---
    const handleLogin = async (e) => {
        e.preventDefault(); 
        
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]') || form.querySelector('#username');
        const passwordInput = form.querySelector('input[type="password"]') || form.querySelector('#password');
        
        if (!emailInput || !passwordInput) {
            alert("Error: Could not find email or password fields.");
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic Validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        if (!email || !password) {
            alert("Please enter both your Email and Password.");
            return;
        }
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!passwordPattern.test(password)) {
            alert("Password is not secure enough!\n\nIt must be at least 8 characters long and include:\n- One uppercase letter\n- One lowercase letter\n- One number");
            return;
        }

        // Firebase Authentication
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                if (role === 'admin') window.location.href = "admin-login.html";
                else if (role === 'staff') window.location.href = "staff-dashboard.html";
                else window.location.href = "student-dashboard.html";
            } else {
                alert("No user role assigned. Contact Admin.");
            }
        } catch (error) {
            alert("Login Error: " + error.message);
        }
    };

    // Attach listeners to whichever forms are present on the current page
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('staffLoginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('guestLoginForm')?.addEventListener('submit', handleLogin);

    // --- 5. Password Reset Logic ---
    const forgotPasswordLink = document.querySelector('a[href="#"]');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    
    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordModal.classList.remove('hidden');
        });
    }

    const resetForm = document.getElementById('resetPasswordForm');
    const statusMsg = document.getElementById('statusMessage');

    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value.trim();

            if (!email) {
                alert("Please enter an email address.");
                return;
            }

            try {
                await sendPasswordResetEmail(auth, email);
                statusMsg.style.display = "block";
                statusMsg.style.color = "#166534"; 
                statusMsg.innerHTML = "<b>Success!</b> A reset link has been sent to your email.";
                resetForm.reset();
            } catch (error) {
                statusMsg.style.display = "block";
                statusMsg.style.color = "#991b1b"; 
                statusMsg.innerHTML = "<b>Error:</b> " + error.message;
            }
        });
    }
});