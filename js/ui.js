import { GamesData } from "./games.js";
import { GetGameDetails } from "./details.js";
const links = document.querySelectorAll(".nav-link");
const gamesContainer = document.querySelector(".row.gy-4");
const allGames = document.querySelector(".allGames");
const gameDetailsSection = document.querySelector(".gameDetails");
const loaderContainer = document.querySelector(".loader-container");

const gamesData = new GamesData();
const gameDetails = new GetGameDetails();

document.querySelector(".retry-btn")?.addEventListener("click", () => {
  location.reload();
});

links.forEach((link) => {
  link.addEventListener("click", async function (e) {
    e.preventDefault(); // Used for performance optimization by preventing page reload (no impact on functionality if removed)
    const category = this.textContent.toLowerCase();
    try {
      showLoader();
      const games = await gamesData.displayGames(category);
      hideLoader();
      displayGamesInUI(games);
      links.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");
      const navbarCollapse = document.querySelector(".navbar-collapse");
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false,
      });
      bsCollapse.hide();
    } catch (error) {
      console.log("Error:", error);
      hideLoader();
      showError();
    }
  });
});
function displayGamesInUI(games) {
  if (!games || games.length === 0) {
    showNoGamesMessage()
    return;
  }

  let box = "";
  games.forEach((game) => {
    box += `
      <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 animate__animated animate__zoomIn ">
       <div class="card bg-transparent w-100 " data-id="${game.id}">
          <div class="card-body p-3">
            <img src="${game.thumbnail}" class="card-img-top mb-3" alt="${game.title }">
            <div class="card-caption text-white">
              <div class="d-flex justify-content-between align-items-center"> 
                <h3 class="card-title h6">${game.title}</h3>
                <span class="badge fw-semibold">free</span>
              </div>
              <p class="card-text text-center fw-semibold ">${game.short_description
                .split(" ")
                .slice(0, 8)
                .join(",")}
              </p>
            </div>
          </div>
          <div class="card-footer text-white d-flex justify-content-between">
            <small class="footer-badge rounded ">${
              game.genre
            }</small>
            <small class="footer-badge rounded">${
              game.platform
            }</small>
          </div>
        </div>
      </div>
    `;
  });

  gamesContainer.innerHTML = box;
}
document.addEventListener("DOMContentLoaded", async () => {
  try {
    showLoader();
    const defaultGames = await gamesData.displayGames("mmorpg");
    hideLoader();
    displayGamesInUI(defaultGames);
    links[0].classList.add("active");
  } catch (error) {
    hideLoader();
    showError();
    console.error("Initial load error:", error);
  }
});

/****************************************************Details section logic*****************************************************************/

gamesContainer.addEventListener("click", async function (e) {
  const card = e.target.closest(".card");
  if (!card) return;

  const gameId = card.dataset.id;
  try {
    showLoader();
    const details = await gameDetails.displayDetails(gameId);
    displayGameDetailsUI(details);
    hideLoader();
    showGameDetailsSection();
  } catch (error) {
    console.error("Error:", error);
    hideLoader();
    showError();
  }
});

function displayGameDetailsUI(details) {
  gameDetailsSection.innerHTML = `
      <div class="container">
        <div class="header d-flex justify-content-between align-items-center text-white pt-4">
          <h1 class="h3">Details Game</h1>
          <button class="btn-close btn-close-white" id="btnClose"></button>
        </div>
        <div class="row mt-4" id="gameDetails">
          <div class="col-md-4">
            <picture>
              <img src="${details.thumbnail}" alt="" class="w-100">
            </picture>
          </div>
          <div class="col-md-8 text-white">
            <h3>Title: ${details.title}</h3>
            <p class="fw-semibold">Category: <span class="bg-info rounded text-black">${details.genre}</span></p>
            <p class="fw-semibold">Platform: <span class="bg-info rounded text-black">${details.platform}</span></p>
            <p class="fw-semibold">Status: <span class="bg-info rounded text-black">${details.status}</span></p>
            <p>${details.description}</p>
            <a class="btn btn-outline-warning mb-sm-3" target="_blank" href="${details.game_url}">Show Game</a>
          </div>
        </div>
      </div>
    `;
  document.querySelector("#btnClose")?.addEventListener("click", showGamesSection);
}

function showGamesSection() {
  allGames.classList.remove("d-none");
  gameDetailsSection.classList.add("d-none");
}

function showGameDetailsSection() {
  allGames.classList.add("d-none");
  gameDetailsSection.classList.remove("d-none");
}

function showError() {
  gamesContainer.innerHTML = `
      <div class="col-12 text-center my-5">
        <div class="error-message bg-dark p-4 rounded">
          <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h3 class="text-white">Error Loading Games</h3>
          <p class="text-muted">We couldn't load the game data. Please try again later.</p>
          <button class="btn btn-primary mt-3 retry-btn">Retry</button>
        </div>
      </div>
    `;

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("retry-btn")) {
      location.reload();
    }
  });
}
function showNoGamesMessage() {
  gamesContainer.innerHTML = `
    <div class="col-12 text-center my-5">
      <div class="error-message bg-dark p-4 rounded">
        <i class="fas fa-gamepad fa-3x text-secondary mb-3"></i>
        <h3 class="text-white">No Games Available</h3>
        <p class="text-muted">There are currently no games in the list. Please try again later.</p>
      </div>
    </div>
  `;
}

function showLoader() {
  loaderContainer.classList.remove("d-none");
}
function hideLoader() {
  loaderContainer.classList.add("d-none");
}
