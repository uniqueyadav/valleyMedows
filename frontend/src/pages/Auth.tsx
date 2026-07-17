import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Auth() {
  useEffect(() => {
    document.title = "Admin login — Valley Medows";
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-warm">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8">
        <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">← Back to site</Link>
        <h1 className="font-serif text-3xl mt-4 mb-2">Sign-in disabled</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The backend has been removed from this site, so there is nothing to sign in to. Rooms, pricing and gallery content is now edited directly in the codebase.
        </p>
        <Button asChild className="w-full"><Link to="/">Back to site</Link></Button>
      </div>
    </div>
  );
}