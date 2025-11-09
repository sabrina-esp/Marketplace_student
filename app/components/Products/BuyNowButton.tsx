"use client";

type Props = {
  price: number;
};

const BuyNowButton = ({ price }: Props) => {
  return (
    <button
      onClick={() => alert('Purchase flow coming soon')}
      className="bg-purple text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all hover:shadow-lg"
    >
      Buy Now
    </button>
  );
};

export default BuyNowButton;


