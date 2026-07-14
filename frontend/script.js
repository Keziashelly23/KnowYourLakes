window.onload = function () {
  google.accounts.id.initialize({
    client_id: "509638925342-g3ffivlgu45uccigoeei7iedgr6f8lhc.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });

  document.getElementById("googleLogin").addEventListener("click", () => {
    google.accounts.id.prompt(); // opens Google login popup
  });
};

async function handleCredentialResponse(response) {
  const jwt = response?.credential;

  if (!jwt) {
    alert("Google did not return a login credential. Please try again.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ token: jwt })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Google login was rejected.");
    }

    console.log("User logged in:", data);
    window.location.assign("dashboard.html");
  } catch (error) {
    console.error("Login failed:", error);
    alert(`Login failed: ${error.message}`);
  }
}
