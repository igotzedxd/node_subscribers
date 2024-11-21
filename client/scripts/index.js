const index = () => {
  document.getElementById("empForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const empMsg = document.getElementById("empMsg");

    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        empMsg.style.color = "red";
        empMsg.innerHTML = result.message;
        return;
      }

      empMsg.style.color = "green";
      empMsg.innerHTML = result.message;
    } catch (error) {
      empMsg.style.color = "red";
      empMsg.innerHTML = error.message;
    }
  });
};

index();
