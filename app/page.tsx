import NavBar from "@/components/nav";
import FileExplorer from "@/components/file-explorer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            S3 File Explorer
          </h2>
          <p className="text-gray-600">
            Browse and manage your S3 bucket contents
          </p>
        </div>
        <FileExplorer />
      </main>
    </div>
  );
}
