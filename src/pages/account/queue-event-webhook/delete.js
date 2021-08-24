import DeleteWebhook from '../../../components/webhooks/DeleteWebhook';

const QueueEventWebhookDelete = () => {
  return <DeleteWebhook
    hookName="Queue Event"
    hookProp="queue_event_hook"
  />;
};

export default QueueEventWebhookDelete;