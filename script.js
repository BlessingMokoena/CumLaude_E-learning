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

    // Optional: Basic Form Validation before submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!username || !password) {
                event.preventDefault();
                alert("Please enter both your Student ID and password.");
            }
        });
    }
});