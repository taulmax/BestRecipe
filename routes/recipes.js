import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

const router = express.Router();
const __dirname = path.resolve();
const RECIPES_DATA = path.join(__dirname, "recipes.json");
const SCRAP_DATA = path.join(__dirname, "scrap.json");

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

// recipes.json과 scrap.json을 join 해주는 함수
function getRecipeIdsByUserId(userId, scrapData) {
  return scrapData.reduce((acc, item) => {
    if (parseInt(item.userId) === parseInt(userId)) {
      acc.push(parseInt(item.recipeId));
    }
    return acc;
  }, []);
}

// 레시피 조회 API (메인 페이지, 제한된 수)
router.get("/main", (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  const { userId } = req.query;
  if (userId) {
    const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));
    const scrapRecipeIds = getRecipeIdsByUserId(userId, scrapData);
    const recipesWithScrap = recipes.map((recipe) => {
      if (scrapRecipeIds.includes(recipe.id)) {
        recipe.isScrapped = true;
      } else {
        recipe.isScrapped = false;
      }
      return recipe;
    });
    res.json(recipesWithScrap.slice(0, 9));
  } else {
    res.json(recipes.slice(0, 9));
  }
});

// 레시피 조회 API (전체 레시피)
router.get("/", (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  const { userId } = req.query;
  if (userId) {
    const scrapData = JSON.parse(fs.readFileSync(SCRAP_DATA, "utf8"));
    const scrapRecipeIds = getRecipeIdsByUserId(userId, scrapData);
    const recipesWithScrap = recipes.map((recipe) => {
      if (scrapRecipeIds.includes(recipe.id)) {
        recipe.isScrapped = true;
      } else {
        recipe.isScrapped = false;
      }
      return recipe;
    });
    res.json(recipesWithScrap);
  } else {
    res.json(recipes);
  }
});

// 레시피 추가 API
router.post("/", upload.single("image"), (req, res) => {
  const { food, subTitle, recipe, ingredient } = req.body;
  const image = req.file ? "images/" + req.file.filename : null;

  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));

  const newRecipe = {
    id: recipes.length + 1,
    food,
    subTitle,
    recipe,
    image,
    ingredient,
  };

  recipes.push(newRecipe);

  fs.writeFileSync(RECIPES_DATA, JSON.stringify(recipes, null, 2), "utf8");
  res.status(201).json(newRecipe);
});

// 특정 레시피 가져오기 (상세 페이지)
router.get("/:id", (req, res) => {
  const recipes = JSON.parse(fs.readFileSync(RECIPES_DATA, "utf8"));
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));

  if (recipe) {
    res.json(recipe);
  } else {
    res.status(404).json({ error: "레시피를 찾을 수 없습니다." });
  }
});

export default router;
