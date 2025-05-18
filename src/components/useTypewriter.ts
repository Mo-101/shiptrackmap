import { useEffect, useState } from "react";

/**
 * useTypewriter - animates an array of strings, revealing each line step by step.
 * @param lines Array of lines to reveal.
 * @param delay Delay between lines (ms).
 * @returns Array of lines revealed so far.
 */
export function useTypewriter(lines: string[], delay = 700) {
  const [index, setIndex] = useState(0);
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    if (index < lines.length) {
      const timer = setTimeout(() => {
        setOutput(prev => [...prev, lines[index]]);
        setIndex(index + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
    // Reset if lines array changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, lines]);

  useEffect(() => {
    setIndex(0);
    setOutput([]);
  }, [lines]);

  return output;
}
