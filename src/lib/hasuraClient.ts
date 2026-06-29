// src/lib/hasuraClient.ts
import { GraphQLClient } from 'graphql-request';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const HASURA_ENDPOINT = process.env.NEXT_PUBLIC_HASURA_ENDPOINT
  ?? 'https://smiling-eft-83.hasura.app/v1/graphql';

export async function hasuraRequest<T = any>(
  query: string,
  vars?: Record<string, any>
): Promise<T> {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('User is not authenticated – no Supabase JWT available');
  }

  const client = new GraphQLClient(HASURA_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  return client.request<T>(query, vars);
}