'use client';

import { Search, Bell, Mic } from 'lucide-react';

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[color:var(--text-muted)]" />
          <input
            placeholder="주소·법령·키워드·사건번호로 검색…"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-9 py-2 text-sm placeholder:text-[color:var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30 focus:border-[color:var(--accent)]/30"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-[10px] text-[color:var(--text-muted)] border border-white/10 rounded px-1.5 py-0.5">
            ⌘ K
          </kbd>
        </div>
        <button className="hidden md:inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-[color:var(--text-secondary)] hover:bg-white/10">
          <Mic className="size-4" /> 음성으로 검색
        </button>
        <button className="relative grid place-items-center size-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[color:var(--accent)]" />
        </button>
        <div className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold">
          최
        </div>
      </div>
    </header>
  );
}
