export interface InstagramProfile {
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  postsCount: number;
  followersCount: number;
  followsCount: number;
  isPrivate: boolean;
  isVerified: boolean;
  recentPosts: InstagramPost[];
}

export interface InstagramPost {
  caption: string;
  likesCount: number;
  commentsCount: number;
  imageUrl: string;
}
