export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow-sm border">
        <h1 className="text-3xl font-bold mb-2">한국 부동산 종합 플랫폼</h1>
        <p className="text-zinc-600">
          공식 OPEN API 11종 + 지지옥션 PDF 권리분석 + Claude 4.6 기반 자체 분석
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          href="/realestate"
          title="실거래가 검색"
          desc="국토교통부 실거래가 API: 시군구·연월별 아파트 매매·전월세 조회"
          tag="MOLIT"
        />
        <FeatureCard
          href="/onbid"
          title="공매 물건"
          desc="온비드 (한국자산관리공사) 공매 물건 실시간 조회"
          tag="KAMCO"
        />
        <FeatureCard
          href="/auction"
          title="경매 권리분석 (PDF 업로드)"
          desc="지지옥션 매물 PDF → Claude Sonnet 4.6 권리분석·시장가치"
          tag="AI"
        />
        <FeatureCard
          href="/applyhome"
          title="청약·분양 정보"
          desc="청약홈 분양정보 OPEN API"
          tag="REB"
        />
        <FeatureCard
          href="/law"
          title="법령 검색"
          desc="국가법령정보센터 OPEN API: 민사집행법, 주임법, 상임법 등"
          tag="LAW"
        />
        <FeatureCard
          href="/news"
          title="부동산 뉴스"
          desc="네이버 뉴스 검색 API: 키워드별 최신 부동산 뉴스"
          tag="NAVER"
        />
      </section>

      <section className="rounded-2xl bg-white p-6 border">
        <h2 className="text-lg font-semibold mb-2">⚙️ 시작 전 체크리스트</h2>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-zinc-700">
          <li>
            <code className="bg-zinc-100 px-1 rounded">.env.example</code> →{' '}
            <code className="bg-zinc-100 px-1 rounded">.env.local</code> 복사 후 키 입력
          </li>
          <li>
            <code className="bg-zinc-100 px-1 rounded">docs/api-keys-setup.md</code>{' '}
            가이드대로 9개 API 키 발급
          </li>
          <li>data.go.kr 가입 후 7개 API 활용신청 (자동 승인)</li>
          <li>법령 API는 1~2일 승인 소요 — 미리 신청</li>
        </ol>
      </section>
    </div>
  );
}

function FeatureCard({
  href,
  title,
  desc,
  tag,
}: {
  href: string;
  title: string;
  desc: string;
  tag: string;
}) {
  return (
    <a
      href={href}
      className="block rounded-xl bg-white p-5 border hover:shadow-md transition"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-100 rounded">
          {tag}
        </span>
      </div>
      <p className="text-sm text-zinc-600">{desc}</p>
    </a>
  );
}
