<script lang="ts">
  import { goto } from '$app/navigation';
  import { tick } from 'svelte';
  import { fly } from 'svelte/transition';

  import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    BadgeCheck,
    BadgeAlert
  } from 'lucide-svelte';

  import { isLoggedIn } from '$lib/stores/userStore.js';

  /* ---------------- STATE ---------------- */

  let authMode: 'signin' | 'signup' = 'signin';

  let showPassword = false;

  let username = '';
  let email = '';
  let password = '';

  let loading = false;

  /* ---------------- TOAST ---------------- */

  let toastMessage = '';
  let showToast = false;

  let toastType: 'success' | 'error' = 'success';

  function triggerToast(
    message: string,
    type: 'success' | 'error' = 'success'
  ) {
    toastMessage = message;
    toastType = type;
    showToast = true;

    setTimeout(() => {
      showToast = false;
    }, 3000);
  }

  /* ---------------- MODE SWITCH ---------------- */

  function switchMode(mode: 'signin' | 'signup') {
    authMode = mode;

    // Clear fields
    password = '';
  }

  /* ---------------- LOGIN ---------------- */

  async function handleLogin() {
    try {
      loading = true;

      const res = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signin failed');
      }

      isLoggedIn.set(true);

      triggerToast('Logged in successfully!', 'success');

      localStorage.removeItem('guestSearchCount');

      setTimeout(() => {
        goto('/user/home');
      }, 1500);

    } catch (err) {
      if (err instanceof Error) {
        triggerToast(err.message, 'error');
      }
    } finally {
      loading = false;
    }
  }

  /* ---------------- REGISTER ---------------- */

  async function handleRegister() {
    if (password.length < 6) {
      triggerToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      loading = true;

      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      triggerToast('Account created successfully!', 'success');

      await tick();

      setTimeout(() => {
        switchMode('signin');
      }, 1500);

    } catch (err) {
      if (err instanceof Error) {
        triggerToast(err.message, 'error');
      }
    } finally {
      loading = false;
    }
  }

  /* ---------------- SUBMIT ---------------- */

  function handleSubmit(e: Event) {
    e.preventDefault();

    if (authMode === 'signin') {
      handleLogin();
    } else {
      handleRegister();
    }
  }
</script>

<!-- ================= TOAST ================= -->

{#if showToast}
  <div
    class={`fixed z-50 top-5 right-5 flex items-center gap-2 px-5 py-3
    rounded-xl shadow-lg text-sm font-medium
    ${toastType === 'success'
      ? 'bg-green-600 text-white'
      : 'bg-red-600 text-white'}`}
  >
    {#if toastType === 'success'}
      <BadgeCheck class="w-5 h-5" />
    {:else}
      <BadgeAlert class="w-5 h-5" />
    {/if}

    <span>{toastMessage}</span>
  </div>
{/if}

<!-- ================= PAGE ================= -->

<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">

  <div
    class="bg-white rounded-3xl shadow-2xl overflow-hidden
           w-full max-w-5xl flex flex-col md:flex-row"
  >

    <!-- ============ LEFT FORM ============ -->

    <div class="w-full md:w-1/2 p-8 md:p-12 flex justify-center">

      <form
        class="w-full max-w-md space-y-6"
        on:submit|preventDefault={handleSubmit}
      >

        <!-- AUTH SWITCH -->

        <div class="flex justify-center mb-6">

          <div class="flex bg-gray-100 rounded-xl p-1 shadow-inner w-full max-w-xs">

            <!-- SIGN IN -->

            <button
              type="button"
              on:click={() => switchMode('signin')}
              class={`flex-1 flex items-center justify-center gap-2 py-2
              rounded-lg text-sm font-semibold transition

              ${authMode === 'signin'
                ? 'bg-green-600 text-white shadow'
                : 'bg-white text-green-700 hover:bg-green-50'}`}
            >
              <User size="16" />
              Sign In
            </button>

            <!-- SIGN UP -->

            <button
              type="button"
              on:click={() => switchMode('signup')}
              class={`flex-1 flex items-center justify-center gap-2 py-2
              rounded-lg text-sm font-semibold transition

              ${authMode === 'signup'
                ? 'bg-green-600 text-white shadow'
                : 'bg-white text-green-700 hover:bg-green-50'}`}
            >
              <User size="16" />
              Sign Up
            </button>

          </div>

        </div>

        <!-- FORM CONTENT -->

        <div in:fly={{ y: 20, duration: 250 }}>

          <!-- TITLE -->

          <div class="text-center mb-6">

            {#if authMode === 'signin'}
              <h2 class="text-2xl font-bold text-gray-800">
                Welcome Back!
              </h2>

              <p class="text-gray-600 mt-1">
                Sign in to continue
              </p>

            {:else}

              <h2 class="text-2xl font-bold text-gray-800">
                Create Account
              </h2>

              <p class="text-gray-600 mt-1">
                Join ReciPinoy today
              </p>

            {/if}

          </div>

          <!-- USERNAME (SIGNUP ONLY) -->

          {#if authMode === 'signup'}

            <div class="relative">
              <User class="absolute left-3 top-[20px] text-gray-400 w-5 h-5" />

              <input
                type="text"
                placeholder="Username"
                bind:value={username}
                required
                class="pl-10 w-full p-4 rounded-xl border border-gray-300
                       focus:ring-2 focus:ring-green-500"
              />
            </div>

          {/if}

          <!-- EMAIL -->

          <div class="relative">
            <Mail class="absolute left-3 top-[20px] text-gray-400 w-5 h-5" />

            <input
              type="email"
              placeholder="Email"
              bind:value={email}
              required
              class="pl-10 w-full p-4 rounded-xl border border-gray-300
                     focus:ring-2 focus:ring-green-500"
            />
          </div>

          <!-- PASSWORD -->

          <div class="relative">
            <Lock class="absolute left-3 top-[20px] text-gray-400 w-5 h-5" />

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              bind:value={password}
              required
              class="pl-10 w-full p-4 rounded-xl border border-gray-300
                     focus:ring-2 focus:ring-green-500"
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

          <!-- SUBMIT -->

          <button
            type="submit"
            disabled={loading}
            class="w-full bg-green-600 hover:bg-green-700
                   text-white font-medium p-4 rounded-xl shadow-md transition"
          >
            {#if loading}
              Processing...
            {:else if authMode === 'signin'}
              Sign In
            {:else}
              Create Account
            {/if}
          </button>

        </div>

      </form>

    </div>

    <!-- ============ RIGHT IMAGE ============ -->

    <div class="hidden md:flex w-1/2 relative overflow-hidden">

      <img
        src="/assets/pork-adobo.jpg"
        class="w-full h-full object-cover scale-105"
        alt="Food"
      />

      <div class="absolute inset-0 bg-black/30"></div>

      <div class="absolute top-6 left-6 px-4">

        <h1
          class="text-4xl font-extrabold text-white
          bg-clip-text text-transparent
          bg-gradient-to-r from-green-500 to-green-700"
        >
          ReciPinoy
        </h1>

        <p class="text-white/90 mt-1 text-lg">
          Delicious recipes await you!
        </p>

      </div>

    </div>

  </div>

</div>