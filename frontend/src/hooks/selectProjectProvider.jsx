import { createContext, useContext, useState, useEffect } from "react";

const SelectedProjectContext = createContext();

export function SelectedProjectProvider({ children }) {
  const [selectedProjectId, setProjectId] = useState(() => {
    const savedId = localStorage.getItem("selectedProjectId");
    return savedId !== null ? JSON.parse(savedId) : 0;
  });

  useEffect(() => {
    localStorage.setItem("selectedProjectId", JSON.stringify(selectedProjectId));
  }, [selectedProjectId]);

  return (
    <SelectedProjectContext.Provider value={{ selectedProjectId, setProjectId }}>
      {children}
    </SelectedProjectContext.Provider>
  );
}

// Custom Hook to use this context
export function useSelectedProjectContext() {
  return useContext(SelectedProjectContext);
}
