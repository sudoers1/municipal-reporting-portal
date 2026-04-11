export default function Footer() {
  return (
    <footer className="w-full px-6 py-4 bg-brand-primary text-center text-sm text-white dark:bg-brand-primary">
      © {new Date().getFullYear()}{" "}
      <a
        href="https://github.com/sudoers1"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline font-semibold"
      >
        sudoers1
      </a>
      . All rights reserved.
    </footer>
  );
}
