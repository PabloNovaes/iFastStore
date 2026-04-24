"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SVGProps } from "react";

const SvgLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <rect width="32" height="32" rx="16" fill="white" />
    <path
      d="M22.0363 15.8016L14.1613 25.1766C14.0779 25.2755 13.9677 25.3416 13.8475 25.3649C13.7272 25.3882 13.6035 25.3674 13.4948 25.3057C13.3861 25.2439 13.2985 25.1446 13.2451 25.0227C13.1917 24.9007 13.1754 24.7628 13.1988 24.6297L14.2295 18.9008L10.1774 17.2102C10.0904 17.174 10.0128 17.1144 9.95154 17.0368C9.89029 16.9592 9.84729 16.8659 9.8264 16.7653C9.80551 16.6647 9.80737 16.5599 9.83181 16.4603C9.85626 16.3607 9.90253 16.2694 9.96649 16.1945L17.8415 6.81953C17.9249 6.72057 18.0351 6.65446 18.1553 6.63117C18.2756 6.60788 18.3994 6.62867 18.508 6.69041C18.6167 6.75214 18.7043 6.85148 18.7577 6.97342C18.8111 7.09536 18.8274 7.2333 18.8041 7.36641L17.7705 13.1016L21.8226 14.7898C21.909 14.8263 21.9859 14.8857 22.0467 14.9631C22.1075 15.0404 22.1502 15.1331 22.1711 15.2332C22.1919 15.3332 22.1903 15.4373 22.1663 15.5365C22.1423 15.6356 22.0967 15.7267 22.0335 15.8016H22.0363Z"
      fill="black"
    />
  </svg>
);

export default function Maintenance() {
  return (
    <div className="dark min-h-screen bg-[#050505] text-slate-50 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] mb-12 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistema in Aggiornamento
          </div>

          <div className="relative mb-16">
            <h1 className="text-[100px] md:text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-transparent select-none font-telegraf tracking-tighter italic">
              LAVORI
            </h1>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-black border border-white/10 rounded-full shadow-2xl transition-transform duration-500 hover:scale-105">
                  <SvgLogo className="h-20 w-20 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-telegraf bg-gradient-to-r from-white via-white to-white/50 text-transparent bg-clip-text">
            Stiamo evolvendo.
          </h2>

          <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed font-light">
            Il nostro team sta lavorando per offrirti un&apos;esperienza
            superiore. Torneremo online con grandi novità molto presto.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 w-full justify-center items-center">
            <Button
              variant="ghost"
              size="lg"
              className="px-8 py-6 gap-2 text-slate-300 hover:text-white hover:bg-white/5 transition-all rounded-full border border-white/5"
              onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              Riprova
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="px-8 py-6 gap-3 w-full font-bold rounded-full bg-white text-black hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                Stato del Sistema
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-2 text-slate-500 text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>I tuoi dati sono al sicuro nei nostri server</span>
          </div>
        </div>
      </div>
    </div>
  );
}
