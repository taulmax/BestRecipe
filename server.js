import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json()); // POST 요청의 본문을 JSON으로 파싱
const PORT = 3000;

// 현재 모듈의 경로를 얻기 위한 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//기본 미들웨어 설정
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//이미지 디렉터리 설정
const imagesDir = path.join(__dirname, "public", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

//multer로 파일 저장 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

//모든 도메인 접근, CRUD 허용, api 클라이언트 권한 제어
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// *************** GET API KEY *************** //
// API 키 넘겨주기
app.get("/api/keys", (req, res) => {
  const { type } = req.query;
  let apiKey;

  switch (type) {
    case "weather":
      apiKey = process.env.WEATHER_API_KEY;
      break;
    case "kakao":
      apiKey = process.env.KAKAO_API_KEY;
      break;
    case "youtube":
      apiKey = process.env.YOUTUBE_API_KEY;
      break;
    default:
      return res.status(400).json({ error: "API Key Type 설정 오류" });
  }

  res.json({ apiKey });
});

// 레시피 데이터 경로
const RECIPES_DATA = path.join(__dirname, "recipes.json");

// 레시피 조회 API (메인 페이지, 제한된 수)
app.get("/api/recipes/main", (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  res.json(recipes.slice(0, 9));
});

// 레시피 조회 API (전체 레시피)
app.get("/api/recipes", (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  res.json(recipes);
});

// 레시피 추가 API
app.post("/api/recipes", upload.single("image"), (req, res) => {
  const { food, subTitle, recipe, ingredient } = req.body;
  const image = req.file ? "images/" + req.file.filename : null;

  const newRecipe = {
    food,
    subTitle,
    recipe,
    image,
    ingredient,
  };

  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  recipes.push(newRecipe);

  fs.writeFileSync(RECIPES_DATA, JSON.stringify(recipes, null, 2), "utf8");
  res.status(201).json(newRecipe);
});

// 로컬호스트로 들어가면 바로 뜨는화면 home.html으로 설정
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});
app.get("/cyberRecipes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cyberRecipe.html"));
});
app.get("/writeRecipe.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "writeRecipe.html"));
});
//서버시작
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
