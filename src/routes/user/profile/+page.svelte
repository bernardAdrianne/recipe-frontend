<script lang="ts">
  import { onMount } from "svelte";
  import Footer from "$lib/components/user/footer.svelte";
  import Contact from "$lib/components/user/contact.svelte";
  import {
    BadgeCheck, 
    BadgeAlert, 
    Trash2, 
    SquarePen } 
  from "lucide-svelte";

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

  let profilePic = "";
  let username = "";
  let email = "";
  let joinedDate = "";
  let showModal = false;
  let deleting = false;

  function triggerToast(
    message: string,
    type: "success" | "error" = "success",
    position: typeof toastPosition = "top-right"
  ) {
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
      triggerToast(`Failed to load profile: ${(err as Error).message}`, "error");
    }
  });

  function openDelModal() {
    showModal = true;
  }

  function closeDelModal() {
    showModal = false;
  }

  async function confirmDel() {
    deleting = true;
    try {
      const res = await fetch("http://localhost:3000/api/user/", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete account");

      triggerToast("Your account has been deleted.", "success", "top-center");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (err) {
      triggerToast(
        err instanceof Error ? err.message : "Delete failed",
        "error",
        "top-center"
      );
    } finally {
      deleting = false;
      showModal = false;
    }
  }
</script>

<div class="min-h-screen flex flex-col">
  <!-- TOAST -->
  {#if showToast}
    <div
      class={`fixed z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all duration-300
        ${toastType === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
        ${toastPosition === "top-left" ? "top-5 left-5" : ""}
        ${toastPosition === "top-center" ? "top-5 left-1/2 -translate-x-1/2" : ""}
        ${toastPosition === "top-right" ? "top-5 right-5" : ""}
        ${toastPosition === "bottom-left" ? "bottom-5 left-5" : ""}
        ${toastPosition === "bottom-center" ? "bottom-5 left-1/2 -translate-x-1/2" : ""}
        ${toastPosition === "bottom-right" ? "bottom-5 right-5" : ""}
      `}
    >
      {#if toastType === "success"}
        <BadgeCheck class="w-5 h-5 text-white" />
      {:else}
        <BadgeAlert class="w-5 h-5 text-white" />
      {/if}
      <span>{toastMessage}</span>
    </div>
  {/if}

  <!-- PROFILE CONTENT -->
  <section class="flex-grow flex justify-center items-start p-6">
    <div class="bg-white border border-gray-300 shadow-xl rounded-2xl p-6 md:p-10 max-w-3xl w-full flex flex-col md:flex-row items-center md:items-start gap-8">
      
      <!-- Profile Image -->
      <div class="flex flex-col items-center">
        <img
          src={profilePic || "https://via.placeholder.com/150"}
          alt="Profile Picture"
          class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-md border-4 border-gray-200"
        />
        <p class="mt-4 text-sm text-gray-500 italic">Member since {joinedDate}</p>
      </div>

      <!-- USER INFO -->
      <div class="flex-1 space-y-6 w-full">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{username}</h2>
          <p class="text-gray-600">{email}</p>
        </div>

        <div class="flex flex-col md:flex-row gap-3">
          <a href="/user/editprofile" 
          class="flex-1 flex bg-blue-600 hover:bg-blue-700 text-center text-white font-medium px-4 py-2 rounded-lg transition duration-200 shadow-sm gap-2 items-center justify-center">
          <SquarePen class="w-5 h-5" />  Edit Profile
          </a>

          <button
            on:click={openDelModal}
            class="flex-1 bg-red-600 hover:bg-red-700 text-center text-white font-medium px-4 py-2 rounded-lg transition duration-200 shadow-sm flex items-center justify-center gap-2"
          >
            <Trash2 class="w-5 h-5" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- DELETE MODAL -->
  {#if showModal}
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center animate-fadeIn scale-95">
        <div class="flex items-center justify-center mb-4">
          <div class="bg-red-100 text-red-600 p-3 rounded-full">
            <Trash2 class="w-6 h-6" />
          </div>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Delete account?</h2>
        <p class="text-gray-600 mb-6">
          This will permanently delete this account. <br />
          Are you sure you want to delete your account? 
        </p>
        <div class="flex gap-4">
          <button
            on:click={closeDelModal}
            class="flex-1 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            on:click={confirmDel}
            class="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- FOOTER -->
<Footer />
<Contact />
