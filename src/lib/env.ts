export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  supabaseUrl: () => getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabasePublishableKey: () =>
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"),
};

