import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const AlertsIndex = () => {
  return (
    <InternalTemplate title="Alerts">
      <Link to="/account/alerts/test">Alert Details</Link>
    </InternalTemplate>
  );
};

export default AlertsIndex;
