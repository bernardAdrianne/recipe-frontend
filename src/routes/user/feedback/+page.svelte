<script lang="ts">
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import {
    MessageSquareOff,
    MessageSquare,
    ChefHat,
    Send,
    Star,
    ImageDown,
    Camera,
    X,
    BadgeCheck,
    BadgeAlert,
    TriangleAlert,
    CircleX,
    Loader
  } from "lucide-svelte";

  let sortBy: "all" | "newest" | "stars_desc" | "stars_asc" = "newest";
  let name = "";
  let rating = 0;
  let feedback = "";
  let experience = "";
  let uploadedImageURL: File | null = null;
  let uploadedImagePrev: string | null = null;

  let communityFeedback: any[] = [];
  let submitting = false;

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

  // Infinite scroll state
  let page = 1;
  let hasMore = true;
  let loadingMore = false;
  let observerTarget: HTMLDivElement;

   // Modal for full-screen image
  let showImageModal = false;
  let modalImageSrc = "";

  function handleImageUpPr(e: any) {
    const file = e.target.files?.[0] || null;
    uploadedImageURL = file;
    if (file) {
      uploadedImagePrev = URL.createObjectURL(file);
    } else {
      uploadedImagePrev = null;
    }
  }

  function removeUploadedImage() {
    uploadedImageURL = null;
    uploadedImagePrev = null;
  }

  function openImageModal(src: string) {
    modalImageSrc = src;
    showImageModal = true;
  }
  
  function closeImageModal() {
    showImageModal = false;
    modalImageSrc = "";
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function selectRating(v: number) {
    rating = v;
  }

  function triggerToast(message: string, 
        type: "success" | "error" = "success", 
        position: typeof toastPosition = "top-right") {
    toastMessage = message;
    toastType = type;
    showToast = true;
    toastPosition = position;
    
    setTimeout(() => (showToast = false), 3000);
  }

async function loadFeedback(reset = false) {
  if (loadingMore || (!hasMore && !reset)) return;

  if (reset) {
    page = 1;
    communityFeedback = [];
    hasMore = true;
  }

  loadingMore = true;

  try {
    let url = `https://recipe-frontend-eta-five.vercel.app/api/feedback/all?page=${page}`;

    if (sortBy === "all") {
      url = `https://recipe-frontend-eta-five.vercel.app/api/feedback/all`;
    } else {
      url += `&limit=6&sort=${sortBy}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      hasMore = false;
    } else {
      if (sortBy === "all") {
        communityFeedback = data.results;
        hasMore = false;
      } 
      else {
        communityFeedback = [...communityFeedback, ...data.results];
        page++;
      }
    }

  } catch (e) {
    console.error(e);
  } finally {
    loadingMore = false;
  }
}

  async function submitFeedback() {
    if (rating === 0 || !feedback.trim()) {
      triggerToast("Please provide a rating and feedback.", "error", "top-center");
      return;
    }

    submitting = true;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("rate", rating.toString());
      formData.append("feedback", feedback);
      formData.append("exp", experience);

      if (uploadedImageURL) {
        formData.append("image", uploadedImageURL);
      }

      const res = await fetch("http://localhost:3000/api/feedback/create", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      triggerToast("Feedback submitted successfully!", "success", "top-right");

      name = "";
      rating = 0;
      feedback = "";
      experience = "";
      uploadedImageURL = null;
      uploadedImagePrev = null;

      loadFeedback(true);
    } catch (err) {
      console.error(err);
      triggerToast("Something went wrong.", "error", "top-center");
    } finally {
      submitting = false;
    }
  }

  onMount(() => {
    loadFeedback();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadFeedback();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget) observer.observe(observerTarget);
    return () => observer.disconnect();
  });
</script>

<!-- TOAST -->
{#if showToast}

  <div
    
    class={`
      flex gap-2 fixed z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
      transition-all duration-300

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
        <TriangleAlert class="w-5 h-5 text-white" />
      {/if  }

      <!-- MESSAGE -->
      <span>{toastMessage}</span>
  </div>
{/if}

<!-- IMAGE MODAL -->
{#if showImageModal}
  <div
    class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 cursor-pointer"
    on:click={closeImageModal}
    transition:fade
  >
    <img
      src={modalImageSrc}
      alt="Full Screen Image"
      class="max-h-[90vh] max-w-[90vw] rounded-xl shadow-lg"
      transition:scale={{ duration: 200 }}
    />
  </div>
{/if}

<section class="max-w-7xl mx-auto px-4 py-8">

  <!-- HEADER -->
  <div class="flex mt-6 gap-2 items-center">
    <MessageSquare size="42" class="bg-green-200 rounded-full p-2"/>
    <h1 class="text-4xl">Community Feedback</h1>
  </div>

  <p class="text-2xl text-gray-600">
    See what our community is cooking and share your own culinary adventures!
  </p>

  <!-- MAIN LAYOUT -->
  <div class="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-10 mt-8">

 <!-- FORM -->
<div class="md:sticky md:top-6 self-start">
  <form class="bg-white border border-gray-300 rounded-xl p-5 space-y-4">

    <!-- HEADER -->
    <div class="flex items-center gap-2">
      <ChefHat size="20" class="text-green-700"/>
      <h2 class="text-md font-semibold">Share your Story</h2>
    </div>

    <!-- NAME -->
    <div class="space-y-1.5">
      <p class="font-semibold text-sm text-gray-800">
        Your Name <span class="text-gray-400">(Optional)</span>
      </p>
      <input
        bind:value={name}
        placeholder="Enter your name (or stay anonymous)"
        class="bg-gray-100 focus:bg-white border border-transparent
               focus:border-green-400 rounded-md px-3 py-2
               w-full text-sm outline-none transition"
      />
    </div>

    <!-- RATE -->
    <div class="space-y-1.5">
      <p class="font-semibold text-sm text-gray-800">
        Rating
        {#if rating === 0}
          <span class="text-red-500">*</span>
        {/if}
      </p>

      <div class="flex gap-1.5">
        {#each [1,2,3,4,5] as star}
          <button type="button" on:click={() => selectRating(star)}>
            <Star
              size="22"
              class="transition-transform hover:scale-110"
              fill={rating >= star ? "#facc15" : "none"}
              stroke={rating >= star ? "#facc15" : "#d1d5db"}
            />
          </button>
        {/each}
      </div>
    </div>

    <!-- FEEDBACK -->
    <div class="space-y-1.5">
      <p class="font-semibold text-sm text-gray-800">
        Your Feedback
        {#if !feedback}
          <span class="text-red-500">*</span>
        {/if}
      </p>
      <input
        bind:value={feedback}
        placeholder="Tell us what you think about ReciPinoy..."
        class="bg-gray-100 focus:bg-white border border-transparent
               focus:border-green-400 rounded-md px-3 py-2
               w-full text-sm outline-none transition"
      />
    </div>

    <!-- EXPERIENCE -->
    <div class="space-y-1.5">
      <p class="font-semibold text-sm text-gray-800">
        Your Cooking Experience <span class="text-gray-400">(Optional)</span>
      </p>
      <input
        bind:value={experience}
        placeholder="Beginner, home cook, or food enthusiast?"
        class="bg-gray-100 focus:bg-white border border-transparent
               focus:border-green-400 rounded-md px-3 py-2
               w-full text-sm outline-none transition"
      />
    </div>

    <!-- IMAGE UPLOAD -->
    <div class="space-y-1.5">
  <p class="font-semibold text-sm text-gray-800">
    Image Upload <span class="text-gray-400">(Optional)</span>
  </p>

  {#if uploadedImagePrev}
    <div class="relative h-24 w-full rounded-md overflow-hidden border border-gray-300">
      <img
        src={uploadedImagePrev}
        alt="Uploaded Preview"
        class="h-full w-full object-cover"
      />
      <button
        type="button"
        on:click={removeUploadedImage}
        class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 transition"
      >
        <X size="16"/>
      </button>
    </div>
  {:else}
    <label
      for="imageUpload"
      class="bg-gray-100 hover:bg-gray-200 border border-dashed
             border-gray-400 rounded-md h-24 w-full
             flex items-center justify-center cursor-pointer
             transition"
    >
      <ImageDown size="40" class="text-gray-600"/>
    </label>
  {/if}

    <input
      id="imageUpload"
      type="file"
      accept="image/*"
      class="hidden"
      on:change={handleImageUpPr}
    />

    <!-- SUBMIT -->
    <button
      type="button"
      disabled={submitting}
      on:click={submitFeedback}
      class="flex items-center justify-center gap-2 bg-green-600
           hover:bg-green-700 text-white text-sm font-semibold
            rounded-md py-2.5 w-full mt-4 transition disabled:opacity-70 disabled:cursor-not-allowed"
    >
  {#if submitting}
  <!-- SPINNER -->
  <Loader
    class="w-5 h-5 animate-spin text-white"
    aria-label="Loading"
  />

  <span>Searching...</span>
  {:else}
    <Send size="16" />
    Submit Feedback
  {/if}
    </button>

  </form>
</div>


  <!-- RECENT STORIES -->
    <div class="flex flex-col">

      <div class="flex items-center justify-between mb-3">
        <h1 class="text-2xl">Recent Stories</h1>
        <div class="flex items-center gap-3 text-gray-600">
          <!-- CAMERA -->
            <div class="flex items-center gap-2">
              <Camera size="18"/>
                <p>{communityFeedback.length} Community posts</p>
            </div>
          <!-- SORT -->
            <select
              bind:value={sortBy}
              on:change={() => loadFeedback(true)}
              class="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
            >
              <option value="all">All Posts</option>
              <option value="newest">Newest</option>
              <option value="stars_desc">⭐ Highest Rated</option>
              <option value="stars_asc">⭐ Lowest Rated</option>
            </select>
        </div>
      </div>

      {#if communityFeedback.length === 0}
        <div class="bg-white border border-gray-300 rounded-2xl min-h-[60vh]
                    flex flex-col items-center justify-center text-center gap-4">
          <MessageSquareOff size="60" class="text-gray-400"/>
          <p class="font-semibold text-lg">No Feedback yet</p>
          <p class="text-gray-500 text-sm">
            Be the first to share your cooking experience!
          </p>
        </div>
      {:else}
        <!-- SCROLL CONTAINER (NO EXTRA BORDERS) -->
        <div class="grid gap-6 overflow-y-auto pr-2" style="max-height: 75vh;">
          {#each communityFeedback as post}
            <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">

              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold text-gray-900">
                    {post.name || "Anonymous"}
                  </h3>
                  <p class="text-xs text-gray-400">
                    {formatDate(post.createdAt)}
                  </p>
                </div>

                <div class="flex gap-1">
                  {#each [1,2,3,4,5] as star}
                    <Star
                      size="16"
                      fill={post.rate >= star ? "#facc15" : "none"}
                      stroke={post.rate >= star ? "#facc15" : "#d1d5db"}
                    />
                  {/each}
                </div>
              </div>

              <p class="text-sm text-gray-700 mt-4">
                {post.feedback}
              </p>

              {#if post.image}
                <div class="mt-4 h-44 w-full overflow-hidden rounded-xl">
                  <img
                    src={post.image}
                    alt="Community Recipe Image"
                    class="h-full w-full object-cover cursor-pointer
                          transition-transform duration-300 ease-in-out
                          hover:scale-105"
                    on:click={() => openImageModal(post.image)}
                  />
                </div>
              {/if}

              {#if post.exp}
                <div class="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p class="flex gap-1 text-xs font-semibold text-green-700 mb-1">
                    <MessageSquare size="16"/>
                    Cooking Experience
                  </p>
                  <p class="text-sm text-gray-700">
                    {post.exp}
                  </p>
                </div>
              {/if}

            </div>
          {/each}

          {#if hasMore && sortBy !== "all"}
            <div
              bind:this={observerTarget}
              class="text-center py-4 text-gray-400 text-sm"
            >
              Loading more stories...
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  
</section>
