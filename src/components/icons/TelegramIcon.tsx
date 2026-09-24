import { cn } from "@/lib/utils";

export function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("size-5 shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M22.264 5.417 18.913 21.206c-.251 1.089-1.002 1.357-2.028.845l-5.598-4.126-2.699 2.599c-.299.299-.549.549-1.126.549l.401-5.692 10.537-9.519c.462-.413-.101-.643-.719-.231L6.089 14.311 1.065 12.61c-1.175-.359-1.196-1.175.246-1.743L20.672 3.753c.978-.407 1.832.233 1.592 1.664z" />
    </svg>
  );
}
