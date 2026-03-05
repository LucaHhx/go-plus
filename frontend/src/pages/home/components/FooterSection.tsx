export default function FooterSection() {
  return (
    <footer className="px-4 pb-8 text-center">
      <div className="flex items-center justify-center gap-4 text-txt-secondary text-sm">
        <span className="cursor-pointer hover:text-white transition-colors">
          Privacy Policy
        </span>
        <span className="text-txt-muted">|</span>
        <span className="cursor-pointer hover:text-white transition-colors">
          Terms Of Service
        </span>
      </div>
    </footer>
  );
}
