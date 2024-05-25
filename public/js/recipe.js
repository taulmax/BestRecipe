document.addEventListener("DOMContentLoaded", async () => {
  if (location.pathname === "/") {
    try {
      const response = await fetch("/mainRecipes");
      const data = await response.json();
      const recipeCards = document.querySelectorAll("#recipes .recipe-card");
      data.forEach((item, index) => {
        const card = recipeCards[index];
        card.innerHTML = `
          <div class="food_image_wrapper">
            <img src="${item.image}" alt="${item.food}">
          </div>
          <div class="content">
            <h3>${item.food}</h3>
            <p>${item.subTitle}</p>
          </div>
        `;
      });

      // Slider functionality
      const sliderTrack = document.querySelector("#recipes.slider-track");
      let currentIndex = 0;
      const totalCards = recipeCards.length;
      const visibleCards = 3;

      window.nextSlide = function () {
        if (currentIndex < totalCards - visibleCards) {
          currentIndex += 3;
          updateSliderPosition();
        }
      };

      window.prevSlide = function () {
        if (currentIndex > 0) {
          currentIndex -= 3;
          updateSliderPosition();
        }
      };

      function updateSliderPosition() {
        const newPosition = -(currentIndex * (100 / visibleCards));
        sliderTrack.style.transform = `translateX(${newPosition}%)`;
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  if (location.pathname === "/cyberRecipe.html") {
    try {
      const response = await fetch("/recipes");
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
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }
});

function addFocusClass(id) {
  document.getElementById(id).classList.add("focused");
}

function removeFocusClass(id) {
  document.getElementById(id).classList.remove("focused");
}

function attachImage() {
  document.getElementById("image").click();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("food", document.getElementById("food").value);
    formData.append("subTitle", document.getElementById("sub_title").value);
    formData.append("recipe", document.getElementById("recipe").value);
    formData.append("image", document.getElementById("image").files[0]);
    formData.append("ingredient", document.getElementById("ingredient").value);

    try {
      const response = await fetch("/recipes", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("New recipe added:", result);
        location.href = "/cyberRecipe.html";
        toast.success("성공적으로 레시피를 생성했습니다!");
        // 여기 토스트 뜨게 해줘야함
      } else {
        console.error("Failed to add recipe");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.failure("레시피 생성에 실패했습니다 :(");
    }
  });
});
