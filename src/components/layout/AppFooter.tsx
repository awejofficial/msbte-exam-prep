export default function AppFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 text-center mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} MSBTE Exam Prep. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Focus on your studies and ace the MSBTE exam!
        </p>
      </div>
    </footer>
  );
}
