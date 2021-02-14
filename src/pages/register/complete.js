import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ExternalTemplate from '../../components/templates/ExternalTemplate';
import Section from '../../components/blocks/Section';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';

const RegisterComplete = () => {
  let history = useHistory();

  useEffect(() => {
    document.title = `Registration Complete | jambonz`;
  });

  const handleSubmit = e => {
    e.preventDefault();
    history.push('/account');
  };

  return (
    <ExternalTemplate title="Registration Complete">
      <Section>
        <Form left onSubmit={handleSubmit}>
          <p>Thanks for registering!</p>
          <Button fullWidth>Continue to Account →</Button>
        </Form>
      </Section>
    </ExternalTemplate>
  );
};

export default RegisterComplete;
