import { ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md sm:max-w-xl bg-surface border border-border rounded-xl p-6 shadow-xl flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-primary-foreground rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Design System Demo</h1>
            <p className="text-sm text-muted">Theme variables and Lucide icons operational</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded-lg flex flex-col gap-1">
            <span className="font-semibold text-sm">Primary Color</span>
            <span className="text-xs opacity-90">bg-primary / text-primary-foreground</span>
          </div>

          <div className="p-4 bg-secondary text-secondary-foreground rounded-lg flex flex-col gap-1 border border-border">
            <span className="font-semibold text-sm">Secondary Color</span>
            <span className="text-xs opacity-90">bg-secondary / text-secondary-foreground</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
          <div className="flex items-center gap-2 text-success text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>Success State</span>
          </div>
          <div className="flex items-center gap-2 text-error text-sm font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Error State</span>
          </div>
        </div>
      </div>
    </main>
  );
}
