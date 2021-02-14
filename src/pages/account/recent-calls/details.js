import InternalTemplate from '../../../components/templates/InternalTemplate';

const RecentCallsDetails = () => {
  return (
    <InternalTemplate
      title="Recent Call Details"
      breadcrumbs={[
        { name: 'Back to Recent Calls', url: '/account/recent-calls' },
      ]}

    >
    </InternalTemplate>
  );
};

export default RecentCallsDetails;
