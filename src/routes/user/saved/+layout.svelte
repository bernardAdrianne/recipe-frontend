  <script>
      import { page } from '$app/stores';
      import { derived } from "svelte/store";
      import Footer from "$lib/user/footer.svelte";
      import Contact from "$lib/user/contact.svelte";
      
      const isSaved = derived(page, $page => $page.url.pathname === "/user/saved");
  </script>

  <div class="flex flex-col min-h-screen">

      <main class="flex-grow">
          <slot />
      </main>

      {#if $isSaved}
        <div class="flex flex-col">
          <Contact />
          <Footer />
        </div>
      {/if}
  </div>
