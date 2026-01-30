  <script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import { Sparkles, Clock, Search } from "lucide-svelte";

    const foodImages = [
      "/assets/adobo.png",
      "/assets/sinigang.png",
      "/assets/chicken.png",
      "/assets/arroz-caldo.png",
      "/assets/pancit-palabok.png"
    ];

    type FeaturedRecipe = {
      id: string;
      title: string;
      description: string;
      category: string;
      difficulty: string;
      estimatedTime: string;
      image: string;
      ingredients: string[];
      steps: string[];
      saved: boolean;
    };
    
    let featured: FeaturedRecipe[] = [];
    let idx = 0;
    let currentSrc = foodImages[idx];
    let imgEl: HTMLImageElement;
    let interval: any;

    function swapImage() {
      if (!imgEl) return;

      imgEl.classList.remove("animate-spinInRight");
      imgEl.classList.add("animate-spinOutRight");

      imgEl.addEventListener(
        "animationend",
        () => {
          imgEl.classList.remove("animate-spinOutRight");

          idx = (idx + 1) % foodImages.length;
          currentSrc = foodImages[idx];

          void imgEl.offsetWidth;

          imgEl.classList.add("animate-spinInRight");
        },
        { once: true }
      );
    }
    
    onMount(async () => {
  const res = await fetch("https://recipe-frontend-eta-five.vercel.app/api/recipe/featured", {
    credentials: "include"
  });

  const data = await res.json();

  // Fetch saved list 
  let savedIds: string[] = [];
  try {
    const savedRes = await fetch("https://recipe-frontend-eta-five.vercel.app/api/saved", {
      credentials: "include"
    });
    const savedData = await savedRes.json();
    savedIds = savedData.results.map((r: any) => r._id.toString());
  } catch (e) {}

  // Build final list
  featured = data.results.map((r: any) => ({
    id: r._id.toString(),
    title: r.title,
    category: r.category,
    description: r.description,
    estimatedTime: r.estimatedTime,
    difficulty: r.difficulty,
    image: r.image,
    ingredients: r.ingredients,
    steps: r.steps,
    saved: savedIds.includes(r._id.toString())
  }));
});

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

  onMount(() => {
    interval = setInterval(() => {
      swapImage();
    }, 3000);
  });

  onDestroy(() => clearInterval(interval));
  </script>

