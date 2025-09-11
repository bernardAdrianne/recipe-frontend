<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade} from 'svelte/transition';

	let searchQuery = '';
	let showDropdown = false;
	let showLogoutConfirm = false;	
	let message = '';

	async function handleSearch(event: Event) {
	event.preventDefault();

	const trimmedQuery = searchQuery.trim();

		
	try {
    if (!trimmedQuery) {
      goto('/user/dashboard');
    } else {
      // Navigate to search results
      goto(`/user/dashboard?search=${encodeURIComponent(trimmedQuery)}`);
    }
  } catch (err) {
    console.error('Search navigation failed:', err);
  }
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

	// Close dropdown if user click outside
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

	// Attach global listener
	onMount(() => {
		if (typeof window !== 'undefined') {
		window.addEventListener("click", handleClickOutside);
		}
	});

	// Clean up listener
	onDestroy(() => {
		if (typeof window !== 'undefined') {
		window.removeEventListener("click", handleClickOutside);
		}
	});

	$: $page.url, showDropdown = false;

	async function handleLogout(event: Event) {
		event.preventDefault();

		try {
			const res = await fetch('https://airecipe-backend-2.onrender.com/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});

			if (res.ok) {
				message = 'Successfully Log out';


    			setTimeout(() => {
      			message = '';
				goto('/signin');
    			}, 1500);
			} else {
				const data = await res.json();
				alert(data.message || 'Logout failed');
			}
		} catch (err) {
			console.error('Logout error', err);
			alert('An Error occured during logout.');
		}
	}
</script>

<header class="bg-[#228B22] shadow-xl backdrop-blur-md shadow-md">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">

		<!-- Logo -->
		<div class="flex-shrink-0">
			<h1 class="text-4xl font-bold text-[#222222]"><a href="/user/dashboard">ReciPinoy</a></h1>
		</div>

		<!-- Navigation + Search -->
		<div class="flex items-center space-x-6">

		<!-- Search Bar -->
		<!-- <form on:submit={handleSearch} class="relative">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search..."
				class="pl-10 pr-4 py-2 rounded-full shadow-md bg-white text-sm text-[#222222] focus:outline-none focus:ring-2 focus:ring-[#222222]"
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M21 21l-4.35-4.35M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z" />
				</svg>
		</form> -->

		<!-- Navigation Links -->
		<div class="relative hidden md:flex space-x-6 items-center">
  			<a href="/user/dashboard" class="text-[#000000] hover:text-[#F4A261] transition duration-200">Home</a>
  			<a href="/user/aboutus" class="text-[#000000]  hover:text-[#F4A261] transition duration-200">About</a>

  		<!-- Profile Dropdown Trigger -->
  		<div class="relative">
    		<button
      			id="profileButton"
      			on:click={toggleDropdown}
				aria-label="profile dropdown"
      			class="text-[#000000] hover:text-[#F4A261] transition duration-200 focus:outline-none"
    		>
      			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
				 viewBox="0 0 512 512"><path fill="currentColor" fill-rule="evenodd" 
				 d="M256 42.667A213.333 213.333 0 0 1 469.334 256c0 117.821-95.513 213.334-213.334 213.334c-117.82 0-213.333-95.513-213.333-213.334C42.667 138.18 138.18 42.667 256 42.667m21.334 234.667h-42.667c-52.815 0-98.158 31.987-117.715 77.648c30.944 43.391 81.692 71.685 139.048 71.685s108.104-28.294 139.049-71.688c-19.557-45.658-64.9-77.645-117.715-77.645M256 106.667c-35.346 0-64 28.654-64 64s28.654 64 64 64s64-28.654 64-64s-28.653-64-64-64"/></svg>
   			</button>

    	<!-- Dropdown Menu -->
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
				</div>

			</div>
		</div>
	</div>
</header>
 {#if message}
  <p
    transition:fade
    class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg z-100"
  >
    {message}
  </p>
{/if}
{#if showLogoutConfirm}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
	role="presentation"
    on:click={cancelLogout}
	
  >
    <!-- Modal Card -->
    <div
      class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      tabindex="0"
      on:keydown={(e) => e.key === 'Escape' && cancelLogout()}
      on:click|stopPropagation
    >
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div class="bg-red-100 text-red-600 w-14 h-14 flex items-center justify-center rounded-full">
          ⚠️
        </div>
      </div>

      <!-- Title -->
      <h2 id="logout-title" class="text-xl font-bold text-gray-900 text-center mb-2">
        Logout Confirmation
      </h2>

      <!-- Message -->
      <p class="text-gray-600 text-center mb-6">
        Are you sure you want to log out of your account?
      </p>

      <!-- Actions -->
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
