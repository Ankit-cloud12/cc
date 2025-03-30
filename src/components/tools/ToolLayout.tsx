import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ToolLayoutProps {
  children: ReactNode;
  title?: string;
  hideHeader?: boolean;
}

const ToolLayout = ({ children, title = "Text Case Converter", hideHeader = false }: ToolLayoutProps) => {
  return (
    <div className="w-full bg-zinc-800 text-white min-h-screen">
      {/* Header with navigation */}
      {!hideHeader && (
        <header className="bg-zinc-900 p-3 flex items-center">
          <div className="flex-1 flex items-center">
            <Link
              to="/"
              className="bg-white text-black font-bold px-3 py-2 rounded mr-4"
            >
              Convert Case
            </Link>
            <nav className="hidden md:flex space-x-1">
              <div className="relative group">
                <Button variant="ghost" className="text-white hover:bg-zinc-700">
                  Text Modification/Formatting
                </Button>
                <div className="absolute left-0 mt-2 w-64 bg-zinc-800 shadow-lg rounded-md p-2 hidden group-hover:block z-50">
                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      to="/apa-format-converter-generator"
                      className="text-gray-300 hover:text-white hover:bg-zinc-700 px-3 py-1 rounded text-sm"
                    >
                      APA Format Converter & Generator
                    </Link>
                    <Link
                      to="/big-text-generator"
                      className="text-gray-300 hover:text-white hover:bg-zinc-700 px-3 py-1 rounded text-sm"
                    >
                      Big Text Generator
                    </Link>
                    <Link
                      to="/bold-text-converter"
                      className="text-gray-300 hover:text-white hover:bg-zinc-700 px-3 py-1 rounded text-sm"
                    >
                      Bold Text Generator
                    </Link>
                    {/* Add other text modification tools here */}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Button variant="ghost" className="text-white hover:bg-zinc-700">
                  Data Tools
                </Button>
                <div className="absolute left-0 mt-2 w-64 bg-zinc-800 shadow-lg rounded-md p-2 hidden group-hover:block z-50">
                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      to="/csv-to-json"
                      className="text-gray-300 hover:text-white hover:bg-zinc-700 px-3 py-1 rounded text-sm"
                    >
                      CSV to JSON Converter
                    </Link>
                    <Link
                      to="/base64-decode-encode"
                      className="text-gray-300 hover:text-white hover:bg-zinc-700 px-3 py-1 rounded text-sm"
                    >
                      Base64 Encoder/Decoder
                    </Link>
                    <Link
                      to="/json-stringify-text"
                      className="text-gray-300 hover:text-white hover:bg-zinc-700 px-3 py-1 rounded text-sm"
                    >
                      JSON Stringify
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="text-lg font-semibold">
            {title}
          </div>
        </header>
      )}
      
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export { ToolLayout };
