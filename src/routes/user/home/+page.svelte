  <script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { goto } from "$app/navigation";
    import { isLoggedIn } from "$lib/stores/userStore.js";
    import { 
      Sparkles, 
      Clock, 
      Search, 
      ArrowRight, 
    } 
      from "lucide-svelte";

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
    let interval: any;

    onMount(async () => {
  const res = await fetch("https://airecipe-backend-2.onrender.com/recipe/featured", {
    credentials: "include"
  });

  const data = await res.json();

  // Fetch saved list 
  let savedIds: string[] = [];
  try {
    const savedRes = await fetch("https://airecipe-backend-2.onrender.com/saved", {
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

  onDestroy(() => clearInterval(interval));
  </script>

<!-- HERO SECTION -->
<section class="relative min-h-[75vh] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-12 overflow-hidden">
  <!-- Video Background -->
  <div class="absolute inset-0 w-full h-full">
    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-black/50 z-10"></div>
    
    <!-- Video -->
    <video
      autoplay
      muted
      loop
      playsinline
      class="w-full h-full object-cover"
    >
      <source src="/assets/homebg.mp4" type="video/mp4">
      <!-- Fallback  -->
      Your browser does not support the video tag.
    </video>
  </div>

  <span class="animate-spinOutRight hidden"></span>

  <!-- Content  -->
  <div class="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row items-center justify-between">
      <!-- Left content -->
       
      <div class="flex flex-col items-start space-y-6 max-w-xl text-white">
        <p class="inline-flex items-center gap-2 bg-amber-200/10 backdrop-blur-sm border border-amber-500/30 
          rounded-full px-4 py-2 text-amber-400 text-sm font-semibold">
          <Sparkles size="16" class="text-amber-400" />
          Filipino Recipe Generator
        </p>
        <h1 class="text-5xl md:text-6xl font-extrabold leading-tight">
          <span class="">Discover</span> Delicious
          <span class="text-amber-500">Pinoy</span> Recipes
        </h1>

        <p class="text-gray-300 text-lg md:text-xl leading-relaxed">
          Find easy-to-cook Filipino dishes made from ingredients you already have. 
          Experience the taste of home simple, authentic, and made for every kitchen.
        </p>
        
        <div class="flex space-x-4">
          {#if $isLoggedIn}
          <a 
            href="/user/dashboard"
            class="flex items-center gap-2 bg-[#f59e0b] font-semibold text-black px-6 py-3 rounded-lg 
                    shadow-md hover:bg-[#fbbf24] hover:scale-[1.03] transition"
          >
          Discover Recipes
          <ArrowRight size="18" class="text-[#000000]"/>
          </a>
          {:else}
          <a 
            href="/user/dashboard"
            class="flex items-center gap-2 bg-[#f59e0b] font-semibold text-black px-6 py-3 rounded-lg
                    shadow-md hover:bg-[#fbbf24] hover:scale-[1.03] transition"
          >
          Discover Recipes
          <ArrowRight size="18" class="text-[#000000]"/>
          </a>
          <a
            on:click={() => goto("/signin")}
            class="border-2 border-[rgb(255,255,255, 0.6)] text-white/90 px-6 py-3 rounded-lg bg-transparent 
                    hover:bg-white/20 hover:text-white 
             hover:border-white
             hover:shadow-lg 
             transition-all duration-300 
             cursor-pointer"
          >
            Sign In
          </a>
          {/if}
        </div>
      </div>

      <!-- Right side (can be empty or have decorative element) -->
      <div class="hidden md:block md:w-1/2"></div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS SECTION - Gradient Cards -->
<section class="bg-white py-20 px-8 md:px-16 lg:px-32 text-center">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-bold text-[#0f1b2d] mb-5">
            How it Works
        </h2>

        <p class="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
            Discover what to cook in just a few steps
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="group relative overflow-hidden bg-white
                        border border-gray-200 rounded-2xl p-8 shadow-sm
                        hover:shadow-xl hover:border-gray-600 hover:-translate-y-1 
                        transition-all duration-100">
                <div class="relative">
                    <div class="w-20 h-20 bg-[#0f1b2d] rounded-2xl flex items-center justify-center mx-auto mb-6 
                                rotate-3 group-hover:rotate-6 transition-transform duration-100">
                        <img src="/assets/vegetables.png" alt="Ingredients" class="w-10 h-10 object-contain filter brightness-0 invert">
                    </div>
                    <div class="inline-flex items-center justify-center w-8 h-8 bg-[#0f1b2d] text-white 
                                rounded-full text-sm font-bold mb-4">
                        1
                    </div>
                    <h3 class="text-2xl font-bold text-[#0f1b2d] mb-3">
                        Enter Ingredients
                    </h3>
                    <p class="text-gray-500 leading-relaxed">
                        Type ingredients you have on hand — from rice and eggs to adobo mix!
                    </p>
                </div>
            </div>

            <!-- Step 2 -->
            <div class="group relative overflow-hidden bg-white
                        border border-gray-200 rounded-2xl p-8 shadow-sm
                        hover:shadow-xl hover:border-gray-600 hover:-translate-y-1 
                        transition-all duration-100">
                <div class="relative">
                    <div class="w-20 h-20 bg-[#0f1b2d] rounded-2xl flex items-center justify-center mx-auto mb-6 
                                rotate-3 group-hover:rotate-6 transition-transform duration-100">
                        <img src="/assets/cog.png" alt="AI Suggestion" class="w-10 h-10 object-contain filter brightness-0 invert">
                    </div>
                    <div class="inline-flex items-center justify-center w-8 h-8 bg-[#0f1b2d] text-white 
                                rounded-full text-sm font-bold mb-4">
                        2
                    </div>
                    <h3 class="text-2xl font-bold text-[#0f1b2d] mb-3">
                        Let AI Suggest
                    </h3>
                    <p class="text-gray-500 leading-relaxed">
                        Scans Filipino recipes and finds dishes that match your available ingredients
                    </p>
                </div>
            </div>

            <!-- Step 3 -->
            <div class="group relative overflow-hidden bg-white
                        border border-gray-200 rounded-2xl p-8 shadow-sm 
                        hover:shadow-xl hover:border-gray-600 hover:-translate-y-1 
                        transition-all duration-100">

                <div class="relative">
                    <div class="w-20 h-20 bg-[#0f1b2d] rounded-2xl flex items-center justify-center mx-auto mb-6 
                                rotate-3 group-hover:rotate-6 transition-transform duration-100">
                        <img src="/assets/meal.png" alt="Cook and Enjoy" class="w-10 h-10 object-contain filter brightness-0 invert">
                    </div>
                    <div class="inline-flex items-center justify-center w-8 h-8 bg-[#0f1b2d] text-white 
                                rounded-full text-sm font-bold mb-4">
                        3
                    </div>
                    <h3 class="text-2xl font-bold text-[#0f1b2d] mb-3">
                        Cook and Enjoy
                    </h3>
                    <p class="text-gray-500 leading-relaxed">
                        Follow the easy recipe steps and enjoy a home-cooked Filipino meal!
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- STATS SECTION -->
<section class="bg-[#0f1b2d] py-16">
  <div class="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div>
      <div class="text-4xl md:text-5xl font-bold text-amber-500 mb-2">100+</div>
      <div class="text-white/80">Filipino Recipes</div>
    </div>
    <div>
      <div class="text-4xl md:text-5xl font-bold text-amber-500 mb-2">0</div>
      <div class="text-white/80">Happy Cooks</div>
    </div>
    <div>
      <div class="text-4xl md:text-5xl font-bold text-amber-500 mb-2">0</div>
      <div class="text-white/80">Users</div>
    </div>
    <div>
      <div class="text-4xl md:text-5xl font-bold text-amber-500 mb-2">15min</div>
      <div class="text-white/80">Average Prep Time</div>
    </div>
  </div>
</section>

<!-- FEATURED SECTION -->
<section class="bg-white py-20 px-8 md:px-16 lg:px-32">
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-12">
      <div class="inline-flex items-center gap-2 bg-amber-200/20 backdrop-blur-sm border border-amber-500/30 
                    rounded-full px-4 py-1.5 text-amber-600 text-sm font-semibold mb-4">
        <Sparkles size="14" class="text-amber-500" />
        Recommended for You
      </div>
      <h2 class="text-4xl font-bold text-[#0f1b2d] mb-5">
        Featured Recipes
      </h2>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto">
        Recipe recommendations for common home ingredients
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {#each featured as item}
        <div class="group bg-white rounded-2xl overflow-hidden shadow-sm 
                    hover:shadow-xl hover:-translate-y-1 transition-all duration-100 
                    cursor-pointer border border-gray-200"
                    on:click={() => openRecipePage(item.id)}>

          <!-- IMAGE WITH OVERLAY -->
          <div class="relative overflow-hidden h-64">
            <img 
              src={item.image} 
              alt={item.title}
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-4 left-4 right-4">
                <span class="text-white text-sm font-medium">Click to view recipe →</span>
              </div>
            </div>
            <!-- Time Badge -->
            <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
              <div class="flex items-center gap-1 text-white text-xs">
                <Clock size="12" />
                <span>{item.estimatedTime}</span>
              </div>
            </div>
          </div>

          <div class="p-5">
            <!-- BADGES -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                {item.category}
              </span>
              <span class={`px-3 py-1 text-xs font-medium rounded-full ${difficultyColor(item.difficulty)}`}>
                {item.difficulty}
              </span>
            </div>

            <!-- TITLE -->
            <h3 class="text-xl font-bold text-[#0f1b2d] mb-2 group-hover:text-[#1a2d47]
                       transition-colors duration-300 line-clamp-1">
              {item.title}
            </h3>

            <!-- DESCRIPTION -->
            <p class="text-gray-500 text-sm mb-4 line-clamp-2">
              {item.description}
            </p>

            <!-- READ MORE LINK -->
            <div class="flex items-center justify-between">
              <span class="text-amber-600 text-sm font-semibold group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                View Recipe
                <ArrowRight size="14" class="group-hover:translate-x-1 transition-transform" />
              </span>           
            </div>
          </div>
        </div>
      {/each}
    </div>

    <div class="mt-12 text-center">
      <a href="/user/dashboard" 
        class="inline-flex items-center gap-2 bg-amber-500 text-white px-8 py-4 rounded-xl 
               font-semibold shadow-lg hover:bg-amber-600 hover:scale-[1.03] 
               transition-all duration-300 group">
        <Search size="18" class="text-white" />
        Find Recipes
        <ArrowRight size="18" class="group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  </div>
</section>

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>