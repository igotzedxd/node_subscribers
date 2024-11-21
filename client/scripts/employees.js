const index = async () => {
  const empOutput = document.querySelector("#emps");

  const getEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const result = await response.json();
      console.log("res:", result);

      return result;
    } catch (error) {
      console.error("Error fetching employees:", error);
      return null; // Return null if there is an error
    }
  };

  const employees = await getEmployees();

  if (employees && employees.data && employees.data.length > 0) {
    empOutput.innerHTML = employees.data
      .map(
        (emp) => `
        <div>
          <h3>${emp.name}</h3>
          <p>${emp.email}</p>
          <img src="/employees/${emp.picture}" alt="${emp.name}" />
        </div>`
      )
      .join("");
  } else {
    empOutput.style.color = "blue";
    empOutput.innerHTML = "No employees found.";
  }
};

index();
