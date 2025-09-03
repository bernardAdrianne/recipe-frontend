<script lang="ts">
    import { goto } from '$app/navigation';
    import { fade } from 'svelte/transition';
    import { Mail, Lock, Eye, EyeOff } from "lucide-svelte";

    function navigateToSignup() {
        goto('/signup');
    }

    let showPassword = false;
    let email = "";
    let password = "";
    let loading = false;
    let errorMessage = "";

    async function handleLogin(event: Event) {
        event.preventDefault();

        try {
            loading = true; // ✅ set loading state before request
            errorMessage = "";

            const res = await fetch('http://localhost:3000/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                goto('/user/dashboard');
            } else {
                throw new Error(data.message || 'Signin failed');
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error:', err.message);
                errorMessage = err.message; 
            }
        } finally {
            loading = false; 
        }
    }
</script>


<div class="flex flex-col items-center justify-center h-screen px-4">
    <!-- Brand -->
    <h1 class="font-bold text-3xl text-[#115D33] mb-4">ReciPinoy</h1>
    <p class="text-sm text-[#1e1e1e] font-semibold mb-8">Welcome back! Sign in to continue</p>

    <!-- Error Toast -->
    {#if errorMessage}
        <div transition:fade class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50">
            {errorMessage}
        </div>
    {/if}

    <!-- Login Form -->
    <form class="w-full max-w-sm space-y-4" on:submit|preventDefault={handleLogin}>
        <!-- Email -->
        <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                class="pl-10 border border-[#EBEBE8] rounded-2xl p-4 w-full text-[#222831] focus:border-[#228B22] focus:outline-none"
                type="email"
                placeholder="your@email.com"
                bind:value={email}
                required
            />
        </div>

        <!-- Password -->
        <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                class="pl-10 border border-[#EBEBE8] rounded-2xl p-4 w-full text-[#222831] focus:border-[#228B22] focus:outline-none"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                bind:value={password}
                required
            />
            {#if password}
                <button
                    class="absolute inset-y-0 right-3 flex items-center"
                    type="button"
                    on:click={() => (showPassword = !showPassword)}>
                    {#if showPassword}
                        <EyeOff class="w-5 h-5 text-gray-400" />
                    {:else}
                        <Eye class="w-5 h-5 text-gray-400" />
                    {/if}
                </button>
            {/if}
        </div>

        <!-- Submit -->
        <button
            class="bg-[#228B22] text-white font-medium text-center text-sm rounded-2xl p-4 w-full cursor-pointer shadow-md hover:scale-[1.02] hover:bg-[#00AB41] transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
        </button>
    </form>

    <!-- Sign Up Link -->
    <p class="text-sm text-[#A5A4A1] mt-10">
        Don't have an account?
        <span class="text-[#050301] cursor-pointer font-semibold" on:click={navigateToSignup}>Sign Up</span>
    </p>
</div>
