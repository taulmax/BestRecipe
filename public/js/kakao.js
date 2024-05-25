// .env 파일에서 kakao api key 숨겨져 가져오기
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/kakao");
    const data = await response.json();
    const API_KEY = data.apiKey;
    window.Kakao.init(API_KEY);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// 카카오 로그인
function kakaoLogin() {
  window.Kakao.Auth.login({
    scope: "profile_nickname, account_email",
    success: function (authObj) {
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (res) => {
          const userId = res.id;
          const nickname = res.properties.nickname;
          localStorage.setItem("userId", userId);
          localStorage.setItem("nickname", nickname);
          document.querySelector(".login").style.display = "none";
          document.querySelector(".logout_wrapper").style.display = "block";
          document.querySelector(
            ".welcome"
          ).textContent = `${nickname}님 안녕하세요😆`;
          toast.success("성공적으로 로그인 되었습니다!");
          if (document.getElementById("isLogin_dialog")) {
            document.getElementById("isLogin_dialog").close();
          }
        },
      });
    },
  });
}

// 로그아웃
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("nickname");
  // 쿠키 전체 삭제 로직 추가해야함
  document.querySelector(".login").style.display = "block";
  document.querySelector(".logout_wrapper").style.display = "none";
  document.querySelector(".welcome").textContent = "";
  toast.success("성공적으로 로그아웃 되었습니다!");
}
