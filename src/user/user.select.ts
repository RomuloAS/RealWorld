export const UserSelect = {
  select: {
    email: true,
    username: true,
    profile: {
      select: {
        bio: true,
        image: true
      },
    }
  }
};