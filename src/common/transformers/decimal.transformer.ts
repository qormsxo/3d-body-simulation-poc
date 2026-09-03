import { ValueTransformer } from 'typeorm';

/**
 * MySQL DECIMAL 컬럼은 typeorm/mysql2 조합에서 기본적으로 string으로 반환된다.
 * API 응답과 캐시 직렬화에서 number로 다루기 위해 양방향 변환을 적용한다.
 */
export const decimalTransformer: ValueTransformer = {
  to: (value?: number) => value,
  from: (value?: string) => (value === null || value === undefined ? value : parseFloat(value)),
};
