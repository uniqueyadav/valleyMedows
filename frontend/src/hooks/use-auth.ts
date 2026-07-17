// Backend has been removed. This stub keeps the admin/auth UI compiling
// without any real authentication.
export function useAuth() {
  return {
    session: null,
    user: null as null | { email: string; id: string },
    isAdmin: false,
    loading: false,
  };
}
