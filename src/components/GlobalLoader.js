// components/GlobalLoader.jsx
import { useSelector } from "react-redux";

const GlobalLoader = () => {
  const loading = useSelector((state) => state.loader.loading);
  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="loader border-4 border-yellow-500 border-t-transparent rounded-full w-12 h-12 animate-spin" />
    </div>
  );
};

export default GlobalLoader;
