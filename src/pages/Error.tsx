import { useEffect, useState } from 'react';
import Error500 from '../components/Error500';
import { useLocation } from 'react-router-dom';

const Error = () => {
  const location = useLocation();
  const [isFormSubmission, setIsFormSubmission] = useState(false);

  useEffect(() => {
    // Check if this is a form submission confirmation
    const searchParams = new URLSearchParams(location.search);
    const formName = searchParams.get('form');
    const success = searchParams.get('success');
    
    if (formName && success === 'true') {
      setIsFormSubmission(true);
      // You can add additional logic here for form submission handling
      // For example, analytics tracking, custom messages, etc.
    }
  }, [location]);

  return <Error500 />;
};

export default Error; 