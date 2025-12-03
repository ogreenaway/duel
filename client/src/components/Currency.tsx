interface CurrencyProps {
  value: number | null;
}

const Currency = ({ value }: CurrencyProps) => {
  if (value === null) {
    return null;
  }

  return (
    <>
      {new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
      }).format(value)}
    </>
  );
};

export default Currency;
