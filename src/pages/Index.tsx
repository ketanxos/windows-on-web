import { WindowProvider } from '@/contexts/WindowContext';
import { Desktop } from '@/components/desktop/Desktop';

const Index = () => {
  return (
    <WindowProvider>
      <Desktop />
    </WindowProvider>
  );
};

export default Index;
