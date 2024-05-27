if (location.pathname === "/scrap") {
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
  });
}

async function onClickScrap(iconElement) {
  const userId = parseInt(localStorage.getItem("userId"));
  const recipeId = parseInt(iconElement.dataset.id);

  if (!userId) {
    isLogin();
    return;
  }

  try {
    const response = await fetch("/api/scrap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, recipeId }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("스크랩 추가 성공:", result);

      // 아이콘을 채워진 북마크로 변경
      iconElement.classList.remove("far");
      iconElement.classList.add("fas");

      // 클릭 이벤트 변경
      iconElement.onclick = () => onClickDeleteScrap(iconElement);
    } else {
      const error = await response.json();
      console.error("스크랩 추가 실패:", error);
    }
  } catch (error) {
    console.error("스크랩 추가 중 오류 발생:", error);
  }
}

async function onClickDeleteScrap(iconElement) {
  const userId = parseInt(localStorage.getItem("userId"));
  const recipeId = parseInt(iconElement.dataset.id);

  if (!userId) {
    isLogin();
    return;
  }

  try {
    const response = await fetch("/api/scrap", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, recipeId }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("스크랩 삭제 성공:", result);

      // 아이콘을 빈 북마크로 변경
      iconElement.classList.remove("fas");
      iconElement.classList.add("far");

      // 클릭 이벤트 변경
      iconElement.onclick = () => onClickScrap(iconElement);
    } else {
      const error = await response.json();
      console.error("스크랩 삭제 실패:", error);
    }
  } catch (error) {
    console.error("스크랩 삭제 중 오류 발생:", error);
  }
}
