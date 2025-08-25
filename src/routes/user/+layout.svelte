<script>
    import { page } from '$app/stores';
    import { derived } from "svelte/store";
    import NavBar from "$lib/user/navBar.svelte";
    import Footer from "$lib/user/footer.svelte";
    import Contact from "$lib/user/contact.svelte";
    
    const isHome = derived(page, $page => $page.url.pathname === "/user/dashboard");
</script>

<div class="flex flex-col min-h-screen">
    <NavBar />

    <main class="flex-grow">
        <slot />
    </main>

    {#if $isHome}
      <div class="flex flex-col">
        <Contact />
        <Footer />
      </div>
    {/if}
</div>
