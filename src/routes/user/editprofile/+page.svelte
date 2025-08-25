<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  let username = "";
  let password = "";
  let confirmPassword = "";
  let profilePic: string | null = null;
  let originalProfilePic: string | null = null;
  let successMessage = "";
  let selectedFile: File | null = null;
  let fileInput: HTMLInputElement;

  onMount(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();

      username = data.username || "";
      profilePic = data.profilePic || "/assets/defaultpic.png";
      originalProfilePic = profilePic;
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  });

  function handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0];

    if (file) {
      selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        profilePic = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit() {
    if (password !== confirmPassword) {
      successMessage = "⚠️ Passwords do not match.";
      setTimeout(() => (successMessage = ""), 3000);
      return;
    }

    try {
      let imageUrl = originalProfilePic;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePic", selectedFile);
        formData.append("folder", "profile-pictures");

        const uploadRes = await fetch("http://localhost:3000/api/user/upload-profile-picture", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok) {
          imageUrl = uploadData.url;
        } else {
          throw new Error(uploadData.message || "Failed to upload image");
        }
      }

      const res = await fetch("http://localhost:3000/api/user/editprofile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
          profilePic: imageUrl,
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Profile update failed");

      successMessage = "✅ Profile updated successfully!";
      setTimeout(() => {
        successMessage = "";
        window.location.href = "/user/profile";
      }, 1500);
    } catch (err) {
      successMessage = err instanceof Error ? err.message : "Something went wrong";
      setTimeout(() => (successMessage = ""), 2000);
    }
  }
</script>

<section class="max-w-3xl mx-auto p-6">
  <div class="bg-white shadow-xl rounded-2xl p-8 space-y-8">
    <h2 class="text-2xl font-bold text-gray-900">Edit Profile</h2>

    {#if successMessage}
      <div
        transition:fade
        class="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-sm"
      >
        {successMessage}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="flex flex-col md:flex-row gap-10">
      <!-- Profile Image & Upload -->
      <div class="flex flex-col items-center space-y-4 flex-shrink-0">
        <img
          src={profilePic}
          alt="Profile Picture"
          class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md border-4 border-gray-200 hover:scale-105 transition duration-200"
        />
        <button
          type="button"
          on:click={() => fileInput.click()}
          class="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
        >
          Change Photo
        </button>
        <input
          type="file"
          accept="image/*"
          bind:this={fileInput}
          on:change={handleImageChange}
          class="hidden"
        />
      </div>

      <!-- Form Fields -->
      <div class="flex flex-col flex-1 space-y-6">
        <div>
          <label for="name" class="block font-semibold text-gray-700 mb-1">Username</label>
          <input
            id="name"
            type="text"
            bind:value={username}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="password" class="block font-semibold text-gray-700 mb-1">New Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter new password"
            bind:value={password}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="confirm-password" class="block font-semibold text-gray-700 mb-1">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            bind:value={confirmPassword}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Buttons -->
        <div class="flex flex-col md:flex-row gap-3 pt-6">
          <button
            type="submit"
            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg shadow-sm transition duration-200"
          >
            Save Changes
          </button>
          <a
            href="/user/profile"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg shadow-sm text-center transition duration-200"
          >
            Cancel
          </a>
        </div>
      </div>
    </form>
  </div>
</section>
