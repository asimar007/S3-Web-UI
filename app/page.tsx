import { currentUser } from "@clerk/nextjs/server";
import { HeroSection } from "@/components/blocks/hero-section-1";
import FooterSection from "@/components/ui/footer";
import AuthenticatedApp from "@/components/AuthenticatedApp";

export default async function HomePage() {
  const user = await currentUser();

  return (
    <>
      {!user ? (
        <>
          <HeroSection />
          <FooterSection />
        </>
      ) : (
        <AuthenticatedApp />
      )}
    </>
  );
}
