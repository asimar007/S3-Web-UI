import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HeroSection } from "@/components/blocks/hero-section-1";
import FooterSection from "@/components/ui/footer";

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <HeroSection />
      <FooterSection />
    </>
  );
}
