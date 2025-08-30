import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "S3 Buddy - Modern AWS S3 File Manager",
    short_name: "S3 Buddy",
    description:
      "Modern, secure AWS S3 file manager with enterprise-grade security",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    categories: ["productivity", "developer", "utilities"],
    lang: "en",
    dir: "ltr",
  };
}
