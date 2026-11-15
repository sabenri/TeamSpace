const sidebar = document.querySelector("#sidebar");
const collapseButton = document.querySelector("#collapse-sidebar");
const mainContent = document.querySelector(".main-content");
const pageTitle = document.querySelector("#page-title");
const currentDate = document.querySelector("#current-date");

const navLinks = document.querySelectorAll (".nav-link");
const pageLinks = document.querySelectorAll("[data-page-link]");

const projectModal = document.querySelector("#project-modal");
const emptyNewProjectButton = document.querySelector("#empty-new-project");
const newProjectButton = document.querySelector("#new-project-button");
const closeProjectButton = document.querySelector("#close-project-modal");
const cancelProjectButton = document.querySelector("#cancel-project");
const projectForm = document.querySelector("#project-form");


const toast = document.querySelector("#toast");

let projects = JSON.parse(localStorage.getItem("teamSpaceProjects")) || [];

function displaycurrentDate (){
    const today = new Date ();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    currentDate.textContent = today.toLocaleDateString(
        "en-US",
        options
    );
}

displaycurrentDate();

const savedSidebarState = localStorage.getItem("sidebarCollapsed");

if (savedSidebarState === "true") {
    sidebar.classList.add ("collapsed");
    document.body.classList.add("sidebar-collapsed");
}

collapseButton.addEventListener("click", function() {
    sidebar.classList.toggle("collapsed");
    document.body.classList.toggle("sidebar-collapsed");

    const isCollapsed = sidebar.classList.contains("collapsed");

    localStorage.setItem("sidebarCollapsed", isCollapsed);

});

const pageNames = {
    overview: "Overview",
    tasks: "My Tasks",
    projects: "Projects",
    team: "Team",
    calendar: "Calender",
    activity: "Activity",
    settings : "settings"
};

function updateActivePage(selectedPage) {
    navLinks.forEach (function(link) {
        const linkPage = link.dataset.page; 
        link.classList.toggle (
            "active",
            linkPage === selectedPage
        );
    });

    pageTitle.textContent = 
    pageNames[selectedPage] || "overview";
}

navLinks.forEach (function(link){
    link.addEventListener("click", function (event){
        event.preventDefault();
        const selectedPage = link.dataset.page; 
        updateActivePage(selectedPage);
    });
});

function openProjectModal(){
    projectModal.classList.add("show");
}

function closeProjectModal(){
    projectModal.classList.remove("show");
}

newProjectButton.addEventListener ("click", openProjectModal);
emptyNewProjectButton.addEventListener("click", openProjectModal);
closeProjectButton.addEventListener ("click", closeProjectModal);
cancelProjectButton.addEventListener("click", closeProjectModal);

projectModal.addEventListener ("click", function(event){
    if (event.target ===projectModal) {
        closeProjectModal();
    }
});

document.addEventListener("keydown", function(event){
    if (event.key === "Escape" && projectModal.classList.contains ("show")){
        closeProjectModal();
    }
})

function saveProjects() {
    localStorage.setItem ("teamSpaceProjects", JSON.stringify(projects));
}

projectForm.addEventListener("submit", function(event){
    event.preventDefault();

    const projectName = document.querySelector('#project-name').value.trim();
    const projectDescription = document.querySelector("#project-description").value.trim();
    const startDate = document.querySelector ("#project-start-date").value;
    const dueDate = document.querySelector("#project-due-date").value;
    const status = document.querySelector("#project-status").value;

    if (startDate && dueDate && dueDate < startDate) {
        showToast ("due date cannot be before the start date.");
        return;
    }

    const newProject = {
        id: crypto.randomUUID (),
        name: projectName,
        description: projectDescription,
        startDate: startDate,
        dueDate: dueDate,
        status: status, 
        tasks: [],
        createdAt: new Date().toISOString()
    }

    function createProjectCard(project){
        const card = document.createElement("article");
        card.classList.add("project-card");

        const name = document.createElement("h3");
        name.textContent = project.name;

        const description = document.createElement("p");
        description.textContent = project.description || "No descrioption provided.";

        const status = document.createElement("span");
        status.classList.add("project-status", project.status);

        const statusNames = {
            planning: "planning",
            inProgress: "In progress",
            completed: "Completed",

        };

        status.textContent =statusNames[project.status] || "Planning";

        const dates = document.createElement("p");
        dates.classList.add("project-dates");

        if (project.dueDate) {
            dates.textContent = `Due: ${project.dueDate}`;
        } else {
            dates.textContent = "No due Date";
        }

        card.append(name, description, status, dates);

        return card;
    }

    function renderProjects(){
        const projectsContainer = document.querySelector("#projects-container");

        projectsContainer.innerHTML = "";

        if (projects.length ===0) {
            const emptyState = document.createElement ("div");
            emptyState.classList.add ("empty-state");

            const message = document.createElement("h3");
            message.textContent = "No projects yet";

            const description = document.createElement("p");
            description.textContent = "create your first project."

            const button = document.createElement ("button");
            button.classList.add ("secondary-button");
            button.textContent = "Create a project";
            button.type = "button";

            button.addEventListener ("click", openProjectModal);

            emptyState.append(message, description, button);
            projectsContainer.append(emptyState);

            return;
        }

        projects.forEach(function(project){
            const card = createProjectCard(project);
            projectsContainer.append(card);
        });
    }

    projects.push(newProject);

    saveProjects();
    renderProjects();

    projectForm.reset();
    closeProjectModal();

    showToast("project created successfully");


})

updateActivePage ("overview");

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(function (){
        toast.classList.remove("show");
    }, 3000);
}

