export default function Footer() {
  return (
    <footer className="w-full px-6 py-4 bg-gray-100 text-center text-sm text-gray-600 dark:bg-zinc-900 dark:text-zinc-400">
      © {new Date().getFullYear()} sudoers1. All rights reserved.
    </footer>
  );
}
