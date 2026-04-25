'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Bell, Mic, MicOff } from 'lucide-react';
import { withBase } from '@/lib/utils/href';

// minimal Web Speech API types
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

const VOICE_INTENTS: { keywords: string[]; href: string }[] = [
  { keywords: ['실거래', '시세', '아파트 가격'], href: '/realestate' },
  { keywords: ['공매', '온비드'], href: '/onbid' },
  { keywords: ['경매', '권리분석', 'PDF'], href: '/auction' },
  { keywords: ['청약', '분양'], href: '/applyhome' },
  { keywords: ['법령', '법률', '재개발', '재건축', '농지', '산지'], href: '/law' },
  { keywords: ['지도', 'GIS', '매물 보기'], href: '/map' },
  { keywords: ['뉴스', '기사'], href: '/news' },
  { keywords: ['계산', '비례율', '분담금', '수익률', '취득세', '종부세'], href: '/calc' },
  { keywords: ['공부', '스터디', '커리큘럼', '강의'], href: '/study' },
];

function routeFromTranscript(text: string): string | null {
  const lower = text.toLowerCase();
  for (const intent of VOICE_INTENTS) {
    for (const k of intent.keywords) {
      if (lower.includes(k.toLowerCase())) return intent.href;
    }
  }
  return null;
}

export default function Topbar() {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
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
        const target = routeFromTranscript(trans);
        if (target) {
          window.location.href = withBase(target);
        }
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
  }, []);

  function toggle() {
    if (!recRef.current) return;
    if (listening) {
      recRef.current.stop();
      setListening(false);
    } else {
      setText('');
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
    const target = routeFromTranscript(text);
    if (target) window.location.href = withBase(target);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-5 py-3">
        <form onSubmit={submit} className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[color:var(--text-muted)]" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={listening ? '듣고 있습니다…' : '주소·법령·키워드·사건번호 — 또는 마이크 클릭'}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-9 py-2 text-sm placeholder:text-[color:var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30 focus:border-[color:var(--accent)]/30"
          />
          {listening && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 size-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </form>
        <button
          type="button"
          onClick={toggle}
          disabled={unsupported}
          title={unsupported ? '브라우저 미지원' : '음성 검색 (한국어)'}
          className={`hidden md:inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
            listening
              ? 'bg-[color:var(--accent)] text-black border-transparent'
              : unsupported
                ? 'bg-white/5 border-white/5 text-[color:var(--text-muted)] opacity-50'
                : 'bg-white/5 border-white/10 text-[color:var(--text-secondary)] hover:bg-white/10'
          }`}
        >
          {listening ? <Mic className="size-4" /> : unsupported ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          {listening ? '듣는 중…' : '음성'}
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
