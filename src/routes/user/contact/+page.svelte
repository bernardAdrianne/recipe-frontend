<script>
  import Contact from "$lib/user/contact.svelte";
  import Footer from "$lib/user/footer.svelte";
</script>

<div class="flex flex-col min-h-screen">
  <main class="flex-grow">
    <section class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-[#222222] mb-6">Contact Us</h1>
      <Contact />
    </section>
  </main>

  <Footer />
</div>
