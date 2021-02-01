import InternalTemplate from '../../../components/templates/InternalTemplate';
import Link from '../../../components/elements/Link.js';

const SpeechServicesIndex = () => {
  return (
    <InternalTemplate title="Speech Services">
      <Link to="/account/speech-services/add">Add Speech Service</Link>
    </InternalTemplate>
  );
};

export default SpeechServicesIndex;
