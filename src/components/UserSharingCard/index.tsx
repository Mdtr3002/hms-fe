import { FC } from 'react';

import { useWindowDimensions } from '../../hooks';

import Desktop from './Desktop';
import Mobile from './Mobile';

const UserSharingCard: FC<{ name: string; profileImg: string; sharing: string }> = ({
  name,
  profileImg,
  sharing,
}) => {
  const { width } = useWindowDimensions();

  if (width < 768) {
    return <Mobile name={name} profileImg={profileImg} sharing={sharing} />;
  }
  return <Desktop name={name} profileImg={profileImg} sharing={sharing} />;
};

export default UserSharingCard;
