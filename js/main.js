import { fetchRecipes } from './api.js';
import { renderRecipes } from './recipes.js';

const app = document.getElementById('app');

async function loadSampleRecipes() {
  const data = await fetchRecipes('egg,tomato');
  renderRecipes(data, app);
}

loadSampleRecipes();
