import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const SettingsChangeNameAndEmail = () => {
  return (
    <InternalTemplate title="Change Name and Email">
      <Link to="/account/settings">← Back to Settings</Link>
    </InternalTemplate>
  );
};

export default SettingsChangeNameAndEmail;
