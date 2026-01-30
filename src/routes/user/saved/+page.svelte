<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from "$app/navigation";
  import { fade } from 'svelte/transition';
  import { 
    Clock, 
    Bookmark, 
    Trash2,
    CircleX,
    BadgeCheck,
    BadgeAlert
  } 
  from "lucide-svelte";
  
  let recipes: any[] = [];
  let currentPage = 1;
  const itemsPerPage = 6;
  
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

  onMount(() => {
    fetchSavedRecipes();
  });

  function triggerToast(message: string, 
        type: "success" | "error" = "success", 
        position: typeof toastPosition = "top-right") {
    toastMessage = message;
    toastType = type;
    showToast = true;
    toastPosition = position;
    
    setTimeout(() => (showToast = false), 3000);
  }

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

      triggerToast("Recipe removed successfully", "success", "top-right");
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
      recipes = data.results;
    } catch (err) {
      console.error(err);
      recipes = [];
    }
  }

  function difficultyColor(level: string) {
  switch (level?.toLowerCase()) {
    case "easy": return "bg-green-100 text-green-700";
    case "medium": return "bg-yellow-100 text-yellow-700";
    case "hard": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
    }
  }

  function openRecipePage(id: string) {
     goto(`/user/recipe/${id}`);
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

<!-- SAVED RECIPES DASHBOARD -->
<section class="max-w-7xl mx-auto px-4 py-8">
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
      <BadgeAlert class="w-5 h-5 text-white" />
    {:else}
      <BadgeAlert class="w-5 h-5 text-white" />
    {/if}

    <!-- MESSAGE -->
    <span>{toastMessage}</span>
  </div>
{/if}

  <div class="flex mt-6 gap-2">
    <Bookmark size="42" class="text-black-700 bg-green-200 rounded-full p-2"/>
    <h1 class="text-4xl text-[#000000] mb-6">My Bookmarks</h1>
  </div>

    <p class="text-2xl text-gray-600">You saved recipes for quick access</p>

{#if savedRecipes.length === 0}
  <div class="flex flex-col bg-white border border-gray-300 mt-4 rounded-2xl items-center justify-center min-h-[60vh] space-y-4 text-center">
    <Bookmark size="60" class="text-gray-400 bg-gray-200 rounded-full max-w-2xl mx-auto px-4 py-4"/>

    <!-- MESSAGE -->
    <p class="text-gray-700 font-semibold text-lg">
      No bookmarks yet  
    </p>

    <!-- SUGGESTION -->
    <p class="text-gray-500 text-md">
      Start bookmarking recipes to save them for later
    </p>
  </div>
{:else}

  <!-- RECIPE GRID -->
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {#each paginatedRecipes as recipe}
  <div
  class="group bg-white border border-gray-300 rounded-2xl shadow-md 
         overflow-hidden hover:scale-[1.03] transition cursor-pointer 
         w-full max-w-sm mx-auto mt-8 relative"
  on:click={() => openRecipePage(recipe._id)}
>
  <img src={recipe.image} class="w-full h-64 object-cover" />

  <div class="p-5">

    <!-- CATEGORY + DIFFICULTY -->
    <div class="flex gap-2 mb-3">
      <span class="px-3 py-1 text-xs rounded-md bg-[#ececec] text-[#000000]">
        {recipe.category}
      </span>

      <span class={`px-3 py-1 text-xs rounded-md ${difficultyColor(recipe.difficulty)}`}>
        {recipe.difficulty}
      </span>
    </div>

    <h3 class="text-xl text-[#000000] font-semibold mb-1">
      {recipe.title}
    </h3>

    <p class="text-gray-600 text-sm mb-3 line-clamp-2">
      {recipe.description}
    </p>

    <!-- TIME + DELETE BUTTON -->
    <div class="flex items-center justify-between text-gray-500 text-sm">
      <div class="flex items-center gap-1">
        <Clock size="14" />
        <span>{recipe.estimatedTime}</span>
      </div>

      <!-- DELETE BUTTON (shows only on hover) -->
      <button
        class="p-2 rounded-lg hover:bg-gray-200 text-red-600 transition 
               opacity-0 group-hover:opacity-100"
        on:click={(e) => {
          e.stopPropagation(); 
          toggleUnsave(recipe._id);
        }}
        title="Remove from bookmarks"
      >
        <Trash2 size="18" />
      </button>
    </div>

  </div>
</div>
{/each}
</div>

  <!-- PAGINATION -->
  <div class="flex justify-center mt-10 items-center gap-4">

    <button
     on:click={goToPrevPage}
      class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm
            shadow-md border border-gray-300 text-gray-700
            hover:bg-white hover:-translate-y-1 hover:shadow-lg transition 
            disabled:opacity-40 disabled:translate-y-0"
      disabled={currentPage === 1}
    >
      <span class="text-lg">←</span> Prev
    </button>

    <span class="text-gray-700 font-semibold text-lg px-4 py-2">
      {currentPage} / {totalPages}
    </span>

    <button
      on:click={goToNextPage}
      class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm
            shadow-md border border-gray-300 text-gray-700
            hover:bg-white hover:-translate-y-1 hover:shadow-lg transition 
            disabled:opacity-40 disabled:translate-y-0"
        disabled={currentPage === totalPages}
      >
        Next <span class="text-lg">→</span>
      </button>

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