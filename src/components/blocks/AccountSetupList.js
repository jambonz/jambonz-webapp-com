import styled from 'styled-components/macro';
import Link from '../../components/elements/Link';
import { ReactComponent as CheckGreen } from '../../images/CheckGreen.svg';

const Span = styled.span`
  margin-right: 0.75rem;
`;

const TaskData = [
  {
    node: () => <span>Add a <Link to="/account/carriers">carrier</Link> to route calls</span>,
    isCompleted: () => true,
  },
  {
    node: () => (
      <span>
        Add <Link to="/account/speech-services">speech</Link> credentials for
        text-to-speech and speech-to-text
      </span>
    ),
    isCompleted: () => false,
  },
  {
    node: () => (
      <span>
        Create an <Link to="/account/applications">application</Link> to
        handle call routing
      </span>
    ),
    isCompleted: () => false,
  },
  {
    node: () => (
      <span>
        Add a <Link to="/account/phone-numbers">phone number</Link> to receive calls
      </span>
    ),
    isCompleted: () => false,
  }
]

const List = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 4rem;
`;

const TH = styled.h4`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #707070;
  margin: 0;
`;

const Circle = styled.div`
  width: 4px;
  height: 4px;
  min-width: 4px;
  min-height: 4px;
  border-radius: 50%;
  background: #707070;
  margin-right: 1rem;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;

const AccountSetupList = () => {
  return (
    <List>
      <div>
        <TH>To Do</TH>
        {TaskData.filter(task => !task.isCompleted()).map((task, index) => (
          <TaskItem key={index}>
            <Circle />
            {task.node()}
          </TaskItem>
        ))}
      </div>
      <div>
        <TH>Complete</TH>
        {TaskData.filter(task => task.isCompleted()).map((task, index) => (
          <TaskItem key={index}>
            <Span>
              <CheckGreen style={{ display: 'block' }} aria-label="complete" />
            </Span>
            {task.node()}
          </TaskItem>
        ))}
      </div>
    </List>
  )
};

export default AccountSetupList;