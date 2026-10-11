const mealsContainer = document.querySelector(".meals-container");

    // 2. 使用事件委托，给所有卡片绑定点击事件
mealsContainer.addEventListener("click", (e) => {
    const mealEl = e.target.closest(".meal");
    if (!mealEl) return;

    // 3. 获取 data-url 并跳转
    const url = mealEl.getAttribute("data-url");
    if (url) {
        window.open(url, "_blank");
    }
});