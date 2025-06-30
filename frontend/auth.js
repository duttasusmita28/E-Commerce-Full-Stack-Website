// ✅ Session Check (Redirect if not logged in)
fetch("http://127.0.0.1:5000/check-session", {
    method: "GET",
    credentials: "include"
})
.then(response => response.json())
.then(data => {
    console.log("🔍 Session Check Response:", data); 

    if (data.logged_in) {
        console.log("✅ User is logged in.");
        setTimeout(() => {
            if (window.location.pathname !== "/frontend/index.html") {
                console.log("🔄 Redirecting to homepage...");
                window.location.replace("index.html"); 
            }
        }, 500);
    } else {
        console.log("❌ No active session. Staying on auth page.");
    }
})
.catch(error => {
    console.error("⚠️ Error checking session:", error);
    alert("⚠️ Cannot connect to server. Please check backend.");
});


// ✅ Fix Sign-Up API Request
document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const userData = {
        name: document.getElementById("signup-name").value,
        email: document.getElementById("signup-email").value,
        phone: document.getElementById("signup-phone").value,
        password: document.getElementById("signup-password").value
    };

    fetch("http://127.0.0.1:5000/signup", {  
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Sign-up successful! Redirecting to login...");
            window.location.href = "auth.html"; 
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error("Error:", error));
});

// ✅ Fix Sign-In API Request (Ensure Redirect Works)
document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 DOM Loaded. Initializing auth.js...");  // Debugging

    const signinForm = document.getElementById("signinForm");
    
    if (signinForm) {  
        signinForm.addEventListener("submit", async function(event) {
            event.preventDefault();

            const userData = {
                email: document.getElementById("signin-email").value,
                password: document.getElementById("signin-password").value
            };

            try {
                const response = await fetch("http://127.0.0.1:5000/signin", {  
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",  
                    body: JSON.stringify(userData)
                });

                const data = await response.json();
                console.log("🔍 Backend Response:", data);  // Debugging

                if (data.success) {
                    sessionStorage.setItem("userLoggedIn", "true");
                    alert("✅ Login successful! Redirecting...");
                    setTimeout(() => {
                   // 🔥 FORCE REDIRECT TO HOMEPAGE
                   window.location.href = "http://127.0.0.1:5500/frontend/index.html";
                }, 1000);
                } else {
                    alert("❌ Invalid email or password!");
                }
            } catch (error) {
                console.error("⚠️ Error in login request:", error);
            }
        });
    } else {
        console.error("❌ signinForm not found! Check auth.html for correct ID.");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    console.log("🔄 Initializing auth.js...");

    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(event) {
            event.preventDefault();

            fetch("http://127.0.0.1:5000/logout", {  
                method: "POST",
                credentials: "include"
            })
            .then(response => response.json())
            .then(data => {
                console.log("🔍 Logout Response:", data);
                if (data.success) {
                    alert("✅ Logged out successfully! Redirecting to login page...");
                    window.location.replace("auth.html");  
                }
            })
            .catch(error => console.error("⚠️ Logout error:", error));
        });
    } else {
        console.error("❌ Logout button not found! Check index.html for correct ID.");
    }
});
