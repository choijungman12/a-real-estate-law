/**
 * 정비계획 입안 동의서 HTML 생성기
 * 출처: ref-cjm 의 consentPDF.ts (구기동 재개발 검증된 양식)
 *
 * - 「도시 및 주거환경정비법」 제13조①, 시행령 제8조 근거 명시
 * - 「전자서명법」 제3조 + 「전자문서법」 제4조에 따른 법적 효력
 * - 인증수단: 카카오 / PASS / 기타 전자인증
 * - 출력: 자체 HTML (jsPDF 없이 브라우저 인쇄→PDF)
 */

export interface ConsentRecord {
  certId: string;
  name: string;
  phone: string;
  birthdate: string;
  propertyAddress: string;
  propertyType: string;
  propertyArea: string;
  authMethod: 'kakao' | 'pass' | 'other' | null;
  carrier?: string | null;
  signedAt: string;
  signature: string;
  document: string;
  project: string;
  projectAddress?: string;
  projectArea?: string;
}

export function buildConsentHTML(r: ConsentRecord): string {
  const authLabel =
    r.authMethod === 'kakao'
      ? '카카오 인증서'
      : r.authMethod === 'pass'
        ? `PASS 인증서 (${(r.carrier ?? '').toUpperCase()})`
        : '전자 인증';

  const projectAddress = r.projectAddress ?? '(미지정)';
  const projectArea = r.projectArea ?? '(미지정)';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>정비계획 입안 동의서 · ${r.certId}</title>
<style>
  @page { size: A4; margin: 20mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Malgun Gothic', 'Noto Sans KR', sans-serif; color: #111; line-height: 1.6; margin: 0; padding: 24px; background: #fff; }
  .wrap { max-width: 780px; margin: 0 auto; }
  .title { text-align: center; border-bottom: 3px double #111; padding-bottom: 16px; margin-bottom: 24px; }
  .title h1 { font-size: 24px; font-weight: 900; letter-spacing: 6px; margin: 0 0 6px; }
  .title p { font-size: 11px; color: #666; margin: 0; }
  .meta { font-size: 12px; color: #888; text-align: right; margin-bottom: 8px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 13px; }
  th, td { border: 1px solid #999; padding: 8px 12px; text-align: left; }
  th { background: #f2f2f2; width: 28%; font-weight: 600; }
  h2.section { font-size: 14px; font-weight: 700; margin: 20px 0 8px; padding-left: 8px; border-left: 4px solid #1a3adb; }
  ol { padding-left: 20px; }
  ol li { margin-bottom: 6px; font-size: 13px; }
  .sig { margin-top: 40px; padding: 24px; border: 2px solid #111; text-align: center; }
  .sig .name { font-size: 22px; font-weight: 900; letter-spacing: 4px; }
  .sig .stamp { display: inline-block; margin-top: 8px; padding: 6px 20px; border: 2px solid #c00; color: #c00; font-weight: 700; border-radius: 50%; transform: rotate(-8deg); font-size: 13px; }
  .footer { margin-top: 24px; font-size: 11px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 12px; }
  .cert { font-family: 'Courier New', monospace; font-size: 11px; color: #555; }
  @media print { body { padding: 0; } .noprint { display: none; } }
  .noprint { text-align: center; margin-bottom: 16px; }
  .noprint button { padding: 10px 20px; font-size: 14px; background: #1a3adb; color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
</style>
</head>
<body>
<div class="wrap">
  <div class="noprint"><button onclick="window.print()">📄 PDF로 저장 / 인쇄</button></div>
  <div class="meta">접수번호 <span class="cert">${r.certId}</span></div>
  <div class="title">
    <h1>정비계획 입안 동의서</h1>
    <p>「도시 및 주거환경정비법」 제13조제1항 · 동법 시행령 제8조</p>
  </div>

  <h2 class="section">제1조 (사업 개요)</h2>
  <table>
    <tr><th>사업 명칭</th><td>${r.project}</td></tr>
    <tr><th>정비사업 종류</th><td>주택정비형 재개발사업</td></tr>
    <tr><th>위치</th><td>${projectAddress}</td></tr>
    <tr><th>면적</th><td>${projectArea}</td></tr>
  </table>

  <h2 class="section">제2조 (동의 내용)</h2>
  <ol>
    <li>해당 구역을 주택정비형 재개발사업 정비구역으로 지정하기 위한 정비계획 입안을 관할 구청장에게 제안하는 것에 동의합니다.</li>
    <li>정비계획 입안 제안에 필요한 현황조사·측량·정비구역 지정 및 정비계획 수립 관련 용역 수행에 동의합니다.</li>
    <li>본 동의서 제출 후 추진위원회 구성 및 조합 설립 이전까지 추진위원회가 사업을 대표하여 진행하는 것에 동의합니다.</li>
    <li>사업 추진 과정에서 불가피하게 발생하는 소송 또는 행정절차에서 추진위원회가 동의자를 대리하는 것에 동의합니다.</li>
  </ol>

  <h2 class="section">제3조 (개인정보 수집·이용)</h2>
  <p>수집 항목: 성명·생년월일·연락처·소유 부동산 소재지·면적·전자서명 인증 기록<br/>
  수집 목적: 정비계획 입안 동의자 확인 및 추진위원회 동의자 명부 관리<br/>
  보유 기간: 정비구역 지정 고시일로부터 5년</p>

  <h2 class="section">제4조 (동의자 정보)</h2>
  <table>
    <tr><th>성명</th><td>${r.name}</td></tr>
    <tr><th>생년월일</th><td>${r.birthdate}</td></tr>
    <tr><th>연락처</th><td>${r.phone}</td></tr>
    <tr><th>소유 부동산</th><td>${r.propertyAddress}</td></tr>
    <tr><th>소유 구분</th><td>${r.propertyType}</td></tr>
    <tr><th>면적</th><td>${r.propertyArea ? r.propertyArea + 'm²' : '미기재'}</td></tr>
  </table>

  <h2 class="section">제5조 (전자서명의 법적 효력)</h2>
  <p>본 동의서는 「전자서명법」 제3조 및 「전자문서 및 전자거래 기본법」 제4조에 따라 공인 전자서명(${authLabel})을 통해 서명된 전자문서로서, 「도시 및 주거환경정비법 시행령」 제8조 제4항에 따른 서면 동의서와 동일한 법적 효력을 가집니다.</p>

  <div class="sig">
    <p>위 내용을 모두 확인하고 이에 동의하여 전자서명합니다.</p>
    <p style="margin-top:16px">서명일시: <strong>${r.signedAt}</strong></p>
    <p>인증수단: <strong>${authLabel}</strong></p>
    <p class="cert">인증번호: ${r.certId}</p>
    <p style="margin-top:20px">동의자 (서명):</p>
    <p class="name">${r.signature || r.name}</p>
    <span class="stamp">전자서명 완료</span>
  </div>

  <div class="footer">
    <p>${r.project} 추진위원회 · 관할 구청장 귀중</p>
    <p>본 전자문서는 「전자서명법」에 따라 서면 동의서와 동일한 법적 효력을 가집니다.</p>
  </div>
</div>
</body>
</html>`;
}

export function generateCertId(): string {
  const d = new Date();
  const ymd =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const hms =
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0') +
    String(d.getSeconds()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RE${ymd}-${hms}-${rand}`;
}
