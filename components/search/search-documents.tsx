"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, Sparkles, User, Bot, Trash2 } from "lucide-react";
import { SearchInput } from "@/components/search/search-input";
import { SearchResults } from "@/components/search/search-results";
import { SearchResult } from "@/types/search-result";
import { useSearch } from "@/lib/hooks/use-search";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const MESSAGES = [
  {
    id: "1",
    role: "user",
    content: "Hey, can you help me debug this React issue?",
    timestamp: new Date("2026-01-09T10:00:00"),
  },
  {
    id: "2",
    role: "assistant",
    content: "Sure. What’s the error you’re seeing and where does it happen?",
    timestamp: new Date("2026-01-09T10:00:05"),
  },
  {
    id: "3",
    role: "user",
    content: "State updates aren’t triggering a re-render.",
    timestamp: new Date("2026-01-09T10:00:20"),
  },
  {
    id: "4",
    role: "assistant",
    content: "Are you mutating state directly or using the setter properly?",
    timestamp: new Date("2026-01-09T10:00:30"),
  },
  {
    id: "5",
    role: "user",
    content: "I might be mutating an array before calling setState.",
    timestamp: new Date("2026-01-09T10:00:45"),
  },
  {
    id: "6",
    role: "assistant",
    content: "That’ll do it. React won’t detect changes if the reference stays the same.",
    timestamp: new Date("2026-01-09T10:00:55"),
  },
  {
    id: "7",
    role: "user",
    content: "So I should create a new array instead?",
    timestamp: new Date("2026-01-09T10:01:10"),
  },
  {
    id: "8",
    role: "assistant",
    content: "Exactly. Use spread, map, or filter to return a new array.",
    timestamp: new Date("2026-01-09T10:01:20"),
  },
  {
    id: "9",
    role: "user",
    content: "Got it. That fixed the issue.",
    timestamp: new Date("2026-01-09T10:01:40"),
  },
  {
    id: "10",
    role: "assistant",
    content: "Nice. If React feels unpredictable, it’s almost always a mutation problem.",
    timestamp: new Date("2026-01-09T10:01:50"),
  },
  {
    id: "10",
    role: "assistant",
    content: "Nice. If React feels unpredictable, it’s almost always a mutation problem.",
    timestamp: new Date("2026-01-09T10:01:50"),
  },
  {
    id: "10",
    role: "assistant",
    content: "Nice. If React feels unpredictable, it’s almost always a mutation problem.",
    timestamp: new Date("2026-01-09T10:01:50"),
  },
  {
    id: "10",
    role: "assistant",
    content: "Nice. If React feels unpredictable, it’s almost always a mutation problem.",
    timestamp: new Date("2026-01-09T10:01:50"),
  },
  {
    id: "10",
    role: "assistant",
    content: "Nice. If React feels unpredictable, it’s almost always a mutation problem.",
    timestamp: new Date("2026-01-09T10:01:50"),
  },
  {
    id: "10",
    role: "assistant",
    content: "Nice. If React feels unpredictable, it’s almost always a mutation problem.",
    timestamp: new Date("2026-01-09T10:01:50"),
  },
]

