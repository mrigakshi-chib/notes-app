export interface Note {
  id: string;

  title: string;

  content: string;

  isPinned: boolean;

  isLocked: boolean;

  ownerId: string;

  owner: {
    email: string;
  };
}