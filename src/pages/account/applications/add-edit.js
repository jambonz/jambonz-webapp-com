import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const ApplicationsAddEdit = () => {
  return (
    <InternalTemplate title="Add/Edit Application">
      <Link to="/account/applications">← Back to Application</Link>
    </InternalTemplate>
  );
};

export default ApplicationsAddEdit;
