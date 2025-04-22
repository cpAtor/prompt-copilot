import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import ApiKeyInput from './components/ApiKeyInput';

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <ApiKeyInput />
        <ChatInterface />
      </Layout>
    </Provider>
  );
}

export default App;
