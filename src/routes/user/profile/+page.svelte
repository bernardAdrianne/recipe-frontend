<script lang="ts">
  import { onMount } from "svelte";

  let showSuccess = false;
  let successMessage = "";
  let profilePic = "";
  let username = "";
  let email = "";
  let joinedDate = "";

  onMount(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

      const user = await res.json();

      profilePic = user.profilePic || "";
      username = user.username || "";
      email = user.email || "";
      joinedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "";
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
        alert(`Failed to load profile: ${err.message}`);
      }
    }
  });

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      const res = await fetch("http://localhost:3000/api/user/", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete account");

      showSuccess = true;
      successMessage = "Your account has been deleted.";

      setTimeout(() => {
        showSuccess = false;
        window.location.href = "/signin";
      }, 3000);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  }
</script>

<section class="max-w-3xl mx-auto p-6">
  <div class="bg-white shadow-xl rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
    <!-- Profile Image -->
    <div class="flex flex-col items-center">
      <img
        src={profilePic || "https://via.placeholder.com/150"}
        alt="Profile Picture"
        class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md border-4 border-gray-200"
      />
      <p class="mt-4 text-sm text-gray-500 italic">Member since {joinedDate}</p>
    </div>

    <!-- User Info + Actions -->
    <div class="flex-1 space-y-6 w-full">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{username}</h2>
        <p class="text-gray-600">{email}</p>
      </div>

      {#if showSuccess}
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg text-sm">
          {successMessage}
        </div>
      {/if}

      <div class="flex flex-col md:flex-row gap-3">
        <a
          href="/user/editprofile"
          class="flex-1 bg-blue-600 hover:bg-blue-700 text-center text-white font-medium px-4 py-2 rounded-lg transition duration-200 shadow-sm"
        >
          Edit Profile
        </a>
        <button
          on:click={handleDelete}
          class="flex-1 bg-red-600 hover:bg-red-700 text-center text-white font-medium px-4 py-2 rounded-lg transition duration-200 shadow-sm"
        >
          Delete Account
        </button>
      </div>
    </div>
  </div>
</section>
