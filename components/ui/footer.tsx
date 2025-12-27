import Link from "next/link";

// Import specific social media icons from lucide-react
import { Github, Linkedin, Globe, Twitter, MessageCircle } from "lucide-react";

export default function FooterSection() {
  return (
    <footer id="about-section" className="py-12 md:py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="my-6 flex flex-wrap justify-center gap-4 text-sm">
            {/* GitHub */}
            <Link
              href="https://github.com/asimar007/S3-Web-UI"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground block transition-colors duration-200 p-2 rounded-lg hover:bg-muted/50"
            >
              <Github className="size-6" />
            </Link>
            {/* LinkedIn */}
            <Link
              href="https://www.linkedin.com/in/asimar007"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground block transition-colors duration-200 p-2 rounded-lg hover:bg-muted/50"
            >
              <Linkedin className="size-6" />
            </Link>
            {/* Portfolio */}
            <Link
              href="https://www.asimsk.online/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
              className="text-muted-foreground hover:text-foreground block transition-colors duration-200 p-2 rounded-lg hover:bg-muted/50"
            >
              <Globe className="size-6" />
            </Link>
            {/* X (Twitter) */}
            <Link
              href="https://x.com/asim_ar007"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-muted-foreground hover:text-foreground block transition-colors duration-200 p-2 rounded-lg hover:bg-muted/50"
            >
              <Twitter className="size-6" />
            </Link>
            {/* WhatsApp */}
            <Link
              href="https://wa.me/919933672964"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-muted-foreground hover:text-foreground block transition-colors duration-200 p-2 rounded-lg hover:bg-muted/50"
            >
              <MessageCircle className="size-6" />
            </Link>
          </div>

          <div className="border-t border-border pt-6 mt-6">
            <span className="text-muted-foreground block text-center text-sm">
              Built with ❤️ by Asim
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
