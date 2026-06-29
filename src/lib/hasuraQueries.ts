// src/lib/hasuraQueries.ts

export const GET_PROFILE = `
  query GetProfile($user_id: uuid!) {
    profiles(where: { user_id: { _eq: $user_id } }) {
      id
      user_id
      username
      config
      views
      audio_title
      audio_artist
      audio_thumb
      audio_track_id
      audio_source
      created_at
      updated_at
    }
  }
`;

export const UPDATE_PROFILE = `
  mutation UpdateProfile($user_id: uuid!, $changes: profiles_set_input!) {
    update_profiles(
      where: { user_id: { _eq: $user_id } }
      _set: $changes

    ) {
      returning {
        id
        user_id
        username
        config
        audio_title
        audio_artist
        audio_thumb
        audio_track_id
        audio_source
        updated_at
      }
    }
  }
`;

export const GET_USER_BADGES = `
  query GetUserBadges($user_id: uuid!) {
    profile_badges(where: { user_id: { _eq: $user_id } }) {
      badge_id
      assigned_at
      badge {
        id
        label
        description
        icon
        color
        order_index
      }
    }
  }
`;

export const UPSERT_BADGE = `
  mutation UpsertBadge($user_id: uuid!, $badge_id: String!) {
    insert_profile_badges_one(
      object: { user_id: $user_id, badge_id: $badge_id }
      on_conflict: { constraint: profile_badges_pkey, update_columns: [assigned_at] }
    ) {
      user_id
      badge_id
      assigned_at
    }
  }
`;