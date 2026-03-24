<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { fade } from "svelte/transition";
	import { isLoggedIn, user } from "../../stores/userStore.js";
	import { 
		Home, 
		Search, 
		MessageSquare,
		TriangleAlert,
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

	let searchQuery = "";
	let showDropdown = false;
	let showLogoutConfirm = false;
	let message = "";

	function triggerToast(message: string, 
        type: "success" | "error" = "success", 
        position: typeof toastPosition = "top-right") {
    toastMessage = message;
    toastType = type;
    showToast = true;
    toastPosition = position;
    
    setTimeout(() => (showToast = false), 3000);
  }

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function confirmLogout() {
		showDropdown = false;
		showLogoutConfirm = true;
	}

	function cancelLogout() {
		showLogoutConfirm = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const dropdown = document.getElementById("profileDropdown");
		const profileBtn = document.getElementById("profileButton");

		if (
			dropdown &&
			!dropdown.contains(event.target as Node) &&
			profileBtn &&
			!profileBtn.contains(event.target as Node)
		) {
			showDropdown = false;
		}
	}

	onMount(async () => {
		if (typeof window !== "undefined") {
			window.addEventListener("click", handleClickOutside);
		}

		try {
			const res = await fetch("https://airecipe-backend-2.onrender.com/api/auth/check-session", {
				credentials: "include",
			});
			if (res.ok) {
      			const data = await res.json();
      			isLoggedIn.set(data.authenticated || data.loggedIn);
    		} else {
      			isLoggedIn.set(false);
    		}
		} catch (err) {
			console.error("Session check failed:", err);
			isLoggedIn.set(false);
		}
	});

	onDestroy(() => {
		if (typeof window !== "undefined") {
			window.removeEventListener("click", handleClickOutside);
		}
	});

	$: $page.url, (showDropdown = false);

	async function handleLogout(event: Event) {
		event.preventDefault();

		try {
			const res = await fetch("https://airecipe-backend-2.onrender.com/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			
			if (res.ok) {
				isLoggedIn.set(false);
				showLogoutConfirm = false;
				triggerToast("Successfully logged out","success", "top-center");

				setTimeout(() => {
					message = "";
					goto("/");
				}, 800);
			} else {
				const data = await res.json();
				alert(data.message || "Logout failed");
			}
		} catch (err) {
			console.error("Logout error", err);
			alert("An error occurred during logout.");
		}
	}
</script>

<header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">
			<!-- Logo with Icon -->
			<div class="flex-shrink-0">
				<a href="/user/dashboard" class="flex items-center gap-2 group">
					<!-- Logo Icon -->

						<img 
							src="/assets/logo.png" 
							alt="ReciPinoy Logo" 
							class="w-8 h-8 object-contain"
						/>

					<!-- Text Logo -->
					<h1 class="text-2xl font-bold text-[#0f1b2d] group-hover:text-[#1a2d47] transition-colors">
						ReciPinoy
					</h1>
				</a>
			</div>

			<!-- Centered Navigation Links -->
			<div class="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
				<div class="flex items-center space-x-1 bg-gray-50/80 backdrop-blur-sm rounded-lg p-1">
					<a
						href="/user/home"
						class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
							{$page.url.pathname === '/user/home' 
								? 'bg-amber-500 text-white shadow-md' 
								: 'text-gray-700 hover:bg-amber-100 hover:text-amber-700'}"
					>
						<Home size="18" />
						<span>Home</span>
					</a>

					<a
						href="/user/dashboard"
						class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
							{$page.url.pathname === '/user/dashboard' 
								? 'bg-amber-500 text-white shadow-md' 
								: 'text-gray-700 hover:bg-amber-100 hover:text-amber-700'}"
					>
						<Search size="18" />
						<span>Find Recipes</span>
					</a>

					<a
						href="/user/feedback"
						class="flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200
							{$page.url.pathname === '/user/feedback' 
								? 'bg-amber-500 text-white shadow-md' 
								: 'text-gray-700 hover:bg-amber-100 hover:text-amber-700'}"
					>
						<MessageSquare size="18" />
						<span>Feedback</span>
					</a>
				</div>
			</div>

			<!-- Right side - Auth buttons / Profile -->
			<div class="flex items-center space-x-3">
				{#if $isLoggedIn}
					<!-- Profile Dropdown -->
					<div class="relative">
						<button
							id="profileButton"
							on:click={toggleDropdown}
							aria-label="profile dropdown"
							class="flex items-center gap-2 bg-gray-100 hover:bg-amber-100 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02]"
						>
							<div class="w-8 h-8 bg-[#0f1b2d] rounded-full flex items-center justify-center text-white">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
								</svg>
							</div>
							<span class="text-sm font-medium text-gray-700">Profile</span>
						</button>

						{#if showDropdown}
							<div
								id="profileDropdown"
								class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
							>
								<a href="/user/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700">Profile</a>
								<a href="/user/saved" class="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700">Bookmarked</a>
								<div class="border-t border-gray-100 my-1"></div>
								<button
									on:click={confirmLogout}
									class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
								>
									Logout
								</button>
							</div>
						{/if}
					</div>
				{:else}
					<!-- Guest / Not logged in - Improved buttons -->
					<div class="flex items-center space-x-2">
						<a
							href="/signin"
							class="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg
								hover:bg-amber-50 hover:text-amber-700 hover:scale-[1.02]
								transition-all duration-200"
						>
							Sign in
						</a>
						<a
							href="/signup"
							class="px-4 py-2 text-sm font-medium text-white bg-[#0f1b2d] rounded-lg
								hover:bg-[#1a2d47] hover:scale-[1.02] hover:shadow-md
								transition-all duration-200"
						>
							Sign up
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>

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

{#if showLogoutConfirm}
	<div
		class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
		role="presentation"
		on:click={cancelLogout}
	>
		<div
			class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-fadeIn"
			role="dialog"
			aria-modal="true"
			aria-labelledby="logout-title"
			tabindex="0"
			on:keydown={(e) => e.key === "Escape" && cancelLogout()}
			on:click|stopPropagation
		>
			<div class="flex justify-center mb-4">
				<div class="bg-red-100 text-red-600 w-14 h-14 flex items-center justify-center rounded-full">
					<TriangleAlert class="w-5 h-5"/>
				</div>
			</div>

			<h2 id="logout-title" class="text-xl font-bold text-gray-900 text-center mb-2">
				Logout confirmation
			</h2>

			<p class="text-gray-600 text-center mb-6">
				Are you sure you want to log out of your account?
			</p>

			<div class="flex justify-center space-x-4">
				<button
					on:click={handleLogout}
					class="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
				>
					Logout
				</button>
				<button
					on:click={cancelLogout}
					class="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}