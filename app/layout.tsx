import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { type PropsWithChildren, Suspense } from "react"
import { Link } from "@/components/ui/link"
import { themes } from "@/lib/styles/colors"
import { fontsVariable } from "@/lib/styles/fonts"
import "@/lib/styles/css/index.css"
import { cn } from "@/lib/styles/cn"

const APP_NAME = "NextStarter"
const APP_DEFAULT_TITLE = "Basement Starter"
const APP_TITLE_TEMPLATE = "%s - Basement Starter"
const APP_DESCRIPTION =
  "A modern starter kit for building web applications with Next.js"
const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://localhost:3000"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  applicationName: APP_NAME,
  authors: [{ name: "basement.studio", url: "https://basement.studio" }],
  description: APP_DESCRIPTION,
  formatDetection: { telephone: false },
  metadataBase: new URL(APP_BASE_URL),
  openGraph: {
    description: APP_DESCRIPTION,
    images: [
      {
        alt: APP_DEFAULT_TITLE,
        height: 630,
        url: "/opengraph-image.jpg",
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    type: "website",
    url: APP_BASE_URL,
  },
  other: {
    "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  },
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  twitter: {
    card: "summary_large_image",
    description: APP_DESCRIPTION,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: "normal",
  themeColor: themes.dark.primary,
}

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn(fontsVariable, geist.className)}
      // NOTE: This is due to the data-theme attribute being set which causes hydration errors
      suppressHydrationWarning
    >
      <body>
        {/* Skip link for keyboard navigation accessibility */}
        <Suspense fallback={null}>
          <Link
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            Skip to main content
          </Link>
        </Suspense>

        {children}
      </body>
    </html>
  )
}
