import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  page: number;
  setPage: (val: number) => void;
  hasMore: boolean;
}

export default function PaginationControls({ page, setPage, hasMore }: Props) {
  return (
    <div className="flex justify-center mt-6">
      <div className="join">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="join-item btn"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>

        <button className="join-item btn no-animation hover:no-underline">
          Page {page}
        </button>

        <button
          onClick={() => setPage(page + 1)}
          disabled={!hasMore}
          className="join-item btn"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
