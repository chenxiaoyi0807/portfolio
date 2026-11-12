function basePath() {
  return import.meta.env.BASE_URL.replace(/\/?$/, '/');
}

export function sitePath(path = '') {
  return `${basePath()}${path.replace(/^\//, '')}`;
}

export function currentRoute() {
  const { pathname } = window.location;
  const base = basePath();
  if (!pathname.startsWith(base)) return pathname === base.slice(0, -1) ? '/' : pathname;
  return `/${pathname.slice(base.length).replace(/\/$/, '')}`;
}
