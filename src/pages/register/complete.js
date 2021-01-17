import { useEffect } from 'react';
import SetupTemplate from '../../components/templates/SetupTemplate';
import Form from '../../components/elements/Form';
import Button from '../../components/elements/Button';
import FormParagraph from '../../components/elements/FormParagraph';

const RegisterComplete = () => {
  useEffect(() => {
    document.title = `Registration Complete | Jambonz`;
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    console.log('done');
  };

  return (
    <SetupTemplate title="Registration Complete">
      <Form left onSubmit={handleSubmit}>
        <FormParagraph>Thanks for registering!</FormParagraph>
        <Button fullWidth>Continue to Account →</Button>
      </Form>
    </SetupTemplate>
  );
};

export default RegisterComplete;
