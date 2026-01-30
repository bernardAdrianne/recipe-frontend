<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Footer from "$lib/components/user/footer.svelte";
  import Contact from "$lib/components/user/contact.svelte";
  import {
    Clock, 
    Search, 
    Plus, 
    X,
    BadgeCheck,
    BadgeAlert,
    TriangleAlert,
    CircleX,
    Loader
  } from "lucide-svelte";

  let toastMessage = "";
  let showToast = false;
  let toastType: "success" | "error" = "success";
  let toastPosition:
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right" = "top-right";

  interface Recipe {
    id: string;
    title?: string;
    image: string;
    description: string;
    difficulty: string;
    estimatedTime: string;
    ingredients: string[];
    steps?: string[];
    category?: string;
    saved?: boolean;
  }

  // Ingredient input + list
  let ingredientText = "";
  let ingredientList: string[] = [];

  // Results
  let recipes: Recipe[] = [];
  let topAIRecipes: Recipe[] = [];
  let otherAIRecipes: Recipe[] = [];
  let remainingRecipes: Recipe[] = [];

  // UI state
  let isLoading = false;
  let hasSearched = false;

  function triggerToast(message: string, 
        type: "success" | "error" = "success", 
        position: typeof toastPosition = "top-right") {
    toastMessage = message;
    toastType = type;
    showToast = true;
    toastPosition = position;
    
    setTimeout(() => (showToast = false), 3000);
  }

  onMount(() => {
  });

  function addIngredient() {
    const trimmed = ingredientText.trim().toLowerCase();
    if (!trimmed) return;
    if (!ingredientList.includes(trimmed)) ingredientList = [...ingredientList, trimmed];
    ingredientText = "";
  }

  function removeIngredient(ing: string) {
    ingredientList = ingredientList.filter(i => i !== ing);
  }

  async function searchByIngredientList() {
    if (ingredientList.length === 0) {
      triggerToast("Add at least 1 ingredient.", "error", "top-center");
      return;
    }

    isLoading = true;
    hasSearched = true;
    recipes = [];
    topAIRecipes = [];
    otherAIRecipes = [];
    remainingRecipes = [];

    try {
      const query = ingredientList.join(",");
      const res = await fetch(`http://localhost:3000/api/recipe/search?ingredient=${encodeURIComponent(query)}`, {
        credentials: "include",
      });

      // handle auth/guest responses gracefully
      if (res.status === 403) {
        const err = await res.json();
        triggerToast(err.message || "Guest search limit reached. Please sign in.", "error", "top-center");
        isLoading = false;
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        triggerToast(err.message || "Search failed.", "error", "top-center");
        isLoading = false;
        return;
      }

      const data = await res.json();
      const list = data.results || [];

      // Build local recipe objects
      recipes = list.map((r: any) => ({
        id: (r._id || r.id).toString(),
        title: r.title,
        image: r.image,
        description: r.description,
        difficulty: r.difficulty,
        estimatedTime: r.estimatedTime,
        ingredients: r.ingredients || [],
        category: r.category,
        steps: r.steps || [],
        saved: !!r.saved
      }));

      // Split results: top 3 + next 3 (least relevant) + rest
      topAIRecipes = recipes.slice(0, 3);
      otherAIRecipes = recipes.slice(3, 6);
      remainingRecipes = recipes.slice(6);
    } catch (err) {
      console.error("Search error:", err);
      triggerToast("Network error while searching recipes.");
    } finally {
      isLoading = false;
    }
  }

  function openRecipePage(id: string) {
     goto(`/user/recipe/${id}`);
  }

  function difficultyColor(level: string) {
  switch (level.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}
</script>

<section class="max-w-6xl mx-auto px-4 py-20 min-h-[85vh]">
<!-- TOAST -->
{#if showToast}
  <div
    class={`
      fixed z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg
      text-sm font-medium transition-all duration-300

      ${toastType === "success"
        ? "bg-green-600 text-white"
        : "bg-red-600 text-white"}

      ${toastPosition === "top-left"
        ? "top-5 left-5"
        : ""}

      ${toastPosition === "top-center"
        ? "top-5 left-1/2 -translate-x-1/2"
        : ""}

      ${toastPosition === "top-right"
        ? "top-5 right-5"
        : ""}

      ${toastPosition === "bottom-left"
        ? "bottom-5 left-5"
        : ""}

      ${toastPosition === "bottom-center"
        ? "bottom-5 left-1/2 -translate-x-1/2"
        : ""}

      ${toastPosition === "bottom-right"
        ? "bottom-5 right-5"
        : ""}
    `}
  >
    <!-- ICON -->
    {#if toastType === "success"}
      <BadgeCheck class="w-5 h-5 text-white" />
    {:else}
      <BadgeAlert class="w-5 h-5 text-white" />
    {/if}

    <!-- MESSAGE -->
    <span>{toastMessage}</span>
  </div>
{/if}

      <h1 class="text-4xl md:text-5xl text-[#000000] text-center mb-5">Find your perfect Recipe</h1>
      <p class="text-gray-600 text-lg text-center mx-w-2xl mx-auto mb-10">Enter the ingredients you have and discover what you can make</p>

 <!-- SEARCH BOX CONTAINER -->
<div class="max-w-2xl mx-auto mb-6">
  <div class="bg-white border border-gray-300 p-6 rounded-2xl shadow-lg">

    <!-- SEARCH AND ADD BUTTON -->
    <div class="flex gap-2">
      <input
        class="bg-gray-200 flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400"
        placeholder="Enter an ingredient (e.g. chicken, tomatoes, pasta)"
        bind:value={ingredientText}
        on:keydown={(e) => e.key === "Enter" && addIngredient()}
      />

      <button 
        class="px-4 py-2 flex items-center gap-2 bg-[#228B22] text-white 
               rounded-lg hover:bg-[#1a5f17] hover:scale-[1.03] transition"
        on:click={addIngredient}
      > 
        <Plus size="14" class="text-white" />
        <span>Add</span>
      </button>
    </div>

    <!-- INGREDIENT SECTION -->
    {#if ingredientList.length > 0}
      <p class="mt-3 mb-2 text-md text-gray-700">Your ingredients:</p>

    <!-- INGREDIENT TAGS -->
    <div class="flex flex-wrap gap-2 mt-2">
      {#each ingredientList as ing}
        <div class="flex items-center gap-2 bg-gray-200 font-semibold text-[#000000] px-3 py-1 rounded-lg">
          <span class="capitalize">{ing}</span>
          <button class="text-gray-500 hover:text-red-700" on:click={() => removeIngredient(ing)}>
            <X size="14" />
          </button>
        </div>
      {/each}
    </div>
    {/if}

<!-- SEARCH BUTTON -->
<button
  class="w-full mt-4 py-3 bg-black text-white rounded-lg
         flex items-center justify-center gap-2
         hover:bg-gray-800 hover:scale-[1.03] transition
         disabled:opacity-70 disabled:cursor-not-allowed"
  on:click={searchByIngredientList}
  disabled={isLoading}
>
  {#if isLoading}
  <!-- SPINNER -->
  <Loader
    class="w-5 h-5 animate-spin text-white"
    aria-label="Loading"
  />

  <span>Searching...</span>
  {:else}
    <Search size="18" class="text-white" />
    <span>Search Recipes</span>
  {/if}
</button>

</div>
</div>

<!-- RESULTS / STATES -->
{#if hasSearched && !isLoading && recipes.length === 0}

  <!-- EMPTY STATE -->
  <div class="flex flex-col items-center justify-center min-h-[40vh] space-y-4 text-center">
    <div class="text-6xl">😩</div>
    <div class="text-red-600 font-semibold text-lg">
      No recipes match your ingredients.
    </div>
    <div class="text-gray-500">
      Try adding or changing your ingredients 🍅🥦🍗
    </div>
  </div>

{:else}

  <!-- TOP AI RECOMMENDATIONS -->
  {#if topAIRecipes.length > 0}
    <h3 class="text-2xl font-bold text-gray-800 mb-3">
      Top AI Recommendations
    </h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {#each topAIRecipes as r}
        <div
          class="bg-white border border-gray-300 rounded-2xl shadow-md
                 overflow-hidden hover:scale-[1.03] transition cursor-pointer
                 w-full max-w-sm mx-auto"
          on:click={() => openRecipePage(r.id)}
        >
          <!-- IMAGE -->
          <img src={r.image} class="w-full h-64 object-cover" />

          <div class="p-5">
            <!-- BADGES -->
            <div class="flex gap-2 mb-3">
              <span class="px-3 py-1 text-xs rounded-md bg-[#ececec] text-[#000000]">
                {r.category}
              </span>

              <span class={`px-3 py-1 text-xs rounded-md ${difficultyColor(r.difficulty)}`}>
                {r.difficulty}
              </span>
            </div>

            <!-- TITLE -->
            <h3 class="text-xl text-[#000000] font-semibold mb-1">
              {r.title}
            </h3>

            <!-- DESCRIPTION -->
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
              {r.description}
            </p>

            <!-- ESTIMATED TIME -->
            <div class="flex items-center text-gray-500 text-sm gap-1">
              <Clock size="14" />
              <span>{r.estimatedTime}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- LEAST RELEVANT AI RECOMMENDATIONS -->
  {#if otherAIRecipes.length > 0}
    <h3 class="text-xl font-semibold text-gray-700 mb-3">
      Less Relevant AI Recommendations
    </h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {#each otherAIRecipes as r}
        <div
          class="bg-white border border-gray-300 rounded-2xl shadow-md
                 overflow-hidden hover:scale-[1.03] transition cursor-pointer
                 w-full max-w-sm mx-auto"
          on:click={() => openRecipePage(r.id)}
        >
          <!-- IMAGE -->
          <img src={r.image} class="w-full h-64 object-cover" />

          <div class="p-5">
            <!-- BADGES -->
            <div class="flex gap-2 mb-3">
              <span class="px-3 py-1 text-xs rounded-md bg-[#ececec] text-[#000000]">
                {r.category}
              </span>

              <span class={`px-3 py-1 text-xs rounded-md ${difficultyColor(r.difficulty)}`}>
                {r.difficulty}
              </span>
            </div>

            <!-- TITLE -->
            <h3 class="text-xl text-[#000000] font-semibold mb-1">
              {r.title}
            </h3>

            <!-- DESCRIPTION -->
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
              {r.description}
            </p>

            <!-- ESTIMATED TME -->
            <div class="flex items-center text-gray-500 text-sm gap-1">
              <Clock size="14" />
              <span>{r.estimatedTime}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/if}

</section>

<Contact />
<Footer />

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
