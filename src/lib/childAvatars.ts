import type { Child } from '@/types';

export type ChildAvatarOption = {
  id: string;
  label: string;
  emoji: string;
};

/** Preset avatars for child profiles (stored as `avatarId` / DB `avatar_id`). */
export const CHILD_AVATAR_OPTIONS: ChildAvatarOption[] = [
  { id: 'baby', label: 'Baby', emoji: '👶' },
  { id: 'bottle', label: 'Bottle', emoji: '🍼' },
  { id: 'chick', label: 'Chick', emoji: '🐣' },
  { id: 'panda', label: 'Panda', emoji: '🐼' },
  { id: 'bear', label: 'Teddy bear', emoji: '🧸' },
  { id: 'bunny', label: 'Bunny', emoji: '🐰' },
  { id: 'koala', label: 'Koala', emoji: '🐨' },
  { id: 'duck', label: 'Duck', emoji: '🐤' },
  { id: 'penguin', label: 'Penguin', emoji: '🐧' },
  { id: 'elephant', label: 'Elephant', emoji: '🐘' },
  { id: 'kitten', label: 'Kitten', emoji: '🐱' },
  { id: 'puppy', label: 'Puppy', emoji: '🐶' },
  { id: 'butterfly', label: 'Butterfly', emoji: '🦋' },
  { id: 'ladybug', label: 'Ladybug', emoji: '🐞' },
  { id: 'flower', label: 'Flower', emoji: '🌸' },
  { id: 'sunflower', label: 'Sunflower', emoji: '🌻' },
  { id: 'balloon', label: 'Balloon', emoji: '🎈' },
  { id: 'rainbow', label: 'Rainbow', emoji: '🌈' },
  { id: 'moon', label: 'Moon', emoji: '🌙' },
  { id: 'rocket', label: 'Rocket', emoji: '🚀' },
  { id: 'star', label: 'Star', emoji: '⭐' },
  { id: 'sun', label: 'Sun', emoji: '🌞' },
];

export function getChildAvatar(avatarId: string | undefined): ChildAvatarOption | undefined {
  if (!avatarId?.trim()) return undefined;
  return CHILD_AVATAR_OPTIONS.find((a) => a.id === avatarId);
}

/** Default avatar when adding a child; also used as a neutral suggestion before gender is chosen. */
export function suggestedAvatarIdForGender(gender: Child['gender'] | undefined): string {
  switch (gender) {
    case 'male':
      return 'rocket';
    case 'female':
      return 'butterfly';
    case 'other':
      return 'star';
    default:
      return 'panda';
  }
}
