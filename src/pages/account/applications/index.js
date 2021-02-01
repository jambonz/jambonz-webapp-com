import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const ApplicationsAddEdit = () => {
  return (
    <InternalTemplate title="Applications">
      <Link to="/account/applications/add">Add Application</Link>
    </InternalTemplate>
  );
};

export default ApplicationsAddEdit;
