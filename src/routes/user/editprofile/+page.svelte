<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Footer from "$lib/user/footer.svelte";
  import Contact from "$lib/user/contact.svelte";
  import {
    BadgeCheck,
    BadgeAlert,
    Loader
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

  let username = "";
  let password = "";
  let confirmPassword = "";
  let profilePic: string | null = null;
  let originalProfilePic: string | null = null;
  let successMessage = "";
  let selectedFile: File | null = null;
  let fileInput: HTMLInputElement;

  function triggerToast(message: string, 
        type: "success" | "error" = "success", 
        position: typeof toastPosition = "top-right") {
    toastMessage = message;
    toastType = type;
    showToast = true;
    toastPosition = position;
    
    setTimeout(() => (showToast = false), 3000);
  }

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
      triggerToast("Failed to load profile.", "error", "top-center");
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
      triggerToast("Passwords do not match.", "error", "top-center");
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

      triggerToast("Profile updated successfully!", "success", "top-right");
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

<section class="min-h-screen flex flex-col max-w-3xl mx-auto p-6 pt-10">
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

  <div class="bg-white border border-gray-300 shadow-xl rounded-2xl p-8 space-y-8">
    <h2 class="text-2xl font-bold text-gray-900">Edit Profile</h2>

    <form on:submit|preventDefault={handleSubmit} class="flex flex-col md:flex-row gap-10">
      <!-- PROFILE IMAGE UPLOAD -->
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

      <!-- FORM FIELDS -->
      <div class="flex flex-col flex-1 space-y-6">
        <div>
          <label class="block font-semibold text-gray-700 mb-1">Username</label>
          <input
            type="text"
            bind:value={username}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            bind:value={password}
            placeholder="Enter new password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label class="block font-semibold text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            bind:value={confirmPassword}
            placeholder="Confirm password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- BUTTON -->
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
<Footer />
<Contact />