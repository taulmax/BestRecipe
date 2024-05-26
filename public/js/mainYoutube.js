// .env 파일에서 youtube api key 숨겨져 가져오기
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/api/keys?type=youtube");
    const data = await response.json();
    const API_KEY = data.apiKey;

    const SEARCH_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=18&q=집밥레시피&key=${API_KEY}`;
    fetch(SEARCH_URL)
      .then((response) => response.json())
      .then((data) => {
        const filteredItems = data.items
          .filter((item) => item.id.videoId)
          .slice(0, 9);

        const recipeCards = document.querySelectorAll(
          "#youtube_recipes .recipe-card"
        );

        filteredItems.forEach((item, index) => {
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
        const sliderTrack = document.querySelector(
          "#youtube_recipes.slider-track"
        );
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
      })
      .catch((error) => console.error("에러 발생:", error));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
