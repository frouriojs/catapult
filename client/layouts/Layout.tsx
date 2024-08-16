import type { UserDto } from 'common/types/user';
import { Loading } from 'components/loading/Loading';
import { useLoading } from 'components/loading/useLoading';
import { useAlert } from 'hooks/useAlert';
import { useConfirm } from 'hooks/useConfirm';
import { useUser } from 'hooks/useUser';
import { BasicHeader } from 'layouts/basicHeader/BasicHeader';
import { useRouter } from 'next/router';
import React from 'react';
import { pagesPath } from 'utils/$path';

export const Layout = (props: { render: (user: UserDto) => React.ReactNode }) => {
  const router = useRouter();
  const { user } = useUser();
  const { loadingElm } = useLoading();
  const { alertElm } = useAlert();
  const { confirmElm } = useConfirm();

  if (!user.inited) {
    return <Loading visible />;
  } else if (user.data === null) {
    void router.replace(pagesPath.login.$url());

    return <Loading visible />;
  }

  return (
    <div>
      <BasicHeader user={user.data} />
      {props.render(user.data)}
      {loadingElm}
      {alertElm}
      {confirmElm}
    </div>
  );
};
