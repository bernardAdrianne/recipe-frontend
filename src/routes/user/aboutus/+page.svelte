<script>
  import Footer from "$lib/user/footer.svelte";
  import Contact from "$lib/user/contact.svelte";

  let myPhoto = "/assets/myphoto.png";
</script>

<div class="flex flex-col min-h-screen">
  <main class="flex-grow">
    <section class="max-w-6xl mx-auto px-6 py-16">
      <div class="flex flex-col-reverse md:flex-row items-center gap-12">
        <!-- Text Content -->
        <div class="md:w-1/2 text-center md:text-left">
          <h1 class="text-4xl font-bold text-[#222222] mb-4">About ReciPinoy</h1>
          <p class="text-gray-700 mb-4 leading-relaxed text-lg">
            ReciPinoy is an AI-powered recipe recommendation platform built to help Filipinos make the most out of their ingredients at home.
          </p>
          <p class="text-gray-700 mb-4 leading-relaxed text-lg">
            By leveraging smart matching and natural language processing, I aim simplify meal planning, and inspire everyone to cook nutritious, local meals.
          </p>

        </div>

        <!-- Image -->
        <div class="md:w-1/2 flex justify-center">
          <img
            src={myPhoto}
            alt="About Us"
            class="rounded-2xl shadow-lg w-full max-w-sm object-cover"
          />
        </div>
      </div>
    </section>
  </main>

  <Contact />
  <Footer />
</div>
