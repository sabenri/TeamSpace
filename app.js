const sidebar = document.querySelector("#sidebar");
const collapseButton = document.querySelector("#collapse-sidebar");
const mainContent = document.querySelector(".main-content");
const pageTitle = document.querySelector("#page-title");
const currentDate = document.querySelector("#current-date");

const navLinks = document.querySelectorAll (".nav-link");
const pageLinks = document.querySelectorAll("[data-page-link]");

const toast = document.querySelector("#toast");

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
    task: "My Tasks",
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
    link.addEventListener("click", function (){
        const selectedPage = link.dataset.page; 
        updateActivePage(selectedPage);
    });
});

updateActivePage ("overview");

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(function (){
        toast.classList.remove("show");
    }, 3000);
}

