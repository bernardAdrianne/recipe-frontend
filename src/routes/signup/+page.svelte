<script lang="ts">
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    ArrowLeft,
    BadgeCheck,
    BadgeAlert
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

  let showPassword = false;
  let username = "";
  let email = "";
  let password = "";
  let loading = false;

  function triggerToast(message: string, 
        type: "success" | "error" = "success", 
        position: typeof toastPosition = "top-right") {
    toastMessage = message;
    toastType = type;
    showToast = true;
    toastPosition = position;
    
    setTimeout(() => (showToast = false), 3000);
  }

  async function handleRegister(event: Event) {
    event.preventDefault();
    if (password.length < 6) {
      triggerToast("Password must be at least 6 characters.", "error", "top-center");
      return;
    }
    try {
      loading = true;

      const res = await fetch('https://airecipe-backend-2.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();
      if (res.ok) {
        triggerToast("Account created successfully!", "success", "top-center");
        await tick();
        setTimeout(() => goto('/signin'), 2000);
        localStorage.removeItem('guestSearchCount');
      } else {
        throw new Error(data.message || 'Signup failed');
      }
    } catch (err) {
      if (err instanceof Error) {
        triggerToast(err.message, "error", "top-center");
      }
    } finally {
      loading = false;
    }
  }

  function navigateToSignin() {
    goto('/signin');
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
    <span class="text-gray-400">/ Signin</span>
  </div>

  <!-- CONTAINER -->
  <div class="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-5xl flex flex-col md:flex-row">

    <!-- LEFT SIDE: FORM -->
    <div class="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
      <form class="w-full max-w-md space-y-6" on:submit|preventDefault={handleRegister}>

        <!-- Welcome text -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Welcome!</h2>
          <p class="text-gray-600 mt-1">Let's get started with your ReciPinoy account</p>
        </div>

        <!-- Inputs -->
        <div class="relative">
          <User class="absolute left-3 top-[20px] text-gray-400 w-5 h-5" />
          <input type="text" placeholder="Username" bind:value={username} required
            class="pl-10 border border-gray-300 rounded-xl p-4 w-full focus:ring-2 focus:ring-green-500 focus:outline-none" />
        </div>

        <div class="relative">
          <Mail class="absolute left-3 top-[20px] text-gray-400 w-5 h-5" />
          <input type="email" placeholder="Email" bind:value={email} required
            class="pl-10 border border-gray-300 rounded-xl p-4 w-full focus:ring-2 focus:ring-green-500 focus:outline-none" />
        </div>

        <div class="relative">
          <Lock class="absolute left-3 top-[20px] text-gray-400 w-5 h-5" />
          <input type={showPassword ? "text" : "password"} placeholder="Password" bind:value={password} required
            class="pl-10 border border-gray-300 rounded-xl p-4 w-full focus:ring-2 focus:ring-green-500 focus:outline-none" />
          {#if password}
            <button type="button" class="absolute inset-y-0 right-3 flex items-center" on:click={() => showPassword = !showPassword}>
              {#if showPassword} <EyeOff class="w-5 h-5 text-gray-400" /> {:else} <Eye class="w-5 h-5 text-gray-400" /> {/if}
            </button>
          {/if}
        </div>

        <!-- Terms & Conditions -->
        <div class="flex items-center space-x-2">
          <input type="checkbox" id="terms" required class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500" />
          <label for="terms" class="text-gray-600 text-sm">
            I agree to the <span class="underline cursor-pointer">Terms of Service</span> and <span class="underline cursor-pointer">Privacy Policy</span>.
          </label>
        </div>

        <!-- Submit -->
        <button type="submit" disabled={loading}
          class="w-full bg-green-600 hover:bg-green-700 text-white font-medium p-4 rounded-xl shadow-md transition duration-200">
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p class="text-sm text-center text-gray-500">
          Already have an account? 
          <span class="text-green-700 cursor-pointer font-semibold" on:click={navigateToSignin}>Sign in</span>
        </p>
      </form>
    </div>

    <!-- RIGHT SIDE: IMAGE WITH BRANDING -->
    <div class="hidden md:flex w-full md:w-1/2 relative overflow-hidden">
      <!-- Background image -->
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
