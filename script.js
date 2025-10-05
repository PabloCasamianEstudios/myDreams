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
    viewDreamList();
  });

  gridView.addEventListener("click", () => {
    gridView.classList.add("active");
    listView.classList.remove("active");
    grid.classList.add("active");
    list.classList.remove("active");
    viewDreamGrid();
  });

  // functions
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

  function viewDreamList() {
    list.innerHTML = "";
    dreams.forEach((dream, index) => {
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
          </div>
        </div>
        `;

      list.appendChild(dreamItem);
    });
  }

  function viewDreamGrid() {
    grid.innerHTML = "";
    dreams.forEach((dream, index) => {
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
        </div>
        `;
      grid.appendChild(dreamItem);
    });
  }

  // start
  dreams = await fetchDreams();
  console.log(dreams);
  viewDreamList();
};
