export default function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-background-light rounded-full"></div>
          <div className="w-16 h-16 border-4 border-team-primary rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }