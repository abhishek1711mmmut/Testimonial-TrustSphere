import SidebarLink from "@/components/Docs/SidebarLink";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works - TrustSphere",
  description: "Create a space, collect customer testimonials, and embed your Wall of Love with TrustSphere.",
  // other metadata
};

export default function DocsPage() {
  return (
    <>
      <section className="pb-16 pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32 px-6">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap gap-y-8">
            <div className="w-full px-4 lg:w-1/4">
              <div className="sticky top-28 rounded-lg border border-stroke p-4 shadow-solid-4  transition-all  dark:border-strokedark dark:bg-blacksection">
                <nav aria-label="Guide sections">
                  <ul className="space-y-2">
                    <SidebarLink />
                  </ul>
                </nav>
              </div>
            </div>

            <div className="w-full px-4 lg:w-3/4">
              <div className="rounded-lg border border-stroke bg-white p-6 text-base leading-7 text-waterloo dark:border-strokedark dark:bg-blacksection dark:text-gray-400 sm:p-8 lg:mb-5 xl:p-10 [&_p]:mb-5 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:text-black dark:[&_h2]:text-white md:[&_h2]:text-2xl">
                <h1 id="create" className="mb-5 scroll-mt-32 text-2xl font-semibold leading-snug text-black dark:text-white md:text-3xl">Start with a space for your business</h1>

                <p>
                  Sign up, verify your email, and open your dashboard. Select
                  Create Space, give it a name, and add your logo, a welcome
                  message, and questions for your customers. Each space has its
                  own collection link and testimonial inbox.
                </p>
                <p>
                  Start with one product, service, or project. Keep your questions
                  specific: what did the customer need, what was their experience,
                  and what changed for them?
                </p>
                <h2 id="collect" className="scroll-mt-32">Invite customers to share their experience</h2>
                <p>Copy your collection link and send it to customers after a meaningful interaction. They can write a review, attach photos, or record or upload a video of up to two minutes. No customer account is needed.</p>
                <h2 id="manage" className="scroll-mt-32">Browse your testimonial inbox</h2>
                <p>Open Inbox and select your space to read reviews, view photos, and watch videos. You can delete a testimonial when you no longer want to keep it. Check your collection before sharing it publicly.</p>
                <h2 id="display" className="scroll-mt-32">Display your customer stories</h2>
                <p>Open Embed &amp; Scripts, choose a space, and select a Wall of Love or an individual testimonial. Pick a light or dark theme and, for the wall, a grid or carousel. Preview the result and copy the embed code into your website&apos;s HTML or embed block.</p>
                <p>The Wall of Love shows all testimonials in the selected space. It loads the current collection when a visitor opens the page. For a single story, use the individual testimonial option.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
