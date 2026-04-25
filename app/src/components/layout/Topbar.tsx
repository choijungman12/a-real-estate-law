'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Bell, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import { withBase } from '@/lib/utils/href';

type SpeechRecognitionResult = {
  transcript: string;
  isFinal: boolean;
};
type SpeechRecognitionEvent = {
  results: { [k: number]: { [k: number]: SpeechRecognitionResult; isFinal: boolean } };
  resultIndex: number;
};
type SpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

type ParseResult = {
  intent: string;
  sigunguName?: string;
  ym?: string;
  keyword?: string;
  reasoning?: string;
  route: string;
  error?: string;
};

export default function Topbar() {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<ParseResult | null>(null);
  const recRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setUnsupported(true);
      return;
    }
    const rec = new Ctor();
    rec.lang = 'ko-KR';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const arr = Object.values(e.results);
      const last = arr[arr.length - 1];
      const trans = last?.[0]?.transcript ?? '';
      setText(trans);
      if (last?.isFinal) {
        void parseAndRoute(trans);
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
  }, []);

  async function parseAndRoute(query: string) {
    if (!query.trim()) return;
    setParsing(true);
    setResult(null);
    try {
      const res = await fetch('/api/voice/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: query }),
      });
      const j = (await res.json()) as ParseResult;
      setResult(j);
      if (res.ok && j.route) {
        setTimeout(() => {
          window.location.href = withBase(j.route);
        }, 800);
      }
    } catch (e) {
      setResult({
        intent: 'unknown',
        route: '/',
        error: e instanceof Error ? e.message : 'error',
      });
    } finally {
      setParsing(false);
    }
  }

  function toggle() {
    if (!recRef.current) return;
    if (listening) {
      recRef.current.stop();
      setListening(false);
    } else {
      setText('');
      setResult(null);
      try {
        recRef.current.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    void parseAndRoute(text);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 py-3">
        <form onSubmit={submit} className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[color:var(--text-muted)]" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              listening
                ? '듣고 있습니다…'
                : '예: 강남구 지난달 실거래가 / 재건축 뉴스 / 비례율 계산'
            }
            className="w-full rounded-xl bg-white/5 border border-white/10 px-9 py-2 text-sm placeholder:text-[color:var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/50 focus:border-[color:var(--accent)]/50"
            aria-label="검색 (음성·텍스트, AI 인텐트 자동 라우팅)"
          />
          {(listening || parsing) && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 size-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </form>
        <button
          type="button"
          onClick={toggle}
          disabled={unsupported}
          title={unsupported ? '브라우저 미지원' : '음성 검색 (한국어, AI 인텐트)'}
          className={`hidden md:inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
            listening
              ? 'bg-[color:var(--accent)] text-black border-transparent'
              : unsupported
                ? 'bg-white/5 border-white/5 text-[color:var(--text-muted)] opacity-50'
                : 'bg-white/5 border-white/10 text-[color:var(--text-secondary)] hover:bg-white/10'
          }`}
        >
          {listening ? (
            <Mic className="size-4" />
          ) : unsupported ? (
            <MicOff className="size-4" />
          ) : (
            <Mic className="size-4" />
          )}
          {listening ? '듣는 중…' : 'AI 음성'}
        </button>
        <button className="relative grid place-items-center size-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10">
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[color:var(--accent)]" />
        </button>
        <div className="grid place-items-center size-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold">
          최
        </div>
      </div>

      {/* AI parse result strip */}
      {(parsing || result) && (
        <div className="border-t border-white/5 bg-black/20">
          <div className="px-5 py-2 flex items-center gap-3 text-xs">
            {parsing && (
              <>
                <Loader2 className="size-3 animate-spin text-[color:var(--accent)]" />
                <span className="text-[color:var(--text-muted)]">Claude Haiku 4.5 인텐트 분석…</span>
              </>
            )}
            {result && !parsing && (
              <>
                <Sparkles className="size-3 text-[color:var(--accent)]" />
                {result.error ? (
                  <span className="text-red-300">{result.error}</span>
                ) : (
                  <>
                    <span className="text-[color:var(--text-secondary)]">
                      <span className="font-semibold text-[color:var(--accent)]">
                        {result.intent}
                      </span>
                      {result.sigunguName && ` · ${result.sigunguName}`}
                      {result.ym && ` · ${result.ym}`}
                      {result.keyword && ` · "${result.keyword}"`}
                    </span>
                    <span className="text-[color:var(--text-muted)]">→ {result.route}</span>
                    {result.reasoning && (
                      <span className="text-[color:var(--text-muted)] ml-auto truncate hidden md:inline">
                        💡 {result.reasoning}
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
