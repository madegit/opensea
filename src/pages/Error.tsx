import { useEffect } from 'react';
import Error500 from '../components/Error500';
import { useLocation } from 'react-router-dom';

const Error = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if this is a form submission confirmation
    const searchParams = new URLSearchParams(location.search);
    const formName = searchParams.get('form');
    const success = searchParams.get('success');
    
    if (formName && success === 'true') {
      console.log(`Form ${formName} submitted successfully`);
    }
  }, [location]);

  return <Error500 />;
};

export default Error; 