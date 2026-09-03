# AI 제품 디자인 백엔드 파이프라인 PoC

AI 기반 제품 디자인 생성 서비스의 백엔드 파이프라인을 검증하기 위한 NestJS 기반 PoC입니다.

- AI 디자인 생성 노드 워크플로우 처리
- 15만 건 규모의 3D 인체 데이터 조회 캐싱 최적화 (Redis Look-Aside)
- 비동기 AI 파이프라인 (BullMQ)

> 프로젝트 구조/설계 배경/기술 선택 이유에 대한 더 자세한 설명은 [`INTERVIEW_GUIDE.md`](./INTERVIEW_GUIDE.md)를 참고하세요.

## 기술 스택

| 영역 | 사용 기술 |
| --- | --- |
| Framework | NestJS 10 (TypeScript) |
| Database | MySQL 8.0 + TypeORM |
| Cache | Redis (Look-Aside 패턴) |
| Queue | BullMQ (Redis 기반) |
| API 문서 | Swagger (`@nestjs/swagger`) |
| Validation | class-validator / class-transformer |

## 프로젝트 구조

```
src/
├── ai-tasks/                # AI 생성 비동기 작업 (BullMQ)
│   ├── dto/
│   ├── entities/
│   ├── enums/
│   ├── queue/                # ai-generation-queue, Processor
│   ├── ai-tasks.controller.ts
│   ├── ai-tasks.service.ts
│   └── ai-tasks.module.ts
├── body-data/                # 3D 인체 데이터 가이드라인 조회 (Redis 캐싱)
│   ├── dto/
│   ├── entities/
│   ├── enums/
│   ├── body-data.controller.ts
│   ├── body-data.service.ts
│   └── body-data.module.ts
├── design-workflow/          # AI 노드 워크플로우
│   ├── entities/
│   ├── enums/
│   ├── design-workflow.controller.ts
│   ├── design-workflow.service.ts
│   └── design-workflow.module.ts
├── common/
│   ├── cache/                 # Redis 클라이언트 Provider + Look-Aside CacheService
│   └── transformers/          # DECIMAL 컬럼 number 변환 등
├── database/seed/            # 샘플 데이터 시딩 서비스 및 CLI 스크립트
├── app.module.ts
└── main.ts                   # 부트스트랩, ValidationPipe, Swagger 설정
```

## 사전 준비물

- Node.js 20.x 이상
- Docker / Docker Compose (MySQL 8.0, Redis 실행용)

## 실행 방법

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.example .env
```

필요 시 `.env` 값을 로컬 환경(DB 계정, Redis 포트 등)에 맞게 수정합니다.

| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `PORT` | API 서버 포트 | `3000` |
| `DB_HOST` / `DB_PORT` | MySQL 접속 정보 | `localhost` / `3306` |
| `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` | MySQL 계정/DB명 | `3d` / `3d_pass` / `3d` |
| `DB_SYNCHRONIZE` | TypeORM 스키마 자동 동기화 (PoC 용도) | `true` |
| `REDIS_HOST` / `REDIS_PORT` | Redis 접속 정보 | `localhost` / `6379` |
| `BODY_DATA_CACHE_TTL_SECONDS` | 가이드라인 조회 캐시 TTL(초) | `60` |
| `BODY_DATA_SEED_COUNT` | 시딩할 BodyData 목표 건수 | `150000` |
| `BODY_DATA_SEED_BATCH_SIZE` | 시딩 배치 크기 | `2000` |
| `SEED_ON_BOOTSTRAP` | 앱 부팅 시 자동 시딩 여부 | `true` |

### 3. 인프라 기동 (MySQL + Redis)

```bash
docker compose up -d
```

### 4. 애플리케이션 실행

```bash
npm run start:dev
```

앱이 처음 부팅될 때 `SeedService`가 자동으로 `DesignWorkflow` 샘플과 `BodyData` 15만 건(기본값)을 시딩합니다. 이미 목표 건수만큼 데이터가 있으면 건너뜁니다(재실행해도 중복 생성되지 않음).

시딩만 별도로(HTTP 서버 없이) 수행하고 싶다면:

```bash
npm run seed
```

### 5. 확인

- API 서버: `http://localhost:3000`
- Swagger 문서: `http://localhost:3000/docs`
- OpenAPI 스펙(JSON): `http://localhost:3000/docs-json` (Postman 등에 바로 Import 가능)

## 주요 API

### 3D 인체 데이터 가이드라인 조회 (Redis 캐싱 적용)

```
GET /api/body-data/guidelines?gender=MALE&guidelineCategory=STANDARD&minHeight=170&maxHeight=180&page=1&limit=20
```

같은 조건으로 재조회 시 응답의 `fromCache`가 `true`로 바뀌는지 확인하면 캐싱 동작을 검증할 수 있습니다.

### AI 노드 워크플로우 목록 조회 (테스트용)

```
GET /api/design-workflows
```

`generate` 요청에 사용할 `workflowId`를 확인하는 용도입니다.

### AI 디자인 생성 요청 (비동기, BullMQ)

```
POST /api/ai-tasks/generate
Content-Type: application/json

{
  "workflowId": "<design-workflow의 id>",
  "bodyDataId": "<body-data의 id>",
  "prompt": "미니멀한 스트릿 캐주얼 스타일의 후드 집업"
}
```

응답으로 받은 `id`(Task ID)를 아래 API로 폴링하면, 약 3초 후 `PENDING` → `PROCESSING` → `COMPLETED`로 상태가 바뀌고 `resultImageUrl`이 채워지는 것을 확인할 수 있습니다.

```
GET /api/ai-tasks/{id}
```

## 빌드 / 기타 명령어

```bash
npm run build        # dist/ 로 프로덕션 빌드
npm run start:prod    # 빌드 결과 실행
npm run lint          # ESLint 검사 및 자동 수정
npm run test           # Jest 테스트 실행
```

## 참고 문서

- [`INTERVIEW_GUIDE.md`](./INTERVIEW_GUIDE.md): 아키텍처, 기술 선택 이유, 트러블슈팅, Q&A 등 프로젝트 심화 설명
