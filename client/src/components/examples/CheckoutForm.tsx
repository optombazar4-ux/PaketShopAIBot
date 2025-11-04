import CheckoutForm from '../CheckoutForm';

export default function CheckoutFormExample() {
  return (
    <div className="p-4 max-w-md">
      <CheckoutForm
        defaultName="Alisher Navoiy"
        defaultPhone="+998901234567"
        onSubmit={(data) => console.log('Order submitted:', data)}
        isLoading={false}
      />
    </div>
  );
}
