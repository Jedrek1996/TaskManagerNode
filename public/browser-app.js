const tasksDOM = document.querySelector(".tasks");
const loadingDOM = document.querySelector(".loading-text");
const formDOM = document.querySelector(".task-form");
const taskInputDOM = document.querySelector(".task-input");
const formAlertDOM = document.querySelector(".form-alert");

function getTokenCookie() {
  const name = "token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

const storedToken = getTokenCookie("token");
console.log("Stored Token: " + storedToken);

const showTasks = async () => {
  loadingDOM.style.visibility = "visible";
  try {
    const response = await axios.get("/api/v1/tasks/main", {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    });
    const {
      data: { data: tasks },
    } = response;
    console.log("Tasks received: ", tasks);

    if (tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
      loadingDOM.style.visibility = "hidden";
      return;
    }

    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task;
        return `<div class="single-task ${completed && "task-completed"}">
          <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
          <div class="task-links">
            <a href="task.html?id=${taskID}" class="edit-link">
              <i class="fas fa-edit"></i>
            </a>
            <button type="button" class="delete-btn" data-id="${taskID}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
      })
      .join("");

    tasksDOM.innerHTML = allTasks;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    tasksDOM.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = "hidden";
};

showTasks();

// delete task /api/tasks/:id

tasksDOM.addEventListener("click", async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains("delete-btn")) {
    loadingDOM.style.visibility = "visible";
    const id = el.parentElement.dataset.id;
    console.log("Deleteing task iD" + id);
    try {
      await axios.delete(`/api/v1/tasks/main/${id}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      showTasks();
    } catch (error) {
      console.log(error);
    }
  }
  loadingDOM.style.visibility = "hidden";
});

// form

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;

  try {
    await axios.post(
      "/api/v1/tasks/main",
      { name },
      {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      }
    );
    showTasks();
    taskInputDOM.value = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.textContent = `success, task added`;
    formAlertDOM.classList.add("text-success");
  } catch (error) {
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `error, please try again`;
  }
  setTimeout(() => {
    formAlertDOM.style.display = "none";
    formAlertDOM.classList.remove("text-success");
  }, 3000);
});
