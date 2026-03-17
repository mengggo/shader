import Logo from "@/components/basement.svg"
import { Link } from "@/components/ui/link"

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between p-safe font-mono uppercase 2xl:flex-row 2xl:items-end">
      <Link href="https://basement.studio/" className="link">
        <Logo className="w-148 text-secondary" />
      </Link>
      <div>
        <Link
          href="https://github.com/basementstudio/next-starter/generate"
          className="link"
        >
          use this template
        </Link>
        {" / "}
        <Link
          href="https://github.com/basementstudio/next-starter"
          className="link"
        >
          github
        </Link>
      </div>
    </footer>
  )
}
