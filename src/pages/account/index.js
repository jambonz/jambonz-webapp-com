import { useEffect } from 'react';
import SetupTemplate from '../../components/templates/SetupTemplate';

const AccountHome = () => {
  useEffect(() => {
    document.title = `Account Home | Jambonz`;
  });

  return (
    <SetupTemplate title="Account Home">
    </SetupTemplate>
  );
};

export default AccountHome;
