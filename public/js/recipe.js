if (location.pathname === "/") {
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/recipes/main?${userId ? `userId=${userId}` : ""}`
      );
      const data = await response.json();
      const recipeCards = document.querySelectorAll("#recipes .recipe-card");
      data.forEach((item, index) => {
        const card = recipeCards[index];
        card.onclick = () => {
          location.href = `/recipe/${item.id}`;
        };
        card.innerHTML = `
          <div class="food_image_wrapper">
            <img src="${item.image}" alt="${item.food}">
            <i data-id="${item.id}" class="${
          item.isScrapped ? "fas" : "far"
        } fa-bookmark scrap_icon" onclick="${
          item.isScrapped ? "onClickDeleteScrap" : "onClickScrap"
        }(this)"></i>
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
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (location.pathname === "/cyberRecipe") {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `/api/recipes?${userId ? `userId=${userId}` : ""}`
      );
      const data = await response.json();
      const recipes = document.getElementById("recipes");
      data.forEach((item, index) => {
        const card = document.createElement("div");
        card.classList.add("recipe-card");
        card.onclick = () => {
          location.href = `/recipe/${item.id}`;
        };
        card.innerHTML = `
          <div class="food_image_wrapper">
            <img src="${item.image}" alt="${item.food}">
            <i data-id="${item.id}" class="${
          item.isScrapped ? "fas" : "far"
        } fa-bookmark scrap_icon" onclick="${
          item.isScrapped ? "onClickDeleteScrap" : "onClickScrap"
        }(this)"></i>
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
  }
});

function addFocusClass(element) {
  element.classList.add("focused");
  element.classList.remove("error");
}

function removeFocusClass(element) {
  element.classList.remove("focused");
  element.classList.remove("error");
}

function attachImage() {
  document.getElementById("image").click();
}

function onClickAddRecipeButton() {
  const recipeFormGroup = document.getElementById("recipe_form-group");
  const recipeInputWrappers = document.querySelectorAll(
    ".recipe_input_wrapper"
  );
  const nextRecipeInputWrappers = document.createElement("div");

  nextRecipeInputWrappers.classList.add("recipe_input_wrapper");
  nextRecipeInputWrappers.innerHTML = `
    <input type="text" onfocus="addFocusClass(this)" onblur="removeFocusClass(this)"
      class="recipe_input" placeholder="레시피의 ${
        recipeInputWrappers.length + 1
      }번 순서를 입력해 주세요" />
    <div class="add_button" onclick="onClickAddRecipeButton();">+</div>`;

  recipeInputWrappers.forEach((recipeInputWrapper) => {
    const addButton = recipeInputWrapper.querySelector(".add_button");
    if (addButton) {
      recipeInputWrapper.removeChild(addButton);
    }
  });

  recipeFormGroup.appendChild(nextRecipeInputWrappers);
}

function onClickAddIngredientsButton() {
  const ingredientsFormGroup = document.getElementById(
    "ingredients_form-group"
  );
  const ingredientsInputWrappers = document.querySelectorAll(
    ".ingredients_input_wrapper"
  );
  const nextIngredientsInputWrappers = document.createElement("div");

  nextIngredientsInputWrappers.classList.add("ingredients_input_wrapper");
  nextIngredientsInputWrappers.innerHTML = `
    <input type="text" onfocus="addFocusClass(this)" onblur="removeFocusClass(this)"
      class="ingredients_input" placeholder="${
        ingredientsInputWrappers.length + 1
      }번 재료를 입력해 주세요" />
    <div class="add_button" onclick="onClickAddIngredientsButton();">+</div>`;

  ingredientsInputWrappers.forEach((recipeInputWrapper) => {
    const addButton = recipeInputWrapper.querySelector(".add_button");
    if (addButton) {
      recipeInputWrapper.removeChild(addButton);
    }
  });

  ingredientsFormGroup.appendChild(nextIngredientsInputWrappers);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

if (location.pathname === "/writeRecipe") {
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelector("form")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData();

        const food = document.getElementById("food");
        const subTitle = document.getElementById("sub_title");

        const recipeInputs = document.querySelectorAll(".recipe_input");
        const recipeInputsValueArray = Array.from(recipeInputs).map(
          (input) => input.value
        );

        const image = document.getElementById("image").files[0];

        const ingredientsInputs =
          document.querySelectorAll(".ingredients_input");
        const ingredientsInputsValueArray = Array.from(ingredientsInputs).map(
          (input) => input.value
        );

        if (!food.value) {
          toast.failure("요리 이름을 작성해주세요!");
          food.classList.add("error");
          return;
        }

        if (!subTitle.value) {
          toast.failure("부제를 작성해주세요!");
          subTitle.classList.add("error");
          return;
        }

        if (!recipeInputsValueArray[0]) {
          toast.failure("레시피를 작성해주세요!");
          recipeInputs.forEach((recipeInput) =>
            recipeInput.classList.add("error")
          );
          return;
        }

        if (!image) {
          toast.failure("이미지를 첨부해주세요!");
          return;
        }

        if (!ingredientsInputsValueArray[0]) {
          toast.failure("재료를 추가해주세요!");
          ingredientsInputs.forEach((ingredientsInput) =>
            ingredientsInput.classList.add("error")
          );
          return;
        }

        formData.append("food", food.value);
        formData.append("subTitle", subTitle.value);
        formData.append("recipe", recipeInputsValueArray);
        formData.append("image", image);
        formData.append("ingredients", ingredientsInputsValueArray);

        formData.append("userId", localStorage.getItem("userId"));
        formData.append("author", localStorage.getItem("nickname"));
        formData.append("date", formatDate(new Date()));

        try {
          const response = await fetch("/api/recipes", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            console.log("New recipe added:", result);
            localStorage.setItem("postRecipe", 1);
            location.href = "/cyberRecipe";
          } else {
            console.error("Failed to add recipe");
          }
        } catch (error) {
          console.error("Error:", error);
          toast.failure("레시피 생성에 실패했습니다 :(");
        }
      });
  });
}

function parseIngredients(ingredientsString) {
  const ingredientsArray = ingredientsString.split(",");
  const parsedIngredients = ingredientsArray.map((ingredient) =>
    ingredient.trim()
  );
  return parsedIngredients;
}

function parseRecipes(recipesString) {
  const recipesArray = recipesString.split(",");
  const parsedRecipes = recipesArray.map((recipe) => recipe.trim());
  return parsedRecipes;
}

// 레시피 상세페이지
if (location.pathname.startsWith("/recipe/")) {
  document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    const recipeId = location.pathname.split("/")[2];
    const response = await fetch(
      `/api/recipes/${recipeId}?${userId ? `userId=${userId}` : ""}`
    );
    const data = await response.json();
    console.log(data);

    // 작성자가 쓴 글이면 수정 삭제 HTML 추가
    if (parseInt(userId) === parseInt(data.userId)) {
      const foodWrapper = document.querySelector(".food_wrapper");
      const udButtonWrapper = document.createElement("div");
      const updateButton = document.createElement("span");
      const deleteButton = document.createElement("span");

      udButtonWrapper.classList.add("ud_button_wrapper");
      updateButton.classList.add("update");
      deleteButton.classList.add("delete");

      updateButton.textContent = "수정";
      deleteButton.textContent = "삭제";

      updateButton.onclick = () => {
        location.href = "/updateRecipe";
      };
      deleteButton.onclick = () => {
        const recipeId = data.id;

        fetch(`/api/recipes/${recipeId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (response.ok) {
              localStorage.setItem("deleteRecipe", 1);

              const previousURL = localStorage.getItem("previousURL");
              if (previousURL) {
                location.href = previousURL;
              } else {
                location.href = "/";
              }
            } else {
              console.error("Failed to delete the recipe");
              toast.failure("레시피 삭제에 실패했습니다 :(");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };

      udButtonWrapper.appendChild(updateButton);
      udButtonWrapper.appendChild(deleteButton);

      foodWrapper.appendChild(udButtonWrapper);
    }

    // 플로팅 스크랩
    const floatingScrap = document.getElementById("floating_scrap");
    floatingScrap.dataset.id = data.id;
    floatingScrap.onclick = () => onClickScrap(floatingScrap, true);
    if (data.isScrapped) {
      floatingScrap.classList.add("scrapped");
      floatingScrap.onclick = () => onClickDeleteScrap(floatingScrap, true);
    }

    const food = document.getElementById("food");
    const date = document.getElementById("date");
    const author = document.getElementById("author");
    const subTitle = document.getElementById("sub_title");
    const recipeImg = document.getElementById("recipe_img");
    const ingredientsList = document.getElementById("ingredients_list");
    const recipeDescription = document.getElementById("recipe_description");

    food.textContent = data.food;
    date.textContent = data.date;
    author.textContent = `작성자: ${data.author}`;
    subTitle.textContent = data.subTitle;
    recipeImg.src = `${data.image}`;
    recipeImg.alt = data.food;

    parseIngredients(data.ingredients).forEach((ingredient) => {
      const li = document.createElement("li");
      li.textContent = ingredient;
      ingredientsList.appendChild(li);
    });

    parseRecipes(data.recipe).forEach((recipe, index) => {
      const span = document.createElement("span");
      span.textContent = `${index + 1}. ${recipe}`;
      recipeDescription.appendChild(span);
    });
  });
}
