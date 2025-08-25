<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let showModal = false;
  let selectedRecipe: any = null;
  let message = '';
  let recipes: any[] = [];
  let currentPage = 1;
  const itemsPerPage = 9;

  onMount(() => {
    fetchSavedRecipes();
  });

  
  async function toggleUnsave(id: string) {
    try {
      const res = await fetch('http://localhost:3000/api/unsave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ recipeId: id })
      });

      if (!res.ok) {
        throw new Error('Failed to unsave recipe');
      }

      recipes = recipes.filter(r => r._id !== id);

      // close modal if current recipe was unsaved
      if (selectedRecipe && selectedRecipe._id === id) {
        closeModal();
      }

      message = 'Recipe unsaved successfully';
      setTimeout(() => (message = ''), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchSavedRecipes() {
    try {
      const res = await fetch('http://localhost:3000/api/saved', {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch saved recipes');
      }

      const data = await res.json();
      recipes = data.results; // backend returns { results: [...] }
    } catch (err) {
      console.error(err);
      recipes = [];
    }
  }

  async function fetchRecipeById(id: string) {
    try {
      const res = await fetch(`http://localhost:3000/api/recipe/${id}`, {
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Failed to fetch recipe');
      }

      const data = await res.json();
      return data.results;
    } catch (err) {
      console.error('Fetch recipe error:', err);
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

  $: savedRecipes = recipes;
  $: totalPages = Math.ceil(savedRecipes.length / itemsPerPage);
  $: paginatedRecipes = savedRecipes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function goToNextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function goToPrevPage() {
    if (currentPage > 1) currentPage--;
  }

  $: if (currentPage > totalPages) currentPage = totalPages || 1;


</script>

<section class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold text-center mb-6">Saved Recipes</h1>
  
  {#if message}
    <p
      transition:fade
      class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg z-50"
    >
      {message}
    </p>
  {/if}

  {#if savedRecipes.length === 0}
    <p class="text-center text-gray-600">No saved recipes yet.</p>
  {:else}
    <!-- Recipe grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {#each paginatedRecipes as recipe}
        <div class="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
          <!-- Clickable area opens modal -->
          <div class="cursor-pointer" on:click={() => openRecipeModal(recipe._id)}>
            <img src={recipe.image} alt={recipe.title} class="w-full h-48 object-cover" />
            <h2 class="text-lg font-semibold text-gray-800 p-4">{recipe.title}</h2>
          </div>

          <!-- Unsave button -->
          <div class="px-4 pb-4 flex justify-end">
            <button
              class="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              on:click|stopPropagation={() => toggleUnsave(recipe._id)}
            >
              Unsave
            </button>
          </div>
        </div>
      {/each}
    </div>

    
    <!-- Pagination -->
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
</style>

