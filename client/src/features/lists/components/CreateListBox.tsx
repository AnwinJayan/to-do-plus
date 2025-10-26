import { useState, useEffect } from "react";
import NewListForm from "./NewListForm";
import { FaChevronLeft } from "react-icons/fa";
import NewListWithAIForm from "./NewListWithAIForm";

export default function CreateListBox(props: {
  onSubmitBlank?: (data: { title: string }) => Promise<void>;
  onSubmitAI?: (data: { prompt: string }) => Promise<void>;
  isSubmitting?: boolean;
  externalError?: string;
  resetSignal?: any;
}) {
  const {
    onSubmitBlank,
    isSubmitting,
    externalError,
    resetSignal,
    onSubmitAI,
  } = props;
  const [mode, setMode] = useState<"choice" | "blank" | "ai">("choice");

  useEffect(() => {
    setMode("choice");
  }, [resetSignal]);

  return (
    <div className="bg-base-200 rounded-box p-4 mt-4">
      <div className="mb-3 text-lg font-semibold">
        Create{" "}
        {mode === "choice"
          ? "list"
          : mode === "blank"
          ? "Blank list"
          : "List using AI"}
      </div>
      {mode !== "choice" && (
        <button
          className="btn btn-outline btn-sm mb-2 flex items-center"
          type="button"
          onClick={() => setMode("choice")}
        >
          <FaChevronLeft className="mr-2" />
          <span>Back</span>
        </button>
      )}
      {mode === "choice" && (
        <div className="flex flex-col gap-2">
          <button
            className="btn btn-primary w-full"
            type="button"
            onClick={() => setMode("blank")}
          >
            Blank list
          </button>
          <button
            className="btn btn-outline btn-accent w-full"
            type="button"
            onClick={() => setMode("ai")}
          >
            Create with AI
          </button>
        </div>
      )}
      {mode === "blank" && (
        <div>
          <NewListForm
            onSubmit={onSubmitBlank || (() => Promise.resolve())}
            isSubmitting={isSubmitting}
            externalError={externalError}
          />
        </div>
      )}
      {mode === "ai" && (
        <div>
          <NewListWithAIForm
            onSubmit={onSubmitAI || (() => Promise.resolve())}
            isSubmitting={isSubmitting}
            externalError={externalError}
          />
        </div>
      )}
    </div>
  );
}
