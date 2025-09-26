import { useEffect, useState } from "react";
import Papa, { ParseResult } from "papaparse";

export default function useCSV<T = any>(filePath: string) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    Papa.parse<T>(filePath, {
      download: true,
      header: true,
      complete: (results: ParseResult<T>) => {
        setData(results.data);
      },
    });
  }, [filePath]);

  return data;
}
