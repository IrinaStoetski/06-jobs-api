import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showJobs } from "./jobs.js";

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingJob = null;
let table = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-job");
  company = document.getElementById("company");
  position = document.getElementById("position");
  status = document.getElementById("status");
  addingJob = document.getElementById("adding-job");
  table = document.getElementById("jobs-table");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingJob) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/jobs";

        if (addingJob.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/jobs/${addEditDiv.dataset.id}`;
        }

        console.log(e.target);

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              company: company.value,
              position: position.value,
              status: status.value,
            }),
          });

          const data = await response.json();
          if (response.status === 201) {
            // 201 indicates a successful create
            message.textContent = "The job entry was created.";

            company.value = "";
            position.value = "";
            status.value = "pending";

            showJobs();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showJobs();
      }
    }
  });

  table.addEventListener("click", async (e) => {
    if (e.target.nodeName === "BUTTON") {
      if (e.target.classList.contains("deleteButton")) {
        await deleteJob(e.target.dataset.id);
      }
    }
  });
};

export const showAddEdit = async (jobId) => {
  if (!jobId) {
    company.value = "";
    position.value = "";
    status.value = "pending";
    addingJob.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        company.value = data.job.company;
        position.value = data.job.position;
        status.value = data.job.status;
        addingJob.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = jobId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The jobs entry was not found";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showJobs();
    }

    enableInput(true);
  }
};

export const deleteJob = async (id) => {
  try {
    await fetch(`/api/v1/jobs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    showJobs();
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
};