export default function SearchDocuments({
  organisationSlug,
  workspaceSlug,
}: {
  organisationSlug: string;
  workspaceSlug: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"simple" | "rag">("simple");
  // const [messages, setMessages] = useState<Message[]>([]);
  const [messages, setMessages] = useState<Message[]>([
  {
    id: "1",
    role: "user",
    content: "Hey, can you help me debug this React issue?",
    timestamp: new Date("2026-01-09T10:00:00"),
  },
  {
    id: "2",
    role: "assistant",
    content: "Sure. What’s the error you’re seeing and where does it happen?",
    timestamp: new Date("2026-01-09T10:00:05"),
  },
  {
    id: "3",
    role: "user",
    content: "State updates aren’t triggering a re-render.",
    timestamp: new Date("2026-01-09T10:00:20"),
  },
  {
    id: "4",
    role: "assistant",
    content: "Are you mutating state directly or using the setter properly?",
    timestamp: new Date("2026-01-09T10:00:30"),
  },
  {
    id: "5",
    role: "user",
    content: "I might be mutating an array before calling setState.",
    timestamp: new Date("2026-01-09T10:00:45"),
  },
  {
    id: "6",
    role: "assistant",
    content: "That’ll do it. React won’t detect changes if the reference stays the same.",
    timestamp: new Date("2026-01-09T10:00:55"),
  },
  {
    id: "7",
    role: "user",
    content: "So I should create a new array instead?",
    timestamp: new Date("2026-01-09T10:01:10"),
  },
  {
    id: "8",
    role: "assistant",
    content: "Exactly. Use spread, map, or filter to return a new array.",
    timestamp: new Date("2026-01-09T10:01:20"),
  },
  {
    id: "9",
    role: "user",
    content: "Got it. That fixed the issue.",
    timestamp: new Date("2026-01-09T10:01:40"),
  },
  {
    id: "10",
    role: "assistant",
    content: "Nice. If React feels unpredictable, it’s almost always a mutation problem.",
    timestamp: new Date("2026-01-09T10:01:50"),
  },
]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  const searchOptions = useMemo(() => ({
    onSuccess: (data: SearchResult[]) => {
      if (
        searchMode === "rag" &&
        searchQuery &&
        data &&
        data.length > 0
      ) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data[0]?.snippet || "I found some information for you.",
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setSearchQuery(""); 
      }
    },
  }), [searchMode, searchQuery]);

  const { results, isLoading } = useSearch(
    workspaceSlug,
    organisationSlug,
    searchQuery,
    searchMode,
    searchOptions
  );


  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);


  const handleSearch = () => {
    const normalizedQuery = inputValue.trim();
    if (!normalizedQuery) return;

    if (searchMode === "rag") {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: normalizedQuery,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setSearchQuery(normalizedQuery);
      setInputValue("");
    } else {
      setSearchQuery(normalizedQuery.toLowerCase());
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSearchQuery("");
  };

  const filteredResults = results.filter((result) => {
    const title = result?.title?.toLowerCase() ?? "";
    const snippet = result?.snippet?.toLowerCase() ?? "";
    const normalizedQuery = searchQuery.toLowerCase();
    return title.includes(normalizedQuery) || snippet.includes(normalizedQuery);
  });

  console.log(`MESSAGES`, messages)

  return (
    <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background">
      {/* Header with Mode Toggle */}
      <header className="shrink-0 w-full px-6 py-4 border-b border-border bg-card/10 backdrop-blur-xl z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <ToggleGroup
              type="single"
              value={searchMode}
              onValueChange={(value) => {
                if (value) {
                  const newMode = value as "simple" | "rag";
                  setSearchMode(newMode);
                  setMessages([]);
                  setSearchQuery("");
                  setInputValue("");
                }
              }}
              variant="outline"
            >
              <ToggleGroupItem 
                value="simple" 
                className="rounded-full px-6 data-[state=on]:bg-background data-[state=on]:shadow-md transition-all text-sm font-medium"
              >
                <Search className="h-4 w-4 mr-2" />
                Simple Search
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="rag" 
                className="rounded-full px-6 data-[state=on]:bg-background data-[state=on]:shadow-md transition-all text-sm font-medium"
              >
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                RAG AI Search
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          {searchMode === "rag" && messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearChat} 
              title="Clear conversation"
              className="hover:bg-destructive/10 hover:text-destructive shrink-0 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative h-screen">
        <div className="flex-1 overflow-y-auto px-6 py-12 scroll-smooth scrollbar-hide">
          <div className="max-w-3xl mx-auto w-full">
            {searchMode === "simple" ? (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tight text-center">Search Documents</h1>
                  <p className="text-muted-foreground text-center max-w-lg mx-auto">
                    Quickly find documents by title or keywords across your entire knowledge base.
                  </p>
                </div>
                <SearchInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={handleSearch}
                  isLoading={isLoading}
                  autoFocus={true}
                  placeholder="Search your documents…"
                />
                <SearchResults
                  results={filteredResults}
                  searchQuery={searchQuery}
                  isLoading={isLoading}
                  hasSearched={searchQuery !== ""}
                  onResultClick={(res) => console.log(res)}
                />
              </div>
            ) : (
              <div className="space-y-10 pb-32">
                {messages.length !== 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in zoom-in-95 duration-1000">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                      <div className="relative w-24 h-24 rounded-3xl bg-linear-to-br from-primary to-primary/40 flex items-center justify-center shadow-2xl shadow-primary/20 ring-1 ring-white/20">
                        <Sparkles className="w-12 h-12 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h2 className="text-4xl font-bold tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Meet your AI Knowledge Assistant
                      </h2>
                      <p className="text-muted-foreground text-xl max-w-md mx-auto leading-relaxed">
                        I can help you navigate through your documents. Just ask a question and I&pos;ll find the answers.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
                      {[
                        "What is the company's remote work policy?",
                        "How do I set up my developer environment?",
                        "Where can I find the latest marketing assets?",
                        "Summarize the Q4 strategy document."
                      ].map((hint) => (
                        <button 
                          key={hint}
                          onClick={() => { setInputValue(hint); handleSearch(); }}
                          className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all text-left text-sm group"
                        >
                          <span className="text-muted-foreground group-hover:text-foreground transition-colors">{hint}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    {MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-5 group animate-in slide-in-from-bottom-4 fade-in duration-700",
                          message.role === "user" ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role === "assistant" && (
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
                            <Bot className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-6 py-4 shadow-sm text-[15px] leading-relaxed",
                            message.role === "user"
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/5 rounded-tr-none"
                              : "bg-card border border-border/60 text-foreground rounded-tl-none ring-1 ring-border/5"
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === "user" && (
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border/50 shadow-sm mt-auto">
                            <User className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex gap-5 animate-in slide-in-from-bottom-2 fade-in duration-500">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
                          <Bot className="w-6 h-6 text-primary animate-pulse" />
                        </div>
                        <div className="bg-card border border-border/60 rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-4 ring-1 ring-border/5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-duration:1s]" />
                            <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
                          </div>
                          <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Assistant is thinking</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            )}
          </div>
        </div>

        {/* Input area positioned at bottom for AI Search */}
        {searchMode === "rag" && (
          <div className="absolute bottom-0 left-0 right-0 p-8 pt-0 z-30 pointer-events-none bg-background">
            <div className="max-w-3xl mx-auto w-full pointer-events-auto">
              {/* <div className="absolute inset-x-0 -top-12 h-12 bg-linear-to-t from-background to-transparent" /> */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-primary/0 rounded-[22px] blur opacity-0 transition duration-500" />
                <SearchInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={handleSearch}
                  isLoading={isLoading}
                  autoFocus={true}
                  placeholder="Ask a question about your knowledge..."
        
                />
              </div>
              <p className="mt-3 text-center text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em]">
                AI-generated responses can be inaccurate. Please verify important information.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
