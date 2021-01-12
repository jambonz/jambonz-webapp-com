import { useEffect } from 'react';

const RegisterChooseSubdomain = () => {
  useEffect(() => {
    document.title = `Choose a Subdomain | Register | Jambonz`;
  }, []);

  return (
    <h1>Choose a Subdomain</h1>
  );
};

export default RegisterChooseSubdomain;
