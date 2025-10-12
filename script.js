window.onload = async function () {
  // declare
  const list = document.getElementById("dreamsList");
  const grid = document.getElementById("dreamsGrid");
  let listView = document.getElementById("listView");
  let gridView = document.getElementById("gridView");
  let dreams = [];

  // events
  listView.addEventListener("click", () => {
    listView.classList.add("active");
    gridView.classList.remove("active");
    list.classList.add("active");
    grid.classList.remove("active");
    viewDreamList(dreams);
  });

  gridView.addEventListener("click", () => {
    gridView.classList.add("active");
    listView.classList.remove("active");
    grid.classList.add("active");
    list.classList.remove("active");
    viewDreamGrid(dreams);
  });

  // functions

  function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        const category = this.dataset.category;
        filterDreams(category);
      });
    });
  }

  function filterDreams(category) {
    const filteredDreams =
      category === "all"
        ? dreams
        : dreams.filter((dream) => dream.category === category);

    if (list.classList.contains("active")) {
      viewDreamList(filteredDreams);
    } else {
      viewDreamGrid(filteredDreams);
    }
  }

  async function fetchDreams() {
    try {
      const response = await fetch("dreams.json");
      const data = await response.json();
      const dreams = data.dreams;
      return dreams;
    } catch (error) {
      console.error("Error fetching dreams:", error);
      return [];
    }
  }

  function viewDreamList(dreamsToShow) {
    list.innerHTML = "";
    dreamsToShow.forEach((dream, index) => {
      const dreamItem = document.createElement("div");
      dreamItem.className = "dream-item-list";
      dreamItem.innerHTML = `
             <div class="dream-number">${index + 1}</div>
        <div class="dream-icon-list">
          <i class="fas ${dream.icon}"></i>
        </div>
        <div class="dream-content-list">
          <h3 class="dream-title-list">${dream.title}</h3>
          <p class="dream-description-list">${dream.description}</p>
          <div class="dream-meta-list">
            <span><i class="fas fa-tag"></i> ${dream.category}</span>
            <span><i class="fas fa-flag"></i> ${dream.priority}</span>
          ${
            dream.details?.progress
              ? `<span><i class="fas fa-chart-line"></i> ${dream.details.progress}%</span>`
              : ""
          }
                </div>
            </div>
        `;

      dreamItem.addEventListener("click", () => openDreamModal(dream));
      list.appendChild(dreamItem);
    });
  }

  function viewDreamGrid(dreamsToShow) {
    grid.innerHTML = "";
    dreamsToShow.forEach((dream, index) => {
      const dreamItem = document.createElement("div");
      dreamItem.className = "dream-item-grid";
      dreamItem.innerHTML = `
        <div class="dream-number-grid">${index + 1}</div>
        <div class="dream-category">${dream.category}</div>
        <div class="dream-icon-grid">
            <i class="fas ${dream.icon}"></i>
            </div>
            <h3 class="dream-title-grid">${dream.title}</h3>
            <p class="dream-description-grid">${dream.description}</p>
            <div class="dream-meta-grid">
                <span><i class="fas fa-flag"></i> ${dream.priority}</span>
                ${
                  dream.details?.progress
                    ? `<span><i class="fas fa-chart-line"></i> ${dream.details.progress}%</span>`
                    : ""
                }
            </div>
        `;
      dreamItem.addEventListener("click", () => openDreamModal(dream));
      grid.appendChild(dreamItem);
    });
  }

  function setupSearch() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const filteredDreams = dreams.filter(
        (dream) =>
          dream.title.toLowerCase().includes(searchTerm) ||
          dream.description.toLowerCase().includes(searchTerm) ||
          dream.category.toLowerCase().includes(searchTerm)
      );

      updateDreamsView(filteredDreams);
      updateDreamsCount(filteredDreams.length);
    });
  }

  function updateDreamsView(dreamsToShow) {
    if (list.classList.contains("active")) {
      viewDreamList(dreamsToShow);
    } else {
      viewDreamGrid(dreamsToShow);
    }
  }

  // contador de sueños
  function updateDreamsCount(count) {
    document.getElementById("dreamsCount").textContent = count;
  }

  // Modal de detalles
  function setupModal() {
    const modal = document.getElementById("dreamModal");
    const closeBtn = document.querySelector(".close-modal");

    closeBtn.onclick = () => {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    };

    window.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    };

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    });
  }

  // Función para abrir modal
  function openDreamModal(dream) {
    const modal = document.getElementById("dreamModal");
    const modalContent = document.getElementById("modalContent");

    modalContent.innerHTML = generateModalContent(dream);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      const progressFill = document.querySelector(".progress-fill");
      if (progressFill) {
        const progress = dream.details?.progress || 0;
        progressFill.style.width = progress + "%";
      }
    }, 100);
  }

  function generateModalContent(dream) {
    const details = dream.details || {};

    return `
        <div class="modal-header">
            <div class="modal-icon">
                <i class="fas ${dream.icon}"></i>
            </div>
            <h1 class="modal-title">${dream.title}</h1>
            <p class="modal-description">${dream.description}</p>
            <div class="modal-meta">
                <span class="meta-badge">${dream.category}</span>
                <span class="meta-badge">Prioridad ${dream.priority}</span>
                <span class="meta-badge">${dream.status || "planeado"}</span>
            </div>
        </div>
        
        <div class="modal-body">
            ${
              details.progress !== undefined
                ? `
            <div class="progress-section">
                <div class="progress-info">
                    <span>Progreso</span>
                    <span>${details.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
            `
                : ""
            }
            
            ${
              details.why
                ? `
            <div class="modal-section">
                <h3 class="section-title"><i class="fas fa-heart"></i> ¿Por qué?</h3>
                <p>${details.why}</p>
            </div>
            `
                : ""
            }
            
            ${
              details.steps
                ? `
            <div class="modal-section">
                <h3 class="section-title"><i class="fas fa-list-check"></i> Pasos</h3>
                <ul class="steps-list">
                    ${details.steps
                      .map(
                        (step) => `
                        <li class="step-item">${step}</li>
                    `
                      )
                      .join("")}
                </ul>
            </div>
            `
                : ""
            }
            
            ${
              details.resources
                ? `
            <div class="modal-section">
                <h3 class="section-title"><i class="fas fa-link"></i> Recursos</h3>
                <div class="resources-grid">
                    ${details.resources
                      .map(
                        (resource) => `
                        <a href="${resource.url}" target="_blank" class="resource-item">
                            <i class="fas fa-external-link-alt"></i>
                            <span>${resource.name}</span>
                        </a>
                    `
                      )
                      .join("")}
                </div>
            </div>
            `
                : ""
            }
            
            ${
              details.difficulty || details.motivation
                ? `
            <div class="modal-section">
                <h3 class="section-title"><i class="fas fa-chart-bar"></i> Métricas</h3>
                <div class="ratings-grid">
                    ${
                      details.difficulty
                        ? `
                    <div class="rating-item">
                        <div class="rating-label">Dificultad</div>
                        <div class="rating-stars">${getDifficultyStars(
                          details.difficulty
                        )}</div>
                    </div>
                    `
                        : ""
                    }
                    
                    ${
                      details.motivation
                        ? `
                    <div class="rating-item">
                        <div class="rating-label">Motivación</div>
                        <div class="rating-stars">${getMotivationStars(
                          details.motivation
                        )}</div>
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>
            `
                : ""
            }
            
            ${
              details.notes
                ? `
            <div class="modal-section">
                <h3 class="section-title"><i class="fas fa-sticky-note"></i> Notas</h3>
                <div class="notes-content">${details.notes}</div>
            </div>
            `
                : ""
            }
            
            ${
              details.startDate || details.targetDate || details.timeEstimate
                ? `
           
            </div>
            `
                : ""
            }
        </div>
    `;
  }

  function getDifficultyStars(difficulty) {
    const levels = {
      low: "⭐",
      medium: "⭐⭐",
      high: "⭐⭐⭐",
      "very-high": "⭐⭐⭐⭐",
    };
    return levels[difficulty] || "⭐";
  }

  function getMotivationStars(motivation) {
    if (typeof motivation === "number") {
      return "⭐".repeat(motivation);
    }
    return "⭐".repeat(5);
  }

  // start
  dreams = await fetchDreams();
  viewDreamList(dreams);
  listView.classList.add("active");
  setupFilters();

  setupSearch();
  setupModal();
  updateDreamsCount(dreams.length);
};
