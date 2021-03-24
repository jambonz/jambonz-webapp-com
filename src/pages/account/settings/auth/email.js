import { useState, useRef } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

import InternalMain from "../../../../components/wrappers/InternalMain";
import Section from "../../../../components/blocks/Section";
import P from "../../../../components/elements/P";
import Form from "../../../../components/elements/Form";
import Label from "../../../../components/elements/Label";
import Input from "../../../../components/elements/Input";
import PasswordInput from "../../../../components/elements/PasswordInput";
import FormError from "../../../../components/blocks/FormError";
import InputGroup from "../../../../components/elements/InputGroup";
import Button from "../../../../components/elements/Button";

const SettingsAuthEmail = () => {
  const [name, setName] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Refs
  const refName = useRef(null);
  const refEmail = useRef(null);
  const refPassword = useRef(null);

  const handleSubmit = async (e) => {};

  return (
    <InternalMain
      type="form"
      title="Sign In With Email"
      breadcrumbs={[{ name: "Back to Settings", url: "/account/settings" }]}
    >
      <Section>
        <P>
          The following information is required to use your email address for
          authentication.
        </P>
        <Form large onSubmit={handleSubmit}>
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            invalid={nameInvalid}
            autoFocus
            ref={refName}
          />
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            invalid={emailInvalid}
            autoFocus
            ref={refEmail}
          />
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            allowShowPassword
            name="password"
            id="password"
            password={password}
            setPassword={setPassword}
            setErrorMessage={setErrorMessage}
            invalid={passwordInvalid}
            ref={refPassword}
          />
          {errorMessage && <FormError grid message={errorMessage} />}
          <InputGroup flexEnd spaced>
            <Button
              gray="true"
              as={ReactRouterLink}
              to="/account/settings/auth"
            >
              Cancel
            </Button>
            <Button>Continue</Button>
          </InputGroup>
        </Form>
      </Section>
    </InternalMain>
  );
};

export default SettingsAuthEmail;
