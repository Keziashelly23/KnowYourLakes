window.onload = function () {
  google.accounts.id.initialize({
    client_id: "509638925342-g3ffivlgu45uccigoeei7iedgr6f8lhc.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });

  document.getElementById("googleLogin").addEventListener("click", () => {
    google.accounts.id.prompt(); // opens Google login popup
  });
};

function handleCredentialResponse(response) {
  const jwt = response.credential;

  console.log("Google JWT:", jwt);

  // Send this token to your backend
  fetch("http://localhost:5000/auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token: jwt })
  })
    .then(res => res.json())
    .then(data => {
      console.log("User logged in:", data);
      // redirect or store user info
      window.location.href = "rip-current.html";
    })
    .catch(err => console.error(err));
}