import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
}

const PageHeader = ({ title, showBack = true }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 bg-background/80 backdrop-blur-md px-4 py-3 safe-top border-b border-border">
      {showBack && (
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-secondary active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-lg font-semibold truncate">{title}</h1>
    </header>
  );
};

export default PageHeader;
