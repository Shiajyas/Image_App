interface AvatarProps {
  username: string;
  theme?: string;
  className?: string;
}

export const Avatar = ({ username, theme = "fun-emoji", className }: AvatarProps) => {
  const seed = encodeURIComponent(username.toLowerCase());
  const url = `https://api.dicebear.com/8.x/${theme}/svg?seed=${seed}`;
  return <img src={url} alt={username} className={`rounded-full ${className}`} />;
};