<!-- HERO SECTION -->
<section class="bg-[#e4ffdd] min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-12 overflow-hidden">
  <span class="animate-spinOutRight hidden"></span>

  <div class="flex flex-col items-start space-y-6 max-w-xl">
    <h1 class="text-5xl md:text-6xl font-extrabold leading-tight">
      <span class="text-[#115D33]">Discover</span> Delicious
      <span class="text-[#F4A261]">Pinoy Recipes</span>
    </h1>

    <p class="text-gray-700 text-lg md:text-xl leading-relaxed">
      Find easy-to-cook Filipino dishes made from ingredients you already have. 
      Experience the taste of home — simple, authentic, and made for every kitchen.
    </p>

    <div class="flex space-x-4">
      <a 
        href="/user/dashboard"
        class="flex items-center gap-2 bg-[#115D33] text-white px-6 py-3 rounded-xl 
                shadow-md hover:bg-[#0e4b2a] hover:scale-[1.03] transition"
      >
      <Sparkles size="18" class="text-[#eb9dff]" />
      Discover Recipes
      </a>
      <a 
        href="/signin"
        class="border border-[#115D33] text-[#115D33] px-6 py-3 rounded-xl hover:bg-[#115D33] hover:text-white shadow-md hover:shadow-lg transition"
      >
        Sign In
      </a>
    </div>
  </div>

  <div class="mt-10 md:mt-0 md:w-1/2 flex flex-col items-center justify-center">
    <img
      bind:this={imgEl}
      src={currentSrc}
      alt="Delicious Filipino Dish"
      class="w-[420px] h-[420px] object-cover hover:scale-105 transition animate-spinInRight"
    />
  </div>
</section>

<!-- HOW IT WORKS SECTION -->
<section class="bg-[#FFF7EC] py-20 px-8 md:px-16 lg:px-32 text-center">
    <h2 class="text-4xl md:text-5xl font-semibold text-[#000000] mb-10">
      How It Works
    </h2>

    <p class="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
      Discover what to cook in just a few steps no stress, no guesswork. 
      Our smart recipe finder helps you make the most of what you already have.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div class="bg-[#ececec] border border-gray-300 rounded-2xl p-8 shadow-md hover:scale-105 transition">
        <img src="/assets/ingredients.png" alt="Ingredients" class="w-20 mx-auto mb-6">
        <h3 class="text-2xl text-[#000000] mb-3">1. Enter Ingredients</h3>
        <p class="text-gray-600">Type ingredients you have on hand from rice and eggs to adobo mix!</p>
      </div>

      <div class="bg-[#ececec] border border-gray-300 rounded-2xl p-8 shadow-md hover:scale-105 transition">
        <img src="/assets/ai.png" alt="AI Suggestion" class="w-20 mx-auto mb-6">
        <h3 class="text-2xl text-[#000000] mb-3">2. Let AI Suggest</h3>
        <p class="text-gray-600">Our AI scans Filipino recipes and finds dishes that match your available ingredients.</p>
      </div>

      <div class="bg-[#ececec] border border-gray-300 rounded-2xl p-8 shadow-md hover:scale-105 transition">
        <img src="/assets/bento.png" alt="Cook and Enjoy" class="w-20 mx-auto mb-6">
        <h3 class="text-2xl text-[#000000] mb-3">3. Cook and Enjoy</h3>
        <p class="text-gray-600">Follow the easy recipe steps and enjoy a home-cooked Filipino meal!</p>
      </div>
    </div>
</section>

<!-- FEATURED SECTION -->
<section class="bg-[#dff3df] py-20 px-8 md:px-16 lg:px-32">
  <h2 class="text-4xl md:text-5xl font-semibold text-[#000000] text-center mb-10">
    Featured Recipes
  </h2>

  <p class="text-gray-600 text-lg max-w-2xl mx-auto text-center mb-12">
    AI-powered recipe ideas for common home ingredients.
  </p>

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 
              mx-auto max-w-6xl">

    {#each featured as item}
      <div class="bg-white border border-gray-300 rounded-2xl shadow-md 
                  overflow-hidden hover:scale-[1.03] transition cursor-pointer 
                  w-full max-w-sm mx-auto"
                  on:click={() => openRecipePage(item.id)}>

        <!-- IMAGE -->
        <img src={item.image} class="w-full h-64 object-cover"/>

        <div class="p-5">
          <!-- BADGES -->
          <div class="flex gap-2 mb-3">
            <span class="px-3 py-1 text-xs rounded-md bg-[#ececec] text-[#000000]">
              {item.category}
            </span>

            <span class={`px-3 py-1 text-xs rounded-md ${difficultyColor(item.difficulty)}`}>
              {item.difficulty}
            </span>
          </div>

          <!-- TITLE -->
          <h3 class="text-xl text-[#000000] font-semibold mb-1">
            {item.title}
          </h3>

          <!-- DESCRIPTION -->
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          <!-- ESTIMATED TIME -->
          <div class="flex items-center text-gray-500 text-sm gap-1">
            <Clock size="14" />
            <span>{item.estimatedTime}</span>
          </div>
        </div>
      </div>
    {/each}

  </div>

  <div class="mt-12 text-center">
    <a href="/user/dashboard" 
      class="inline-flex items-center gap-2 bg-[#115D33] text-white px-6 py-3 rounded-xl 
           shadow-md hover:bg-[#0e4b2a] hover:scale-[1.03] transition-transform transition-colors">
        <Search size="18" class="text-white" />
        Find Recipes
    </a>
  </div>
</section>

<style>
  /* EXIT: spin + slide right */
@keyframes spinOutRight {
  0%   { opacity: 1; transform: translateX(0) rotate(0deg); }
  100% { opacity: 0; transform: translateX(200px) rotate(180deg); }
}

  /* ENTER: spin + slide from right */
@keyframes spinInRight {
  0%   { opacity: 0; transform: translateX(200px) rotate(180deg); }
  100% { opacity: 1; transform: translateX(0) rotate(0deg); }
}

  .animate-spinOutRight { animation: spinOutRight 800ms ease both; }
  .animate-spinInRight  { animation: spinInRight 700ms ease both; }

section {
  transition: background-color 0.6s ease;
}
</style>
