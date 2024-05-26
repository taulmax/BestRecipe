document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/youtube/main");
    const data = await response.json();

    const recipeCards = document.querySelectorAll(
      "#youtube_recipes .recipe-card"
    );

    data.forEach((item, index) => {
      const recipeCard = recipeCards[index];

      const videoId = item.id.videoId;
      const title = item.snippet.title;

      const videoElement = `
                  <iframe width="100%" height="225" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                  <div class="content">
                    <h3>${title}</h3>
                  </div>
              `;
      recipeCard.innerHTML = videoElement;
    });

    // Slider functionality
    const sliderTrack = document.querySelector("#youtube_recipes.slider-track");
    let currentIndex = 0;
    const totalCards = recipeCards.length;
    const visibleCards = 3;

    window.nextSlideYoutube = function () {
      if (currentIndex < totalCards - visibleCards) {
        currentIndex += 3;
        updateSliderPositionYoutube();
      }
    };

    window.prevSlideYoutube = function () {
      if (currentIndex > 0) {
        currentIndex -= 3;
        updateSliderPositionYoutube();
      }
    };

    function updateSliderPositionYoutube() {
      const newPosition = -(currentIndex * (100 / visibleCards));
      sliderTrack.style.transform = `translateX(${newPosition}%)`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
