import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { images } from '~/public/images';
import Image from 'next/image';
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image  src={images.logo} alt="logo" width={160} height={100} />
      </>
    ),
  },
  githubUrl: 'https://github.com',
 
};
