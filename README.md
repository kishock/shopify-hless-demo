# Commerce Storefront

[한국어로 보기](#korean) | [Read in English](#english)

---

## Korean

### 프로젝트 소개

이 프로젝트는 `Next.js App Router`와 `Shopify Storefront API`를 기반으로 구축된 헤드리스 커머스 프론트엔드입니다.  
스토어의 상품, 컬렉션, 페이지, 장바구니 데이터를 Shopify에서 가져오고, Next.js의 서버 중심 렌더링과 캐시 전략을 활용해 빠른 사용자 경험을 제공하도록 구성되어 있습니다.

핵심 목적은 다음과 같습니다.

- Shopify 데이터를 직접 소비하는 독립형 storefront 제공
- App Router 기반의 서버 렌더링 중심 구조 유지
- 상품 탐색, 상세 조회, 컬렉션 브라우징, 장바구니, 체크아웃 연결 지원
- Shopify 웹훅과 연계한 재검증(revalidation) 처리

### 기술 스택

- Framework: `Next.js 15` App Router
- UI: `React 19`
- Styling: `Tailwind CSS 4`
- Commerce Backend: `Shopify Storefront GraphQL API`
- State/UI helpers: `Headless UI`, `Heroicons`, `Sonner`
- Language: `TypeScript`

### 주요 기능

- 홈 화면 상품 프로모션 영역
- 전체 검색 및 컬렉션별 상품 탐색
- 상품 상세 페이지, 이미지 갤러리, 옵션/변형 선택
- 장바구니 추가, 수량 변경, 삭제, 체크아웃 이동
- Shopify CMS 페이지 렌더링
- SEO 메타데이터 및 Open Graph 이미지 처리
- Shopify 웹훅 기반 캐시 재검증

### 디렉터리 구조

```text
.
|-- app/
|   |-- api/revalidate/           # Shopify 웹훅 재검증 엔드포인트
|   |-- product/[handle]/         # 상품 상세 페이지
|   |-- search/                   # 검색/컬렉션 목록 페이지
|   |-- [page]/                   # Shopify 페이지 렌더링
|   |-- layout.tsx                # 전역 레이아웃 및 CartProvider 연결
|   |-- page.tsx                  # 홈 페이지
|   |-- globals.css               # 전역 스타일
|-- components/
|   |-- cart/                     # 장바구니 UI 및 서버 액션
|   |-- grid/                     # 상품/콘텐츠 그리드 UI
|   |-- layout/                   # 내비게이션, 푸터, 검색 필터
|   |-- product/                  # 상품 상세 UI
|-- lib/
|   |-- shopify/                  # Shopify GraphQL 요청, 변환, 타입, 쿼리/뮤테이션
|   |-- constants.ts              # 정렬, 태그, 상수 정의
|   |-- utils.ts                  # 공용 유틸리티
|-- .env.example                  # 필수 환경 변수 예시
|-- package.json                  # 실행 스크립트 및 의존성
```

### 라우팅 구성

- `/` : 홈
- `/search` : 전체 상품 검색
- `/search/[collection]` : 컬렉션별 상품 목록
- `/product/[handle]` : 상품 상세
- `/[page]` : Shopify 페이지 콘텐츠
- `/api/revalidate` : Shopify 웹훅 수신 및 캐시 재검증

### 아키텍처

이 프로젝트는 "UI 레이어", "서버 액션 레이어", "Shopify 데이터 레이어"로 분리되어 있습니다.

#### 1. UI 레이어

`app/`과 `components/`가 화면 렌더링을 담당합니다.

- `app/layout.tsx`
  - 전체 레이아웃 초기화
  - `getCart()` 결과를 `CartProvider`에 전달
  - 전역 내비게이션 및 토스트 구성
- `app/page.tsx`
  - 홈 화면에서 프로모션성 상품 섹션을 조합
- `app/search/*`
  - 정렬/검색 파라미터를 읽고 상품 목록 렌더링
- `app/product/[handle]/page.tsx`
  - 상품 상세, JSON-LD, 연관 상품 표시
- `app/[page]/page.tsx`
  - Shopify의 페이지 본문을 렌더링

#### 2. 장바구니 상호작용 레이어

`components/cart/actions.ts`와 `components/cart/cart-context.tsx`가 장바구니 상태 변경을 처리합니다.

- `actions.ts`
  - `use server` 기반 서버 액션 제공
  - 장바구니 생성, 추가, 삭제, 수량 수정, 체크아웃 이동 처리
  - 변경 후 `updateTag(TAGS.cart)`로 캐시 갱신
- `cart-context.tsx`
  - 클라이언트 측 낙관적 업데이트(`useOptimistic`) 적용
  - 사용자가 즉시 수량 변경 결과를 체감할 수 있도록 구성

#### 3. Shopify 데이터 레이어

`lib/shopify/`는 Shopify 통신을 집중 관리합니다.

- `index.ts`
  - 공통 `shopifyFetch` 구현
  - 상품, 컬렉션, 메뉴, 페이지, 장바구니 API 함수 제공
  - Shopify 응답을 프론트엔드 친화적인 형태로 reshape
  - `cacheTag`, `cacheLife`, `revalidateTag`를 이용해 데이터 캐시 관리
- `queries/`
  - 상품, 컬렉션, 페이지, 메뉴, 장바구니 GraphQL 쿼리 정의
- `mutations/`
  - 장바구니 관련 GraphQL mutation 정의
- `types.ts`
  - Shopify 응답 및 앱 내부 타입 정의

### 데이터 흐름

1. 사용자가 페이지에 접근합니다.
2. App Router 서버 컴포넌트가 `lib/shopify`의 함수(`getProducts`, `getProduct`, `getCollection` 등)를 호출합니다.
3. `shopifyFetch()`가 Shopify Storefront API로 GraphQL 요청을 전송합니다.
4. 응답 데이터는 `reshape*` 함수로 UI 친화적인 구조로 변환됩니다.
5. 서버 컴포넌트가 HTML을 렌더링하고, 필요한 클라이언트 컴포넌트만 hydrate 됩니다.
6. 장바구니 조작은 서버 액션을 통해 Shopify에 반영되고, 클라이언트는 낙관적 업데이트로 즉시 반응합니다.

### 캐시 및 재검증 전략

- 상품/컬렉션/메뉴 데이터는 `Next.js cache tag`를 사용해 캐시합니다.
- 장바구니는 쿠키 기반 식별자를 사용하며, 개인화 데이터이므로 별도 private cache 전략을 사용합니다.
- `/api/revalidate`는 Shopify 웹훅을 받아 관련 태그를 재검증합니다.
- 사용되는 주요 태그:
  - `collections`
  - `products`
  - `cart`

### 환경 변수

`.env.example` 기준 필수 값:

- `COMPANY_NAME`
- `SITE_NAME`
- `SHOPIFY_REVALIDATION_SECRET`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_STORE_DOMAIN`

### 실행 방법

```bash
pnpm install
pnpm dev
```

기본 개발 서버 주소:

```text
http://localhost:3000
```

### 스크립트

- `pnpm dev` : 개발 서버 실행
- `pnpm build` : 프로덕션 빌드
- `pnpm start` : 빌드 결과 실행
- `pnpm prettier` : 코드 포맷팅
- `pnpm prettier:check` : 포맷 검사
- `pnpm test` : 현재는 포맷 검사와 동일

### 이 프로젝트를 이해할 때 보면 좋은 파일

- `app/layout.tsx`
- `app/page.tsx`
- `app/search/page.tsx`
- `app/product/[handle]/page.tsx`
- `components/cart/actions.ts`
- `components/cart/cart-context.tsx`
- `lib/shopify/index.ts`
- `lib/constants.ts`

---

## English

### Overview

This project is a headless commerce storefront built with `Next.js App Router` and the `Shopify Storefront API`.  
It fetches products, collections, pages, and cart data from Shopify, then renders the storefront through a server-first Next.js architecture with caching and revalidation support.

Its main goals are:

- Provide an independent storefront powered directly by Shopify data
- Keep a server-rendered, App Router based structure
- Support browsing, search, product detail, cart, and checkout flows
- Revalidate cached data from Shopify webhooks

### Tech Stack

- Framework: `Next.js 15` App Router
- UI: `React 19`
- Styling: `Tailwind CSS 4`
- Commerce Backend: `Shopify Storefront GraphQL API`
- UI helpers: `Headless UI`, `Heroicons`, `Sonner`
- Language: `TypeScript`

### Core Features

- Promotional home page sections
- Global search and collection-based browsing
- Product detail pages with gallery and variant selection
- Add to cart, update quantity, remove item, and checkout redirect
- Shopify CMS page rendering
- SEO metadata and Open Graph support
- Webhook-driven cache revalidation

### Directory Structure

```text
.
|-- app/
|   |-- api/revalidate/           # Shopify webhook revalidation endpoint
|   |-- product/[handle]/         # Product detail route
|   |-- search/                   # Search and collection listing routes
|   |-- [page]/                   # Shopify content pages
|   |-- layout.tsx                # Global layout and CartProvider wiring
|   |-- page.tsx                  # Home page
|   |-- globals.css               # Global styles
|-- components/
|   |-- cart/                     # Cart UI and server actions
|   |-- grid/                     # Grid-based storefront UI
|   |-- layout/                   # Navbar, footer, search filters
|   |-- product/                  # Product detail UI
|-- lib/
|   |-- shopify/                  # Shopify GraphQL client, mappers, types, queries
|   |-- constants.ts              # Sorting, tags, shared constants
|   |-- utils.ts                  # Common helpers
|-- .env.example                  # Required environment variables
|-- package.json                  # Scripts and dependencies
```

### Routes

- `/` : Home page
- `/search` : Product search
- `/search/[collection]` : Collection product listing
- `/product/[handle]` : Product detail page
- `/[page]` : Shopify page content
- `/api/revalidate` : Shopify webhook revalidation endpoint

### Architecture

The application is organized into three main layers: UI, cart interaction, and Shopify data access.

#### 1. UI Layer

`app/` and `components/` are responsible for rendering the storefront.

- `app/layout.tsx`
  - bootstraps the global layout
  - passes `getCart()` into `CartProvider`
  - mounts the navbar and toast UI
- `app/page.tsx`
  - assembles the home page promotional sections
- `app/search/*`
  - reads sorting and query params, then renders product lists
- `app/product/[handle]/page.tsx`
  - renders product detail, JSON-LD, and related products
- `app/[page]/page.tsx`
  - renders Shopify-managed page content

#### 2. Cart Interaction Layer

`components/cart/actions.ts` and `components/cart/cart-context.tsx` handle cart mutations and optimistic UI updates.

- `actions.ts`
  - exposes `use server` actions
  - creates carts, adds/removes items, updates quantities, and redirects to checkout
  - refreshes cart cache through `updateTag(TAGS.cart)`
- `cart-context.tsx`
  - applies optimistic cart updates with `useOptimistic`
  - keeps the cart UI responsive before the server round-trip completes

#### 3. Shopify Data Layer

`lib/shopify/` centralizes all Shopify communication.

- `index.ts`
  - implements shared `shopifyFetch`
  - exposes APIs for products, collections, menus, pages, and carts
  - reshapes Shopify responses into UI-friendly objects
  - manages caching with `cacheTag`, `cacheLife`, and `revalidateTag`
- `queries/`
  - stores GraphQL queries for products, collections, menus, pages, and cart data
- `mutations/`
  - stores cart-related GraphQL mutations
- `types.ts`
  - defines Shopify response types and internal app types

### Data Flow

1. A user requests a route.
2. A server component calls a function from `lib/shopify` such as `getProducts`, `getProduct`, or `getCollection`.
3. `shopifyFetch()` sends a GraphQL request to the Shopify Storefront API.
4. The response is normalized by `reshape*` functions.
5. The server component renders the page and only the necessary client components hydrate.
6. Cart operations go through server actions, while the client uses optimistic updates for immediate feedback.

### Caching and Revalidation

- Product, collection, and menu data use `Next.js cache tags`.
- The cart is cookie-based and handled as personalized data with a private cache strategy.
- `/api/revalidate` receives Shopify webhooks and revalidates affected tags.
- Main tags in use:
  - `collections`
  - `products`
  - `cart`

### Environment Variables

Required values based on `.env.example`:

- `COMPANY_NAME`
- `SITE_NAME`
- `SHOPIFY_REVALIDATION_SECRET`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_STORE_DOMAIN`

### Local Development

```bash
pnpm install
pnpm dev
```

Default local URL:

```text
http://localhost:3000
```

### Scripts

- `pnpm dev` : start the development server
- `pnpm build` : create a production build
- `pnpm start` : run the production build
- `pnpm prettier` : format the codebase
- `pnpm prettier:check` : run formatting checks
- `pnpm test` : currently mapped to formatting checks

### Recommended Entry Files

- `app/layout.tsx`
- `app/page.tsx`
- `app/search/page.tsx`
- `app/product/[handle]/page.tsx`
- `components/cart/actions.ts`
- `components/cart/cart-context.tsx`
- `lib/shopify/index.ts`
- `lib/constants.ts`
