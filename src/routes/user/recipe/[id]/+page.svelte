<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Clock, Bookmark, BookmarkCheck, ArrowLeft } from "lucide-svelte";
  import Footer from "$lib/components/user/footer.svelte";
  import Contact from "$lib/components/user/contact.svelte";
  import {
    BadgeCheck,
    BadgeAlert,
    TriangleAlert,
    CircleX 
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

  let recipeId = "";
  let recipe: any = null;
  let isLoading = true;
  let saved = false;

  $: recipeId = $page.params.id;

  function triggerToast(message: string, 
        type: "success" | "error" = "success", 
        position: typeof toastPosition = "top-right") {
    toastMessage = message;
    toastType = type;
    showToast = true;
    toastPosition = position;
    
    setTimeout(() => (showToast = false), 3000);
  }

  onMount(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/recipe/${recipeId}`);
      const data = await res.json();
      recipe = data.results;

       const savedRes = await fetch("http://localhost:3000/api/saved", {
        method: "GET",
        credentials: "include"
      });

      const savedData = await savedRes.json();

      const savedList = savedData?.results ?? [];

      saved = savedList.some((r: any) => r._id === recipeId);

    } catch (err) {
      console.error("Failed to load recipe:", err);
    } finally {
      isLoading = false;
    }
  });

  async function toggleSave() {
    const endpoint = saved 
      ? "http://localhost:3000/api/unsave"
      : "http://localhost:3000/api/save";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recipeId })
      });

      const data = await res.json();

      if (!res.ok) {
        triggerToast(data.message || "Something went wrong", "error", "top-center");
        return;
      }

      saved = !saved;

      triggerToast(
      saved
        ? "Recipe added to bookmarks!"
        : "Recipe removed from bookmarks!",
      "success",
      "top-right"
    );

    } catch (err) {
      console.error("Error while saving", err);
      triggerToast("Network error. PLease try again.", "error", "top-center")
    }
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

<!-- LOADING SKELETON -->
{#if isLoading}
<section class="max-w-4xl mx-auto px-4 py-10 animate-pulse">

  <div class="w-full h-80 bg-gray-300 rounded-xl mb-6"></div>

<div class="flex justify-between items-start mb-4">
    <div class="h-8 w-1/2 bg-gray-300 rounded-md"></div>
    <div class="h-8 w-8 bg-gray-300 rounded-md"></div>
</div>

  <div class="h-4 w-3/4 bg-gray-300 rounded mb-4"></div>
  <div class="h-4 w-2/3 bg-gray-300 rounded mb-6"></div>

  <div class="flex gap-3 mb-6">
    <div class="h-6 w-24 bg-gray-300 rounded"></div>
    <div class="h-6 w-20 bg-gray-300 rounded"></div>
    <div class="h-6 w-28 bg-gray-300 rounded"></div>
  </div>

  <div class="bg-white border border-gray-300 rounded-2xl p-6 mb-6">
    <div class="h-6 w-40 bg-gray-300 rounded mb-4"></div>
    {#each Array(5) as _}
      <div class="h-4 w-full bg-gray-200 rounded mb-2"></div>
    {/each}
  </div>

  <div class="bg-white border border-gray-300 rounded-2xl p-6">
    <div class="h-6 w-40 bg-gray-300 rounded mb-4"></div>
    {#each Array(6) as _}
      <div class="h-4 w-full bg-gray-200 rounded mb-3"></div>
    {/each}
  </div>

</section>

{:else if !recipe}
  <div class="text-center py-20 text-red-600">Recipe not found.</div>

{:else}
<!-- RECIPE PAGE -->
<section 
  class="max-w-4xl mx-auto px-4 py-10 opacity-0 animate-fadeIn"
>

  <!-- NAV LINK -->
  <div class="mb-2">
    <button
      class="inline-flex items-center gap-2 px-3 py-2 rounded-lg
            text-gray-700 font-semibold hover:bg-gray-200 transition"
      on:click={() => goto("/user/dashboard")}
      >
      <ArrowLeft size="18" class="text-gray-700"/>
      Back to search
    </button>
  </div>

  <!-- RECIPE IMAGE -->
  <img
    src={recipe.image}
    class="w-full h-80 object-cover rounded-xl mb-6 shadow-md"
  />

  <!-- TITLE AND SAVE BUTTON -->
  <div class="flex justify-between items-center mb-4">
    <h1 class="text-4xl font-semibold">{recipe.title}</h1>

    <button
      class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 
           rounded-lg shadow-sm hover:bg-gray-100 transition"
      on:click={toggleSave}
      >
      {#if saved}
        <BookmarkCheck size="22" class="text-green-600" />
        <span class="text-green-700 font-md">Bookmarked</span>
      {:else}
        <Bookmark size="22" class="text-gray-600" />
        <span class="text-gray-700 font-md">Bookmark</span>
      {/if}
    </button>
  </div>

  <!-- DESCRIPTION -->
  <p class="text-gray-700 text-lg mb-6">{recipe.description}</p>

  <!-- TAGS -->
  <div class="flex flex-wrap gap-3 mb-6">
    <span class="px-3 py-1 text-sm font-semibold bg-gray-200 text-gray-900 rounded-md">
      {recipe.category}
    </span>

    <span class={`px-3 py-1 text-sm font-semibold rounded-md ${difficultyColor(recipe.difficulty)}`}>
      {recipe.difficulty}
    </span>

    <span class="flex items-center gap-2 px-3 py-1 text-md bg-gray-100 rounded-md text-gray-700">
      <Clock size="16" />
      {recipe.estimatedTime}
    </span>
  </div>

  <!-- INGREDIENTS -->
  <div class="bg-white border border-gray-300 rounded-2xl p-6 mb-6 shadow-sm">
    <h3 class="text-2xl mb-4">Ingredients</h3>
    <ul class="list-disc ml-6 space-y-2">
      {#each recipe.ingredients as ing}
        <li class="text-gray-700">{ing}</li>
      {/each}
    </ul>
  </div>

  <!-- INSTRUCTIONS -->
  <div class="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm">
    <h3 class="text-2xl mb-4">Instructions</h3>
    <ol class="list-decimal ml-6 space-y-3">
      {#each recipe.steps as step}
        <li class="text-gray-700 leading-relaxed">{step}</li>
      {/each}
    </ol>
  </div>

</section>
{/if}

<Contact />
<Footer />

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
</style>
