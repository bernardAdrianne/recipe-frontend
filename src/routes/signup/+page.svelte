<script lang="ts">
    import { goto } from '$app/navigation';
    import { tick } from 'svelte';
    import { fade } from 'svelte/transition';
    import { User, Mail, Lock, Eye, EyeOff } from "lucide-svelte"; 

    function navigateToSignin() {
        goto('/signin');
    }

    let showPassword = false;
    let username = "";
    let email = "";
    let password = "";
    let successMessage = "";
    let errorMessage = "";
    let loading = false;

    async function handleRegister(event: Event) {
        event.preventDefault();

        if (password.length < 6) {
            errorMessage = "Password must be at least 6 characters.";
            return;
        }

        try {
            loading = true;
            errorMessage = "";

            const res = await fetch('https://airecipe-backend-2.onrender.com/api/auth/signup', {
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

            if (res.ok) {
                successMessage = "🎉 Account created successfully!";
                await tick();
                setTimeout(() => goto('/signin'), 2000);
            } else {
                throw new Error(data.message || 'Signup failed');
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
    <!-- branding -->
    <div class="flex items-center gap-2 mb-4">
        <h1 class="font-bold text-4xl text-[#115D33]">ReciPinoy</h1>
    </div>
    <p class="text-sm text-[#1e1e1e] font-semibold">Let's create your ReciPinoy account</p>

    <!-- toast notifications -->
     {#if successMessage}
        <div transition:fade class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg z-50">
            {successMessage}
    </div>
    {/if}

    {#if errorMessage}
        <div transition:fade class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50">
            {errorMessage}
        </div>
    {/if}

    <!-- register form -->
    <form class="w-full max-w-sm mt-8 space-y-4" on:submit|preventDefault={handleRegister}>
        <!-- username -->
        <div class="relative">
            <User class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                class="pl-10 border border-[#EBEBE8] rounded-2xl p-4 w-full text-[#222831] focus:border-[#228B22] focus:outline-none"
                type="text"
                placeholder="Username"
                bind:value={username}
                required
            />
        </div>

        <!-- email -->
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

        <!-- password -->
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

        <!-- submit button -->
        <button
            class="bg-[#228B22] text-white font-medium text-center text-sm rounded-2xl p-4 w-full cursor-pointer shadow-md hover:scale-[1.02] hover:bg-[#00AB41] transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
        </button>
    </form>

    <!-- terms and privacy -->
    <div class="text-center mt-4 max-w-sm text-sm text-[#A5A4A1]">
        By creating an account, you agree to the
        <span class="underline">Terms of Service</span>
        and
        <span class="underline">Privacy Policy</span>.
    </div>

    <!-- sign in -->
    <p class="text-sm text-[#A5A4A1] mt-10">
        Already have an account?
        <span class="text-[#050301] cursor-pointer font-semibold" on:click={navigateToSignin}>Sign in</span>
    </p>
</div>
