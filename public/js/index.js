document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const nickname = localStorage.getItem("nickname");
  if (userId && nickname) {
    document.querySelector(".login").style.display = "none";
    document.querySelector(".logout_wrapper").style.display = "block";
    document.querySelector(
      ".welcome"
    ).textContent = `${nickname}님 안녕하세요😆`;
  }
});

function toast(type, options) {
  const defaultOptions = {
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "bottom",
    position: "right",
    style: {
      background:
        type === "success"
          ? "linear-gradient(to right, #00b09b, #96c93d)"
          : "linear-gradient(to right, #ff6b6b, #ff9999)",
    },
    onClick: function () {},
  };

  const mergedOptions = Object.assign({}, defaultOptions, options);
  Toastify({ ...mergedOptions }).showToast();
}

toast.success = function (text) {
  toast("success", { text });
};

toast.failure = function (text) {
  toast("error", { text });
};

function isLogin(link) {
  if (localStorage.getItem("userId")) {
    if (link) {
      location.href = link;
      return;
    }
    return;
  } else {
    const isLoginDialog = document.getElementById("isLogin_dialog");
    isLoginDialog.showModal();
  }
}

// 토스트 메시지 관리
document.addEventListener("DOMContentLoaded", () => {
  const [LOGIN, LOGOUT] = ["login", "logout"];
  if (localStorage.getItem(LOGIN)) {
    toast.success("성공적으로 로그인 되었습니다!");
    localStorage.removeItem(LOGIN);
  }
  if (localStorage.getItem(LOGOUT)) {
    toast.success("성공적으로 로그아웃 되었습니다!");
    localStorage.removeItem(LOGOUT);
  }
});
