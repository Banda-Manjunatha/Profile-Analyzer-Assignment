// components/RepoList.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
}

export default function RepoList({ username }: { username: string }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reposPerPage = 10;

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then((res) => res.json())
      .then((data) => setRepos(data))
      .catch(() => setRepos([]));
  }, [username]);

  const indexOfLast = currentPage * reposPerPage;
  const indexOfFirst = indexOfLast - reposPerPage;
  const currentRepos = repos.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(repos.length / reposPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      {currentRepos.map((repo) => (
        <Card key={repo.id} className="bg-gray-800 text-white">
          <CardContent className="p-4">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold hover:underline"
            >
              {repo.name}
            </a>
            <p className="text-sm text-gray-400">
              {repo.description || "No description"}
            </p>
          </CardContent>
        </Card>
      ))}

      {repos.length > reposPerPage && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrev}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            <PaginationItem className="text-sm text-white mx-2 px-3 py-1 rounded bg-gray-700">
              {currentPage} / {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
