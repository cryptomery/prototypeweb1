import { useLocation, useNavigate, useParams as useRouterParams, useSearchParams as useRouterSearchParams } from 'react-router-dom';

export function usePathname(): string {
  const location = useLocation();
  return location.pathname;
}

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
}

export function useParams<T extends Record<string, string | string[]> = Record<string, string>>(): T {
  const params = useRouterParams();
  return params as unknown as T;
}

export function useSearchParams() {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}

export function notFound(): never {
  throw new Error('NEXT_NOT_FOUND');
}
