import InternalTemplate from '../../../../components/templates/InternalTemplate';
import Link from '../../../../components/elements/Link.js';

const SettingsAuthIndex = () => {
  return (
    <InternalTemplate title="Authentication Method">
      <Link to="/account/settings">← Back to Settings</Link>
    </InternalTemplate>
  );
};

export default SettingsAuthIndex;
