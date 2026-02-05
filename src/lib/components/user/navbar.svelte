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

<header class="shadow-xl backdrop-blur-md">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- Logo -->
			<div class="flex-shrink-0">
 				<a href="/user/dashboard" class="flex items-center gap-2">
    				<h1 
      					class="text-3xl font-bold bg-gradient-to-r from-[#115D33] to-[#2d974d] text-transparent bg-clip-text"
    				>
      				ReciPinoy
    				</h1>
  				</a>
			</div>

			<!-- Navigation + Search -->
			<div class="flex items-center space-x-6">
				<!-- Navigation Links -->
				<div class="relative hidden md:flex space-x-6 items-center">
					<a
  					href="/user/home"
  					class="flex items-center gap-2 px-3 py-1 rounded-lg transition duration-200
    				hover:bg-gray-200 hover:text-[#115D33]
    				{ $page.url.pathname === '/user/home' ? 'bg-[#d6f5e4] text-[#115D33]' : 'text-[#000000]' }"
					>
  					<Home size="20" />
  					Home
					</a>

					<a
  					href="/user/dashboard"
  					class="flex items-center gap-2 py-1 px-2 rounded-lg transition duration-200
    				hover:bg-gray-200 hover:text-[#115D33]
    				{ $page.url.pathname === '/user/dashboard' ? 'bg-[#d6f5e4] text-[#115D33]' : 'text-[#000000]' }"
					>
  					<Search size="20" />
  					Find Recipes
					</a>


					<a
  					href="/user/feedback"
  					class="flex items-center gap-2 py-1 px-2 rounded-lg transition duration-200
    				hover:bg-gray-200 hover:text-[#115D33]
    				{ $page.url.pathname === '/user/feedback' ? 'bg-[#d6f5e4] text-[#115D33]' : 'text-[#000000]' }"
					>
  					<MessageSquare size="20" />
  					Feedback
					</a>

					{#if $isLoggedIn}
						<!-- Profile Dropdown -->
						<div class="relative">
							<button
								id="profileButton"
								on:click={toggleDropdown}
								aria-label="profile dropdown"
								class="text-[#000000] hover:text-[#797877] transition duration-200 focus:outline-none hover:scale-[1.08]"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="28"
									height="28"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										fill-rule="evenodd"
										d="M256 42.667A213.333 213.333 0 0 1 469.334 256c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667m21.334 234.667h-42.667c-52.815 0-98.158 31.987-117.715 77.648c30.944 43.391 81.692 71.685 139.048 71.685s108.104-28.294 139.049-71.688c-19.557-45.658-64.9-77.645-117.715-77.645M256 106.667c-35.346 0-64 28.654-64 64s28.654 64 64 64s64-28.654 64-64s-28.653-64-64-64"
									/>
								</svg>
							</button>

							{#if showDropdown}
								<div
									id="profileDropdown"
									class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
								>
									<a href="/user/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
									<a href="/user/saved" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bookmarked</a>
									<button
										on:click={confirmLogout}
										class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										Logout
									</button>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Guest / Not logged in -->
						<div class="flex items-center space-x-4">
							<a
								href="/signin"
								class="text-[#000000] border border-[#000000] px-2 py-1 rounded-lg
								 hover:bg-[#115D33] hover:text-white transition
								   shadow-xl hover:shadow-lg hover:scale-[1.08]"
							>
								Sign in
							</a>
							<a
								href="/signup"
								class="bg-[#000000] text-white px-2 py-1 rounded-lg
								 hover:bg-[#0e4b2a] transition
								  shadow-xl hover:shadow-lg hover:scale-[1.08]"
							>
								Sign up
							</a>
						</div>
					{/if}
				</div>
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