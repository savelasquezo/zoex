import Container from './container';
import Logo from './logo';
import Authentication from './authentication';

export default function Header() {
  return (
    <header className="">
      <Container>
        <Logo />
        <Authentication/>
      </Container>
    </header>
  );
}