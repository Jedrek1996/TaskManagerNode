const loginButtonDOM = document.querySelector(".loginButton");

loginButtonDOM.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const response = await axios.get("/api/v1/tasks/login");
    window.location.href = response.data.url;
  } catch (error) {
    console.error("Error initiating OAuth login:", error);
  }
});
