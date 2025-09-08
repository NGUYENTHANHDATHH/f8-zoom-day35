
import Navigation from './components/Navigation';
import Button from './pages/Buttons';
function App() {

  return (
    <>
      <Navigation />
      <Button>Click me</Button>
      <Button primary>Primary Button</Button>
      <Button href="https://google.com" target="_blank">
        Go to Google
      </Button>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
      <Button bordered>Bordered</Button>
      <Button rounded>Rounded</Button>
      <Button primary rounded>Primary Rounded</Button>
      <Button primary rounded disabled> dis</Button>
      <Button primary rounded>Primary Rounded</Button>
      <Button loading>Loading</Button>
      <Button primary loading>Primary Loading</Button>

    </>
  );
}


export default App
