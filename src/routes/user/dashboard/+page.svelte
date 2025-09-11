<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';

  interface Recipe {
    id: string;
    title?: string;
    image: string;
    ingredients: string[];
    steps?: string[];
    category?: string;
    saved: boolean;
  }

  let topAIRecipes: Recipe[] = [];
  let otherAIRecipes: Recipe[] = []; 
  let remainingRecipes: Recipe[] = [];
  let showModal = false;
  let selectedRecipe: Recipe | null = null;
  let isLoading = false;
  let searchTerm = '';
  let recipes: Recipe[] = [];
  let selectedCategory = 'All';
  let currentPage = 1;
  const itemsPerPage = 9;

  // NEW: modal for ingredient search
  let showSearchModal = false;
  let ingredientsInput = "";
  let hasSearched = false;

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
  
  let unsubscribe: () => void;

  onMount(() => {
    fetchRecipes();
    window.addEventListener("keydown", handleKeydown);
    unsubscribe = page.subscribe(($page) => {
      searchTerm = $page.url.searchParams.get('search')?.toLowerCase() || '';
      fetchRecipes();
    });
  });

  onDestroy(() => {
    unsubscribe?.();
    window.removeEventListener("keydown", handleKeydown);
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      if (showModal) closeModal();
      if (showSearchModal) closeSearchModal();
    }
  }

  async function toggleSave(id: string, saved: boolean) {
    try {
      const url = saved
        ? 'https://airecipe-backend-2.onrender.com/api/unsave'
        : 'https://airecipe-backend-2.onrender.com/api/save';

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recipeId: id })
      });

      if (res.ok) {
        recipes = recipes.map(r =>
          r.id === id ? { ...r, saved: !saved } : r
        );
        topAIRecipes = topAIRecipes.map(r =>
        r.id === id ? { ...r, saved: !saved } : r
      );

      // update in otherAIRecipes
      otherAIRecipes = otherAIRecipes.map(r =>
        r.id === id ? { ...r, saved: !saved } : r
      );

      // update in remainingRecipes if needed
      remainingRecipes = remainingRecipes.map(r =>
        r.id === id ? { ...r, saved: !saved } : r
      );

      // also update modal if it's open
      if (selectedRecipe && selectedRecipe.id === id) {
        selectedRecipe = { ...selectedRecipe, saved: !saved };
      }
    }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchRecipes() {
    isLoading = true;
    try {
      const allRes = await fetch('https://airecipe-backend-2.onrender.com/api/recipe/all', { credentials: 'include' });
      const allData = await allRes.json();
      let list = allData.results || allData.recipes || [];

      const savedRes = await fetch('https://airecipe-backend-2.onrender.com/api/saved/', { credentials: 'include' });
      const savedData = await savedRes.json();
      const savedIds = (savedData.results || []).map((r: any) => r._id.toString());

      recipes = list.map((r: any) => ({
        id: r._id.toString(),
        title: r.title,
        image: r.image,
        ingredients: r.ingredients || [],
        category: r.category,
        steps: r.steps || [],
        saved: savedIds.includes(r._id.toString()),
      }));
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
      recipes = [];
    } finally {
      isLoading = false;
    }
  }

  async function fetchRecipeById(id: string) {
    try {
      const res = await fetch(`https://airecipe-backend-2.onrender.com/api/recipe/${id}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch recipe');
      const data = await res.json();
      return data.results;
    } catch (err) {
      console.error('Failed to fetch recipe: ', err);
    }
  }

  async function openRecipeModal(id: string) {
    const recipe = await fetchRecipeById(id);
    if (recipe) {
      selectedRecipe = recipe;
      showModal = true;
    }
  }

  function closeModal() {
    showModal = false;
    selectedRecipe = null;
  }

  function openSearchModal() {
    showSearchModal = true;
  }

  function closeSearchModal() {
    showSearchModal = false;
    ingredientsInput = "";
  }

  async function handleIngredientSearch() {
  hasSearched = true;
  showSearchModal = false;
  isLoading = true;
  currentPage = 1;

  try {
    const res = await fetch(
      `https://airecipe-backend-2.onrender.com/api/recipe/search?ingredient=${encodeURIComponent(ingredientsInput)}`,
      { credentials: 'include' }
    );

    if (!res.ok) {
      const errData = await res.json();
      console.error("AI search error:", errData);
      recipes = [];
      return;
    }

    const data = await res.json();
    const list = data.results || [];

    // Mark saved recipes
    const savedRes = await fetch('https://airecipe-backend-2.onrender.com/api/saved/', { credentials: 'include' });
    const savedData = await savedRes.json();
    const savedIds = (savedData.results || []).map((r: any) => r._id.toString());

    recipes = list.map((r: any) => ({
      id: r._id?.toString() || r.id,
      title: r.title,
      image: r.image,
      ingredients: r.ingredients || [],
      category: r.category,
      steps: r.steps || [],
      saved: savedIds.includes(r._id?.toString() || r.id),
    }));

    topAIRecipes = recipes.slice(0, 3);
    otherAIRecipes = recipes.length > 3 ? recipes.slice(3, 6) : [];
    remainingRecipes = recipes.slice(6);
  } catch (err) {
    console.error("Failed to fetch AI search recipes:", err);
    recipes = [];
  } finally {
    isLoading = false;
    ingredientsInput = "";
  }
}

  // Filtering
  const recentCount = 3;
  $: recentRecipes = recipes.slice(-recentCount);

  $: allFilteredRecipes = recipes.filter(recipe => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Recent Searches' && recentRecipes.includes(recipe)) ||
      recipe.category === selectedCategory;

    const matchesSearch =
      !searchTerm ||
      recipe.title?.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  $: totalPages = Math.ceil(allFilteredRecipes.length / itemsPerPage);
  $: paginatedRecipes = allFilteredRecipes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function goToNextPage() {
    if (currentPage < totalPages) currentPage++;
  }
  function goToPrevPage() {
    if (currentPage > 1) currentPage--;
  }
</script>

<section class="max-w-7xl mx-auto px-4 py-8">

  <!-- Search Button -->
<div class="flex justify-center mb-6">
  <button
    class="btn relative overflow-hidden flex items-center gap-2 px-8 py-3 
           border-2 border-[#228B22] 
           text-black font-semibold rounded-full 
           shadow-md transition-all duration-500 
           hover:scale-105 hover:shadow-lg active:scale-95"
    on:click={openSearchModal}
  >
    <!-- Icon + Text -->
    <span class="text-lg *:relative z-10 transition-transform duration-500 group-hover:rotate-12">
      🍳
    </span>
    <span class="text-lg relative z-10">Turn Ingredients into Recipes</span>
  </button>
</div>

  <!-- Ingredient Search Modal -->
  {#if showSearchModal}
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
          on:click={closeSearchModal}
        >
          ✖
        </button>
        <h2 class="text-xl font-bold text-gray-800 mb-4">Search Recipes by Ingredients</h2>
        <p class="text-sm text-gray-600 mb-3">Enter the ingredients you have (comma separated):</p>
        <input
          type="text"
          bind:value={ingredientsInput}
          placeholder="e.g. chicken, garlic, onion"
          class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#228B22] mb-4"
        />
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            on:click={closeSearchModal}
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-[#228B22] text-white rounded-lg hover:bg-[#1a5f17] transition"
            on:click={handleIngredientSearch}
            disabled={!ingredientsInput.trim()}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Main Content -->
  {#if isLoading}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {#each Array(6) as _}
      <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div class="bg-gray-300 h-48 w-full"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-300 rounded w-3/4"></div>
          <div class="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    {/each}
  </div>
    {:else if !hasSearched}
  <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <span class="text-7xl animate-bounce">🍽️</span>
    <p class="text-gray-600 text-lg font-semibold">I’m hungry... feed me some ingredients!</p>
  </div>

{:else if paginatedRecipes.length === 0}
  <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <!-- Shaking Head Emoji -->
    <span 
      class="text-7xl animate-shake"
    >
      😩
    </span>

    <!-- Message -->
    <p class="text-red-600 text-lg font-semibold">
      No recipes match your ingredients.
    </p>

    <!-- Suggestion -->
    <p class="text-gray-500 text-lg">
      Try adding or changing your ingredients 🍅🥦🍗
    </p>
  </div>
{:else}


  <!-- AI Recommendations -->
{#if topAIRecipes.length > 0}
  <h3 class="text-2xl font-bold text-gray-800 mb-4">Top AI Recommended Recipes</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
    {#each topAIRecipes as recipe}
      <div
        class="bg-white rounded-xl shadow-md overflow-hidden transform transition hover:scale-[1.02] hover:shadow-lg cursor-pointer"
        on:click={() => openRecipeModal(recipe.id)}
      >
        <!-- Image + Category Badge -->
        <div class="relative">
          <img src={recipe.image} alt={recipe.title} class="w-full h-48 object-cover"/>
          {#if recipe.category}
            <div class="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {recipe.category}
            </div>
          {/if}
        </div>

        <!-- Title -->
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-800">{recipe.title}</h2>
        </div>

        <!-- Save Button -->
        <div class="px-4 pb-4 flex justify-end items-center">
          <button
            type="button"
            class="flex items-center justify-center w-9 h-9 rounded-full 
              transition-all duration-200 ease-in-out 
              shadow-md hover:scale-110 active:scale-95
                {recipe.saved 
                ? 'bg-red-500 text-white hover:bg-red-500' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}"
              on:click|stopPropagation={() => toggleSave(recipe.id, recipe.saved)}
               aria-label={recipe.saved ? "Remove Bookmark" : "Bookmark Recipe"}
            >
    {#if recipe.saved}
      <!-- Solid Bookmark (Saved) -->
      <i class="fa-solid fa-bookmark text-lg"></i>
    {:else}
      <!-- Regular Bookmark (Not Saved) -->
      <i class="fa-regular fa-bookmark text-lg"></i>
    {/if}
  </button>
</div>

      </div>
    {/each}
  </div>
{/if}


  <!-- Least AI Recommended -->
  {#if otherAIRecipes.length > 0}
  <h3 class="text-xl font-semibold text-gray-600 mb-4">Least Relevant Recipes</h3>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
    {#each otherAIRecipes as recipe}
      <div
        class="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200 transform transition hover:scale-[1.01] cursor-pointer"
        on:click={() => openRecipeModal(recipe.id)}
      >
        <!-- Image + Category Badge -->
        <div class="relative">
          <img src={recipe.image} alt={recipe.title} class="w-full h-48 object-cover"/>
          {#if recipe.category}
            <div class="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {recipe.category}
            </div>
          {/if}
        </div>

        <!-- Title -->
        <div class="p-4">
          <h2 class="text-md font-medium text-gray-700">{recipe.title}</h2>
        </div>

        <!-- Save Button -->
        <div class="px-4 pb-4 flex justify-end items-center">
          <button
            type="button"
            class="flex items-center justify-center w-9 h-9 rounded-full 
              transition-all duration-200 ease-in-out 
              shadow-md hover:scale-110 active:scale-95
                {recipe.saved 
                ? 'bg-red-500 text-white hover:bg-red-500' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}"
              on:click|stopPropagation={() => toggleSave(recipe.id, recipe.saved)}
               aria-label={recipe.saved ? "Remove Bookmark" : "Bookmark Recipe"}
            >
    {#if recipe.saved}
      <!-- Solid Bookmark (Saved) -->
      <i class="fa-solid fa-bookmark text-lg"></i>
    {:else}
      <!-- Regular Bookmark (Not Saved) -->
      <i class="fa-regular fa-bookmark text-lg"></i>
    {/if}
  </button>
</div>

      </div>
    {/each}
  </div>
{/if}


    <!-- Recipe Grid -->
<!-- <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {#each paginatedRecipes as recipe}
    <div
      class="bg-white rounded-xl shadow-md overflow-hidden transform transition hover:scale-[1.02] hover:shadow-lg cursor-pointer"
      on:click={() => openRecipeModal(recipe.id)} 
    >-->
      <!-- Image + Category Badge -->
      <!-- <div class="relative">
        <img src={recipe.image} alt={recipe.title} class="w-full h-48 object-cover"/>
        {#if recipe.category}
          <div class="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {recipe.category}
          </div>
        {/if}
      </div> -->

      <!-- Title + Extra Info -->
      <!-- <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-800">{recipe.title}</h2>
      </div> -->

      <!-- Save Button 
      < <div class="px-4 pb-4 flex justify-end items-center">
        <button
          type="button"
          class={`text-sm px-3 py-1 rounded transition 
            ${recipe.saved 
              ? 'bg-red-600 text-white hover:bg-red-700'  
              : 'bg-[#228B22] text-white hover:bg-[#1a5f17]'}`}
          on:click|stopPropagation={() => toggleSave(recipe.id, recipe.saved)}
        >
          {recipe.saved ? 'Unsave' : 'Save'}
        </button>
      </div>
    </div>
  {/each}
</div> --> 

    <!-- Pagination -->
    <!-- {#if totalPages > 1}
      <div class="flex justify-center mt-8 gap-4">
        <button
          on:click={goToPrevPage}
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50"
          disabled={currentPage === 1}
        >
          ← Back
        </button>
        <span class="text-gray-700 font-medium">Page {currentPage} of {totalPages}</span>
        <button
          on:click={goToNextPage}
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    {/if} -->
  {/if}

  <!-- Recipe Details Modal -->
  {#if showModal && selectedRecipe}
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" on:click={closeModal}>
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fadeIn relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-title"
        on:click|stopPropagation
      >
        <!-- Image + Title -->
        <div class="relative">
          <img src={selectedRecipe.image} alt={selectedRecipe.title} class="w-full h-64 object-cover"/>
          <button
            type="button"
            class="absolute top-3 right-3 z-10 flex items-center justify-center 
                   w-9 h-9 rounded-full bg-white/80 text-gray-700 
                   shadow-md hover:bg-red-500 hover:text-white 
                   transition-all duration-200 ease-in-out 
                   hover:scale-110 active:scale-95"
            on:click={closeModal}
            aria-label="Close modal"
          >
            ✖
          </button>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h2 id="recipe-title" class="text-2xl font-bold text-white drop-shadow-md">{selectedRecipe.title}</h2>
          </div>
        </div>

        <!-- Details -->
        <div class="p-6 max-h-[65vh] overflow-y-auto">
          {#if selectedRecipe.category}
            <p class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-4">{selectedRecipe.category}</p>
          {/if}

          <h3 class="text-lg font-semibold text-gray-800 mb-2">Ingredients</h3>
          <ul class="list-disc list-inside text-gray-700 mb-6 space-y-1">
            {#each selectedRecipe.ingredients as ing}
              <li>{ing}</li>
            {/each}
          </ul>

          {#if selectedRecipe.steps && selectedRecipe.steps.length > 0}
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Steps</h3>
            <p class="text-gray-700 whitespace-pre-line leading-relaxed mb-6">
              {selectedRecipe.steps.join('\n\n')}
            </p>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.25s ease-out;
  }
  .btn {
  background: #ffffff;
  position: relative;
  z-index: 0;
  overflow: hidden;
}
.btn::before,
.btn::after {
  content: "";
  position: absolute;
  z-index: -1;
  top: 0;
  left: -50%;
  right: -50%;
  height: 0;
  padding-bottom: 200%;
  border-radius: 39%;
  opacity: 0;
  transition: transform 0s cubic-bezier(0.2, 0, 0.1, 1) 0.5s, opacity 0.5s cubic-bezier(0.2, 0, 0.1, 1);
}
.btn::before {
  transform: translate3d(-10%, 4.8em, 0) rotate(330deg);
  background: linear-gradient(
    25deg,
    rgba(34, 139, 34, 0.4),
    rgba(34, 139, 34, 0)
  );
}
.btn::after {
  transform: translate3d(10%, 4.8em, 0) rotate(0deg);
  background: linear-gradient(
    70deg,
    rgba(34, 139, 34, 0.4),
    rgba(34, 139, 34, 0)
  );
}
.btn:hover::before,
.btn:hover::after {
  transition: transform 2s ease 0s, opacity 0.2s ease;
  opacity: 1;
}
.btn:hover::before {
  transform: translate3d(-10%, -1em, 0) rotate(100deg);
}
.btn:hover::after {
  transform: translate3d(10%, -1em, 0) rotate(180deg);
}
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px) rotate(-8deg); }
  40% { transform: translateX(8px) rotate(8deg); }
  60% { transform: translateX(-6px) rotate(-6deg); }
  80% { transform: translateX(6px) rotate(6deg); }
  100% { transform: translateX(0); }
}

.animate-shake {
  display: inline-block;
  animation: shake 0.6s ease-in-out infinite;
}

</style>
