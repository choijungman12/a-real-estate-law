import { GlassCard, StatCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { withBase } from '@/lib/utils/href';
import Skyline from '@/components/hero/Skyline';
import {
  Sparkles,
  TrendingUp,
  Building2,
  Gavel,
  KeyRound,
  ScrollText,
  ArrowUpRight,
  MapPin,
  Calculator,
  GraduationCap,
  Map as MapIcon,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass-strong p-8 md:p-10 min-h-[420px]">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-[color:var(--accent)]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-10 size-72 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />
        <Skyline className="absolute inset-x-0 bottom-0 w-full opacity-80 pointer-events-none" />

        <div className="relative">
          <Badge tone="accent">REAL ESTATE × AI</Badge>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            한국 부동산 모든 데이터,
            <br />
            <span className="text-[color:var(--accent)]">한 화면에서.</span>
          </h1>
          <p className="mt-4 text-[color:var(--text-secondary)] max-w-xl text-sm md:text-base">
            공식 OPEN API 11종 + 14개 주제 법령 + 지지옥션 PDF AI 권리분석.
            경매·공매·실거래가·청약·분양·법령·뉴스를 자체 분석으로 통합합니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={withBase('/auction')}
              className="group inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] text-black px-5 py-3 text-sm font-semibold accent-glow"
            >
              <Sparkles className="size-4" /> 경매 권리분석 시작
              <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={withBase('/realestate')}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-sm text-white hover:bg-white/10"
            >
              실거래가 검색
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="연결된 OPEN API"
          value="11"
          delta={{ value: '+3 카테고리', positive: true }}
          hint="실거래가·온비드·V월드·법령·청약·LH 외"
          icon={<Building2 className="size-4" />}
        />
        <StatCard
          label="법령 카탈로그"
          value="14"
          delta={{ value: '주제별', positive: true }}
          hint="경매·재건축·도시개발·농지·세무 등"
          icon={<ScrollText className="size-4" />}
        />
        <StatCard
          label="AI 모델"
          value="Sonnet 4.6"
          hint="Claude 네이티브 PDF 입력"
          icon={<Sparkles className="size-4" />}
        />
        <StatCard
          label="지도 SDK"
          value="Kakao+VWorld"
          hint="2D 클러스터 + 3D 빌딩 (지적)"
          icon={<MapPin className="size-4" />}
        />
      </section>

      {/* Modules */}
      <section>
        <SectionHeader
          title="모듈"
          subtitle="14개 주제 + 경공매 + 시세 + 청약 + 법령 + 뉴스"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ModuleCard
            href="/auction"
            title="경매 권리분석"
            desc="지지옥션 PDF 업로드 → Claude가 말소기준권리·임차인 위험·법령 인용까지 자체 재분석"
            tag="AI · 핵심"
            icon={<Sparkles className="size-5" />}
            accent
          />
          <ModuleCard
            href="/realestate"
            title="실거래가"
            desc="국토부 OPEN API · 시군구·연월별 아파트 매매·전월세 즉시 조회"
            tag="MOLIT"
            icon={<TrendingUp className="size-5" />}
          />
          <ModuleCard
            href="/onbid"
            title="공매 (온비드)"
            desc="한국자산관리공사(KAMCO) 캠코공매물건 실시간 리스트"
            tag="KAMCO"
            icon={<Gavel className="size-5" />}
          />
          <ModuleCard
            href="/applyhome"
            title="청약·분양"
            desc="청약홈 분양정보 + LH 분양임대공고"
            tag="REB+LH"
            icon={<KeyRound className="size-5" />}
          />
          <ModuleCard
            href="/law"
            title="법령 14주제"
            desc="경매·재건축·도시개발·농지·세무·전문가법 — 카테고리별 일괄 조회"
            tag="LAW · realestate_ai_01"
            icon={<ScrollText className="size-5" />}
          />
          <ModuleCard
            href="/news"
            title="부동산 뉴스"
            desc="네이버 뉴스 검색 API · 키워드별 최신 뉴스"
            tag="NAVER"
            icon={<Building2 className="size-5" />}
          />
          <ModuleCard
            href="/map"
            title="GIS 통합 지도"
            desc="카카오맵 + V월드 + 클러스터러 + 매물 마커"
            tag="MAP"
            icon={<MapIcon className="size-5" />}
            accent
          />
          <ModuleCard
            href="/calc"
            title="수지분석 계산기"
            desc="비례율·분담금·임대수익률·취득세·종부세 즉시 계산"
            tag="FINANCE"
            icon={<Calculator className="size-5" />}
          />
          <ModuleCard
            href="/study"
            title="학습 커리큘럼"
            desc="L1 기초 → L6 AI 활용 6단계 트랙"
            tag="STUDY"
            icon={<GraduationCap className="size-5" />}
          />
        </div>
      </section>

      {/* Pipeline diagram */}
      <section>
        <SectionHeader
          title="데이터 파이프라인"
          subtitle="공식 API → 자체 분석 → AI 출력"
        />
        <GlassCard className="p-6">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <Step
              n={1}
              title="공식 데이터 수집"
              items={['국토부 실거래가', '온비드 공매', '청약홈·LH', '국가법령정보', 'V월드 지적']}
            />
            <Step
              n={2}
              title="AI 자체 재분석"
              items={[
                '지지옥션 PDF → Claude 권리분석',
                '실거래가로 시장가치 산정',
                '법령 RAG 인용',
                '지지옥션 vs 자체 차이점 비교',
              ]}
            />
            <Step
              n={3}
              title="알림·전송"
              items={['텔레그램 봇 (입찰일 임박)', '카카오톡 알림톡 (사업자)', '대시보드 타임라인']}
            />
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

function ModuleCard({
  href,
  title,
  desc,
  tag,
  icon,
  accent,
}: {
  href: string;
  title: string;
  desc: string;
  tag: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <a href={withBase(href)} className="block group">
      <GlassCard className="h-full hover:border-white/20 transition group-hover:-translate-y-0.5 duration-200">
        <div className="flex items-start justify-between mb-3">
          <div
            className={
              accent
                ? 'grid place-items-center size-10 rounded-xl bg-[color:var(--accent)] text-black'
                : 'grid place-items-center size-10 rounded-xl bg-white/5 border border-white/10'
            }
          >
            {icon}
          </div>
          <Badge tone={accent ? 'accent' : 'neutral'}>{tag}</Badge>
        </div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm text-[color:var(--text-secondary)] mt-1">{desc}</p>
        <div className="mt-4 inline-flex items-center gap-1 text-xs text-[color:var(--text-muted)] group-hover:text-[color:var(--accent)]">
          열기 <ArrowUpRight className="size-3" />
        </div>
      </GlassCard>
    </a>
  );
}

function Step({
  n,
  title,
  items,
}: {
  n: number;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="grid place-items-center size-7 rounded-full bg-[color:var(--accent-soft)] text-[color:var(--accent)] text-xs font-bold">
          {n}
        </div>
        <div className="font-semibold">{title}</div>
      </div>
      <ul className="space-y-2 text-[color:var(--text-secondary)]">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2">
            <span className="mt-1.5 block size-1 rounded-full bg-[color:var(--accent)]" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
