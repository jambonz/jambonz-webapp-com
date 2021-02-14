import { useState, useEffect } from 'react';
import axios from 'axios';
import InternalTemplate from '../../components/templates/InternalTemplate';
import Section from '../../components/blocks/Section';

const AccountHome = () => {
  const jwt = localStorage.getItem('jwt');
  const [ data, setData ] = useState({});

  useEffect(() => {
    document.title = `Account Home | jambonz`;

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
    <InternalTemplate title="Home">
      <Section>
        <code style={{whiteSpace:'pre'}}>
          {JSON.stringify(data, null, 2)}
        </code>
      </Section>
    </InternalTemplate>
  );
};

export default AccountHome;
