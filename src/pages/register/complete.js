import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ExternalTemplate from '../../components/templates/ExternalTemplate';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import FormParagraph from '../../components/elements/FormParagraph';

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
      <Form left onSubmit={handleSubmit}>
        <FormParagraph>Thanks for registering!</FormParagraph>
        <Button fullWidth>Continue to Account →</Button>
      </Form>
    </ExternalTemplate>
  );
};

export default RegisterComplete;
