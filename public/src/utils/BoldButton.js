import { useEffect, useRef } from 'react';

const BoldButton = ({ invoice, amount, integritySignature }) => {
  const scriptRef = useRef(null);
  useEffect(() => {
    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.src = 'https://checkout.bold.co/library/boldPaymentButton.js';
      script.setAttribute('data-bold-button', 'default');
      script.setAttribute('data-order-id', invoice);
      script.setAttribute('data-currency', 'COP');
      script.setAttribute('data-amount', amount);
      script.setAttribute('data-api-key', `${process.env.NEXT_PUBLIC_BOLD_PUBLIC_KEY}`);
      script.setAttribute('data-integrity-signature', integritySignature);
      script.setAttribute('data-notification-url', 'https://zoexbet.com/app/user/notify-invoice-bold/');
      script.setAttribute('data-redirection-url', 'https://zoexbet.com');
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
