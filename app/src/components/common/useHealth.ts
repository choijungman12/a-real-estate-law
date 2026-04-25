'use client';

import { useEffect, useState } from 'react';

export type HealthKeys = {
  anthropic: boolean;
  data_go_kr: boolean;
  law_go_kr: boolean;
  vworld: boolean;
  reb: boolean;
  kakao_js: boolean;
  kakao_rest: boolean;
  naver: boolean;
  telegram: boolean;
  database: boolean;
  iros: boolean;
};

let cache: HealthKeys | null = null;

export function useHealth(): HealthKeys | null {
  const [state, setState] = useState<HealthKeys | null>(cache);
  useEffect(() => {
    if (cache) return;
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => {
        cache = d.keys;
        setState(d.keys);
      })
      .catch(() => undefined);
  }, []);
  return state;
}
