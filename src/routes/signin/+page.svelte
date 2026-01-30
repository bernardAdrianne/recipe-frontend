<script lang="ts">
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';
  import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowLeft,
    BadgeCheck,
    BadgeAlert
  } from "lucide-svelte";
  import { isLoggedIn } from "../../lib/stores/userStore.js";

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

  let showPassword = false;
  let email = "";
  let password = "";
  let loading = false;
  let errorMessage = "";
 
  function triggerToast(message: string, 
        type: "success" | "error" = "success", 
        position: typeof toastPosition = "top-right") {
    toastMessage = message;
    toastType = type;
    showToast = true;
    toastPosition = position;
    
    setTimeout(() => (showToast = false), 3000);
  }

  function navigateToSignup() {
    goto('/signup');
  }

  async function handleLogin(event: Event) {
    event.preventDefault();
    try {
      loading = true;
      showToast = false;

      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        isLoggedIn.set(true);
        triggerToast("Logged in successfully!", "success", "top-center");

        localStorage.removeItem('guestSearchCount');
        setTimeout(() => goto('/user/home'), 1500);
      } else {
        throw new Error(data.message || 'Signin failed');
      }
    } catch (err) {
      if (err instanceof Error) {
        triggerToast(err.message, "error", "top-center");
    }
    } finally {
      loading = false;
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

<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 relative">
  <!-- Blob background in container -->
<!-- Top-left large blob -->
<svg class="fixed -top-52 -left-64 w-[600px] h-[600px] z-0 opacity-90" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#00B75A" d="M64.2,-19C73.3,7.2,64.1,41.3,42.9,56.1C21.6,70.8,-11.5,66.1,-35.9,48.6C-60.3,31.1,-75.9,0.7,-68.4,-23.2C-61,-47.1,-30.5,-64.6,-1.5,-64.1C27.5,-63.6,55.1,-45.2,64.2,-19Z" transform="translate(100 100)" />
</svg>

<!-- Top-right small blob -->
<svg class="fixed -top-3 -right-1 w-[500px] h-[500px] z-0 opacity-50" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#00B75A" d="M41.9,-16.9C47.4,3.2,40.1,24.2,24.5,36C9,47.9,-14.9,50.6,-33.6,38.7C-52.4,26.9,-66.1,0.5,-59.7,-21C-53.2,-42.5,-26.6,-59.1,-4.2,-57.8C18.2,-56.4,36.4,-37.1,41.9,-16.9Z" transform="translate(100 100)" />
</svg>

<!-- Bottom blob large -->
<svg class="fixed -bottom-[200px] -right-40 w-[700px] h-[700px] z-0 opacity-100" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path fill="#00964F" d="M57,-43.7C72.4,-26.2,82.4,-2.5,77.7,17.6C73,37.7,53.6,54.3,31,65.6C8.5,76.9,-17.2,83,-37.7,74.5C-58.2,66.1,-73.4,43.2,-78.1,19C-82.7,-5.2,-76.6,-30.7,-61.8,-48.1C-47,-65.4,-23.5,-74.6,-1.3,-73.5C20.8,-72.5,41.6,-61.1,57,-43.7Z" transform="translate(100 100)" />
</svg>

  <!-- NAV LINK / Breadcrumb on top of container -->
  <div class="w-full max-w-5xl mb-4 flex items-center gap-2">
    <button
      class="flex items-center gap-1 text-gray-700 font-semibold hover:bg-gray-200 transition px-3 py-2 rounded-lg"
      on:click={() => goto("/user/dashboard")}
    >
      <ArrowLeft size="18" /> Dashboard
    </button>
    <span class="text-gray-400">/ Signup</span>
  </div>

  <!-- CONTAINER -->
  <div class="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">
    <!-- LEFT SIDE: FORM -->
    <div class="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center relative z-10 overflow-hidden">
      <form class="w-full max-w-md space-y-6 relative z-10" on:submit|preventDefault={handleLogin}>

        <!-- Welcome Text -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p class="text-gray-600 mt-1">Sign in to continue to your ReciPinoy account</p>
        </div>

        <!-- Email Input -->
        <div class="relative">
          <Mail class="absolute left-3 top-[20px] text-gray-400 w-5 h-5" />
          <input
            type="email"
            bind:value={email}
            placeholder="Email Address"
            required
            class="pl-10 w-full p-4 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>

        <!-- Password Input -->
        <div class="relative">
          <Lock class="absolute left-3 top-[20px] text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            bind:value={password}
            placeholder="Password"
            required
            class="pl-10 w-full p-4 rounded-xl border border-gray-300 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {#if password}
            <button
              type="button"
              class="absolute inset-y-0 right-3 flex items-center"
              on:click={() => (showPassword = !showPassword)}
            >
              {#if showPassword}
                <EyeOff class="w-5 h-5 text-gray-400" />
              {:else}
                <Eye class="w-5 h-5 text-gray-400" />
              {/if}
            </button>
          {/if}
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          disabled={loading}
          class="w-full bg-green-600 hover:bg-green-700 text-white font-medium p-4 rounded-xl shadow-md transition duration-200"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>

        <!-- Bottom Text -->
        <p class="text-center text-sm text-gray-500 mt-6">
          Don’t have an account? 
          <span class="text-green-700 font-semibold cursor-pointer hover:underline" on:click={navigateToSignup}>
            Sign Up
          </span>
        </p>

      </form>
    </div>

    <!-- RIGHT SIDE: IMAGE -->
    <div class="hidden md:flex w-full md:w-1/2 relative overflow-hidden z-10">
      <!-- Food Image -->
      <img src="/assets/pork-adobo.jpg" alt="Food 1" class="w-full h-full object-cover scale-105" />
      <div class="absolute inset-0 bg-black/30"></div>

      <!-- Branding top-left -->
      <div class="absolute top-6 left-6 flex flex-col text-left px-4">
        <h1 class="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700">
          ReciPinoy
        </h1>
        <p class="text-white/90 mt-1 text-lg drop-shadow-md">Delicious recipes await you!</p>
      </div>
    </div>

  </div>
</div>
