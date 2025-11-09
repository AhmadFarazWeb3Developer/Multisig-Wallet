import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  setOperation: (value: string) => void;
}

export default function CustomSelect({ setOperation }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Select Operation");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const options = [
    "Transfer ETH",
    "Add Owner with Threshold",
    "Remove Owner",
    "Swap Owner",
    "Change Threshold",
    "Set Guard",
    "Transfer Token",
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer w-full flex justify-between items-center text-left bg-transparent border-b border-white/10 py-3 text-white text-sm focus:outline-none focus:border-[#eb5e28] transition-colors"
      >
        <span>{selected}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180 text-[#eb5e28]" : "text-white/60"
          }`}
        />
      </button>

      {open && (
        <ul className="absolute w-full bg-black text-white border border-white/10 rounded-md mt-1 z-10 max-h-60 overflow-y-auto scrollbar-hide">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                setSelected(opt);
                setOperation(opt);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-[#eb5e28] cursor-pointer transition-colors"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
