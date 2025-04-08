// pages/Home.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import RepoList from "@/components/RepoList";
import CommitsChart from "@/components/CommitsChart";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [submittedUser, setSubmittedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const formatUsername = (input: string) => {
    return input.trim().toLowerCase().replace(/\s+/g, "-");
  };

  const validateUsername = (name: string) => {
    return /^[a-zA-Z0-9-]+$/.test(name);
  };

  const checkUserExists = async (name: string) => {
    const res = await fetch(`https://api.github.com/users/${name}`);
    return res.status !== 404;
  };

  const handleSubmit = async () => {
    const formatted = formatUsername(username);

    if (!formatted) {
      toast.error("Please enter a GitHub username.");
      return;
    }

    if (!validateUsername(formatted)) {
      toast.error("Username can only contain letters, numbers, and dashes.");
      return;
    }

    setLoading(true);
    const exists = await checkUserExists(formatted);
    setLoading(false);

    if (!exists) {
      toast.error("GitHub user not found. Please check the spelling.");
      setIsValid(false);
      return;
    }

    setIsValid(true);
    setSubmittedUser(formatted);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-10 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">
        🔍 GitHub User Profile Analyzer
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Input
          placeholder="Enter GitHub username (e.g., Banda Manjunatha)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="flex-1 bg-gray-800 border-gray-700 text-white"
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Analyze"}
        </Button>
      </div>

      {!isValid && (
        <p className="text-red-400 text-sm text-center">
          Please enter a valid GitHub username.
        </p>
      )}

      {submittedUser && isValid && (
        <div className="space-y-8">
          <RepoList username={submittedUser} />
          <CommitsChart username={submittedUser} />
        </div>
      )}
    </div>
  );
}
