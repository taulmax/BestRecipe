document.addEventListener("DOMContentLoaded", async () => {
  try {
    const userId = localStorage.getItem("userId");
    const response = await fetch(`/api/scrap/${userId}`);
    const data = await response.json();
    const recipes = document.getElementById("recipes");
    data.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");
      card.innerHTML = `
            <div class="food_image_wrapper">
              <img src="${item.image}" alt="${item.food}">
            </div>
            <div class="content">
              <h3>${item.food}</h3>
              <p>${item.subTitle}</p>
            </div>
          `;
      recipes.appendChild(card);
    });

    // dummy data 만들어서 grid 채워넣는 로직
    const dummyLength = 3 - (data.length % 3);
    for (let i = 0; i < dummyLength; i++) {
      const card = document.createElement("div");
      card.classList.add("recipe-card");
      card.classList.add("dummy");
      recipes.appendChild(card);
    }
  } catch (error) {
    console.error("Error fetching config:", error);
  }
});
