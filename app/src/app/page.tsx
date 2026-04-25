import { GlassCard, StatCard, Badge, SectionHeader } from '@/components/ui/Glass';
import { withBase } from '@/lib/utils/href';
import WhiteCityScenario from '@/components/hero/WhiteCityScenario';
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
      <section className="relative overflow-hidden rounded-3xl bg-white border border-[color:var(--border-subtle)] p-8 md:p-14">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 좌측: 카피 */}
          <div className="relative z-10">
            <span className="hero-eyebrow">원스톱 부동산 AI</span>
            <h1 className="hero-title mt-2">
              부동산의 전 과정<br />
              <span className="text-[color:var(--accent)]">처음부터 끝까지</span>
            </h1>
            <p className="mt-6 text-[color:var(--text-secondary)] max-w-md text-base leading-relaxed">
              경매·공매·실거래가·청약·재개발 수지분석부터<br />
              법령·뉴스·정책까지 — REAL ESTATE AI가 한 번에 도와드립니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={withBase('/auction')} className="btn-primary">
                <Sparkles className="size-4" /> 권리분석 상담 시작
                <ArrowUpRight className="size-4" />
              </a>
              <a href={withBase('/map')} className="btn-secondary">
                <MapIcon className="size-4" /> GIS 지도 열기
              </a>
            </div>
          </div>
          {/* 우측: Flexity 톤 — 흰 도시 미니어처 + 4단계 컬러 빌딩 시나리오 */}
          <div className="relative">
            <WhiteCityScenario className="w-full h-auto max-w-[640px] mx-auto" />
          </div>
        </div>
      </section>

      {/* 큰 호스트 카피 (HOWBUILD 두 번째 섹션 톤) */}
      <section className="text-center py-6 md:py-10">
        <span className="section-eyebrow">사업성 분석부터 권리분석까지</span>
        <h2 className="section-title mt-2">
          복잡하고 어려운 부동산<br />
          <span className="text-[color:var(--accent)]">결정하기 어렵지 않으세요?</span>
        </h2>
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
