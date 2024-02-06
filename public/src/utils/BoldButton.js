import { useEffect, useRef } from 'react';

const BoldButton = ({ orderId, amount, integritySignature }) => {
  const scriptRef = useRef(null);
  useEffect(() => {
    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.setAttribute('data-bold-button', 'default');
      script.setAttribute('data-order-id', 'ABCD200');
      script.setAttribute('data-currency', 'COP');
      script.setAttribute('data-amount', '200');
      script.setAttribute('data-api-key', 'B7pKSnh4RSGyWRhxQcc0Y6lTZyzMBWgpRpQmknCrYW0');
      script.setAttribute('data-integrity-signature', "a96ac58813e71b0b5232243883851fe19c3dae3269c68ac4fb17ba2352b8084e");
      script.setAttribute('data-redirection-url', 'https://micomercio.com/pagos/resultado');
      const container = document.getElementById('button');
      container?.insertAdjacentElement('afterend', script);

      scriptRef.current = script;
    }

    return () => {
    };
  }, []);

  return (
    <div id="button"></div>
  );
};

export default BoldButton;
