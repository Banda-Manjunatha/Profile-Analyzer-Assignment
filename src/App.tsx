import Home from "./pages/Home";
import { Toaster } from "sonner";

export default function App() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <Toaster richColors position="top-center" />
      <Home />
    </main>
  );
}
