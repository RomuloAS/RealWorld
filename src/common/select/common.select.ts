import { UserSelect } from '../../user/user.select';

export const FollowedBySelect = (user: any) => {
  return {
    ...UserSelect.select,
    followedBy: {
      where: {
        username: user ? user.username : '',
      },
      select: { username: true },
    },
  };
};
