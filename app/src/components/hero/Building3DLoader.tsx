'use client';

import dynamic from 'next/dynamic';

const Building3DScene = dynamic(() => import('./Building3DScene'), {
  ssr: false,
  loading: () => (
    <div
      className="grid place-items-center text-sm text-[color:var(--text-muted)]"
      style={{ height: 520 }}
    >
      3D 시뮬레이션 로딩…
    </div>
  ),
});

export default function Building3DLoader() {
  return <Building3DScene />;
}
