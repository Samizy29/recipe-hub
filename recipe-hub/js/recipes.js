export function renderRecipes(recipes, container) {
  container.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}" width="200">
    `;
    container.appendChild(card);
  });
}
