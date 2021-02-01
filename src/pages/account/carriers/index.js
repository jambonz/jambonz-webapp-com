import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const CarriersIndex = () => {
  return (
    <InternalTemplate title="Carriers">
      <Link to="/account/carriers/add">Add Carrier</Link>
    </InternalTemplate>

  );
};

export default CarriersIndex;
