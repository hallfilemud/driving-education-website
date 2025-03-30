interface AdPlaceholderProps {
  size?: "small" | "medium" | "large" | "banner";
  className?: string;
}

export default function AdPlaceholder({ size = "banner", className = "" }: AdPlaceholderProps) {
  let height = "h-24";
  let text = "Advertisement Placeholder (728x90)";
  
  if (size === "small") {
    height = "h-16";
    text = "Advertisement (300x100)";
  } else if (size === "medium") {
    height = "h-32";
    text = "Advertisement (300x200)";
  } else if (size === "large") {
    height = "h-64";
    text = "Advertisement (300x600)";
  }
  
  return (
    <div className={`py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`${height} flex items-center justify-center border border-dashed border-neutral-300 rounded-lg bg-[repeating-linear-gradient(45deg,#f0f0f0,#f0f0f0_10px,#f9f9f9_10px,#f9f9f9_20px)]`}>
          <p className="text-neutral-500 font-medium">{text}</p>
        </div>
      </div>
    </div>
  );
}
