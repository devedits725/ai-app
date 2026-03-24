import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen,
  ExternalLink,
  Search,
  Globe,
  Filter
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";

interface StudyResource {
  id: string;
  name: string;
  description: string;
  category: "concepts" | "notes" | "practice";
  bestFor: string;
  url: string;
  tags: string[];
}

const studyResources: StudyResource[] = [
  // Concepts
  {
    id: "khan-academy",
    name: "Khan Academy",
    description: "Free online courses and lessons covering math, science, and more.",
    category: "concepts",
    bestFor: "Math & Science Concepts",
    url: "https://www.khanacademy.org",
    tags: ["math", "science", "free", "video"]
  },
  {
    id: "crash-course",
    name: "Crash Course",
    description: "Educational YouTube videos covering various subjects in an engaging way.",
    category: "concepts",
    bestFor: "Quick Learning",
    url: "https://www.youtube.com/c/crashcourse",
    tags: ["video", "engaging", "variety"]
  },
  {
    id: "mit-opencourseware",
    name: "MIT OpenCourseWare",
    description: "Free access to MIT course materials and lecture notes.",
    category: "concepts",
    bestFor: "Advanced Concepts",
    url: "https://ocw.mit.edu",
    tags: ["university", "advanced", "free"]
  },
  {
    id: "coursera",
    name: "Coursera",
    description: "Online courses from top universities and companies.",
    category: "concepts",
    bestFor: "Professional Learning",
    url: "https://www.coursera.org",
    tags: ["certificate", "professional", "university"]
  },
  
  // Notes
  {
    id: "quizlet",
    name: "Quizlet",
    description: "Create and study flashcards, games, and study tools.",
    category: "notes",
    bestFor: "Flashcards & Study Sets",
    url: "https://quizlet.com",
    tags: ["flashcards", "games", "study"]
  },
  {
    id: "evernote",
    name: "Evernote",
    description: "Organize notes, tasks, and schedules in one place.",
    category: "notes",
    bestFor: "Note Organization",
    url: "https://evernote.com",
    tags: ["organization", "notes", "productivity"]
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace for notes, tasks, and collaboration.",
    category: "notes",
    bestFor: "Comprehensive Notes",
    url: "https://notion.so",
    tags: ["workspace", "collaboration", "versatile"]
  },
  {
    id: "onenote",
    name: "Microsoft OneNote",
    description: "Digital notebook for capturing and organizing information.",
    category: "notes",
    bestFor: "Structured Note-Taking",
    url: "https://www.onenote.com",
    tags: ["microsoft", "structured", "free"]
  },
  
  // Practice
  {
    id: "leetcode",
    name: "LeetCode",
    description: "Platform for practicing coding interviews and algorithms.",
    category: "practice",
    bestFor: "Coding Practice",
    url: "https://leetcode.com",
    tags: ["coding", "algorithms", "interview"]
  },
  {
    id: "codecademy",
    name: "Codecademy",
    description: "Interactive coding lessons and hands-on learning.",
    category: "practice",
    bestFor: "Interactive Coding",
    url: "https://www.codecademy.com",
    tags: ["interactive", "coding", "beginner"]
  },
  {
    id: "brilliant",
    name: "Brilliant",
    description: "Interactive learning for math, science, and computer science.",
    category: "practice",
    bestFor: "Problem Solving",
    url: "https://brilliant.org",
    tags: ["interactive", "math", "science"]
  },
  {
    id: "duolingo",
    name: "Duolingo",
    description: "Free language learning through gamified lessons.",
    category: "practice",
    bestFor: "Language Practice",
    url: "https://duolingo.com",
    tags: ["language", "free", "gamified"]
  }
];

const categories = [
  { value: "all", label: "All Resources" },
  { value: "concepts", label: "Concepts" },
  { value: "notes", label: "Notes" },
  { value: "practice", label: "Practice" }
];

const categoryColors = {
  concepts: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  notes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  practice: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
};

const categoryIcons = {
  concepts: BookOpen,
  notes: Bookmark,
  practice: Globe
};

const StudyResourcesPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredResources = studyResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Sidebar title="Study Resources" icon={<BookOpen />}>
      <div className="p-6">
        {/* Beta Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-sm font-bold">
            🚀 Beta
          </span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Study Resources Hub</h1>
              <p className="text-muted-foreground mt-1">Curated educational websites and tools for learning.</p>
            </div>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/50 focus:ring-primary focus:border-primary/20 text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setSelectedCategory("concepts")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "concepts"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Concepts
            </button>
            <button
              onClick={() => setSelectedCategory("notes")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "notes"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setSelectedCategory("practice")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === "practice"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Practice
            </button>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => {
            const IconComponent = categoryIcons[resource.category];
            return (
              <div
                key={resource.id}
                className="bg-card rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-all hover:border-primary/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[resource.category]}`}>
                    {resource.category}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">Curated study materials and learning platforms.</p>
              </div>
            </div>
          </header>

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-border bg-muted/50 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Filter className="w-4 h-4 inline mr-2" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const CategoryIcon = categoryIcons[resource.category];
              return (
                <div key={resource.id} className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${categoryColors[resource.category]}`}>
                        {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">{resource.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{resource.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-primary">{resource.bestFor}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => openResource(resource.url)}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Site
                  </button>
                </div>
              );
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resources found matching your search.</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default StudyResourcesPage;
