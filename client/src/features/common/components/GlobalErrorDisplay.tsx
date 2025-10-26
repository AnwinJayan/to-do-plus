import { BiErrorAlt } from "react-icons/bi";

interface Props {
  message: string;
}

export default function GlobalErrorDisplay({ message }: Props) {
  return (
    <div className="alert alert-error shadow-lg m-3">
      <BiErrorAlt className="w-6 h-6" />
      <div>
        <h3 className="font-bold">Error</h3>
        <div className="text-xs">{message}</div>
      </div>
    </div>
  );
}
