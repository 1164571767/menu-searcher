const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const mealsContainer = document.querySelector('.meals-container');
const errorContainer = document.getElementById('error-container');
const resultHeading = document.querySelector('.result-heading');

// 详情DOM
const mealDetailsSection = document.getElementById('meal-details');
const backBtn = document.getElementById('back-btn');
const detailTitle = document.querySelector('.meal-details-title');
const detailImg = document.querySelector('.meal-details-img');
const detailCategory = document.getElementById('detail-category');
const detailArea = document.getElementById('detail-area');
const ingredientsList = document.getElementById('ingredients-list');
const instructionsText = document.getElementById('instructions-text');

// 切换视图：显示菜品列表
function showMealList() {
    mealsContainer.classList.remove('hidden');
    mealDetailsSection.classList.add('hidden');
}
// 切换视图：显示详情页
function showMealDetail() {
    mealsContainer.classList.add('hidden');
    mealDetailsSection.classList.remove('hidden');
}

// 返回按钮
backBtn.addEventListener('click', showMealList);

// 根据id获取菜品详情
async function fetchMealById(mealId) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
}

// 渲染详情
async function renderMealDetail(mealId) {
    const meal = await fetchMealById(mealId);
    if (!meal) return;

    detailTitle.innerText = meal.strMeal;
    detailImg.src = meal.strMealThumb;
    detailImg.alt = meal.strMeal;
    detailCategory.innerText = meal.strCategory;
    detailArea.innerText = meal.strArea;

    // 清空旧食材
    ingredientsList.innerHTML = '';
    // 提取所有不为空的食材+分量
    for(let i=1; i<=20; i++){
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if(ing && ing.trim() !== ''){
            const li = document.createElement('li');
            li.textContent = `${measure.trim()} ${ing.trim()}`;
            ingredientsList.appendChild(li);
        }
    }
    instructionsText.innerText = meal.strInstructions;
    showMealDetail();
}

// 搜索菜品
async function searchMeals(query) {
    if(!query.trim()) return;
    errorContainer.classList.add('hidden');
    mealsContainer.innerHTML = '';
    resultHeading.textContent = `Search result for: "${query}"`;

    try {
        const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
        const json = await resp.json();
        const meals = json.meals;

        if(!meals) {
            errorContainer.classList.remove('hidden');
            return;
        }

        meals.forEach(meal => {
            const div = document.createElement('div');
            div.className = 'meal';
            div.dataset.mealId = meal.idMeal;
            div.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info">
                    <div class="meal-title">${meal.strMeal}</div>
                    <div class="meal-category">${meal.strCategory}</div>
                </div>
            `;
            // 点击卡片打开详情
            div.addEventListener('click', ()=>{
                renderMealDetail(meal.idMeal);
            });
            mealsContainer.appendChild(div);
        });

    } catch(err){
        errorContainer.classList.remove('hidden');
        console.error(err);
    }
}

// 搜索按钮点击
searchBtn.addEventListener('click', ()=>{
    searchMeals(searchInput.value);
});
// 回车搜索
searchInput.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') searchMeals(searchInput.value);
});

// 给页面上初始写死的卡片绑定点击事件
document.querySelectorAll('.meal').forEach(card=>{
    card.addEventListener('click', ()=>{
        const id = card.dataset.mealId;
        renderMealDetail(id);
    })
})