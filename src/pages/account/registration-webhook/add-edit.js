import AddEditWebhook from '../../../components/webhooks/AddEditWebhook';

const RegistrationWebhookAddEdit = () => {
  return <AddEditWebhook
    hookName="Registration"
    hookProp="registration_hook"
    hookPlaceholder="URL that handles registrations"
  />;
};

export default RegistrationWebhookAddEdit;