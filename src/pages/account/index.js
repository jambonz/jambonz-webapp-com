import { useState, useEffect } from 'react';
import axios from 'axios';
import SetupTemplate from '../../components/templates/SetupTemplate';

const AccountHome = () => {
  const jwt = localStorage.getItem('jwt');
  const [ data, setData ] = useState({});

  useEffect(() => {
    document.title = `Account Home | Jambonz`;

    const getData = async () => {
      const dataResponse = await axios({
        method: 'get',
        baseURL: process.env.REACT_APP_API_BASE_URL,
        url: '/Users/me',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      setData(dataResponse.data);
    };

    getData();
  }, [jwt]);

  return (
    <SetupTemplate title="Account Home">
      <code style={{whiteSpace:'pre'}}>
        {JSON.stringify(data, null, 2)}
      </code>
    </SetupTemplate>
  );
};

export default AccountHome;
