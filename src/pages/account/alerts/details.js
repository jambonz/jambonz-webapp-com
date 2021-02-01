import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const AlertsDetails = () => {
  return (
    <InternalTemplate title="Alert Details">
      <Link to="/account/alerts">← Back to Alerts</Link>
    </InternalTemplate>
  );
};

export default AlertsDetails;
