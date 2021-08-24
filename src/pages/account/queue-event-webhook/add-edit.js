import AddEditWebhook from '../../../components/webhooks/AddEditWebhook';

const QueueEventWebhookAddEdit = () => {
  return <AddEditWebhook
    hookName="Queue Event"
    hookProp="queue_event_hook"
    hookPlaceholder="URL to notify when a member joins or leaves a queue"
  />;
};

export default QueueEventWebhookAddEdit;