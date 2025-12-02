import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

//aca cargo mi clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface Props {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentSuccess: () => void;
}

//Este el componente interno, dentro del formulario, o sea dentro del <Elemento>
const CheckoutForm = ({
  onClose,
  total,
  onPaymentSuccess,
}: Omit<Props, "isOpen">) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return; //si es que el stripe no cargo aún

    setLoading(true);
    setErrorMessage(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) return;

    //Acá el stripe valida la tarjeta
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setErrorMessage(error.message || "Error al procesar el pago");
      setLoading(false);
    } else {
      //Bueno, me di cuenta que no funciona la tarjeta que no debería funcionar y para probar agregue
      //un if de que si termina x forma (la tarjeta que no debería, tira un error)
      if (paymentMethod.card && paymentMethod.card.last4 === "0002") {
        setErrorMessage("Su tarjeta fue rechazada por el banco");
        setLoading(false);
        return; //aca lo corto para evitar que se "realice"
      }

      console.log("Pago exitoso:", paymentMethod);
      setTimeout(() => {
        setLoading(false);
        onPaymentSuccess();
        onClose();
      }, 1000);
    }
  };

  //Estilos para el input de la tarjeta de stripe
  const cardStyle = {
    style: {
      base: {
        color: "#99d626ff",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#c8b5bbff",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6 border-b pb-4">
        <h3 className="text-xl font-bold text-gray-800">Pagar con Stripe</h3>
        {/**btn de cancelar*/}
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-red-500 font-bold text-xl"
        >
          X
        </button>

        <div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-900 flex justify-between items-center">
          <span className="text-blue-800 font-medium">Total a pagar:</span>
          <span className="text-3xl font-bold text-blue-900">${total}</span>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Datos de la tarjeta
          </label>
          <div className="p-4 border border-gray-300 rounded-lg bg-white shadow-sm">
            {/* Este es el input oficial de Stripe*/}
            <CardElement options={cardStyle} />
          </div>
        </div>
        {/**esto pasaria si la tarjeta no es valida, en este caso yo le puse al mensaje que fue rechazada por el banco*/}
        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg flex items-center gap-2">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Alerta (contorno)</title>
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  d="M12 3L2.5 20h19L12 3z"
                />
                <line
                  x1="12"
                  y1="10"
                  x2="12"
                  y2="15"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <circle cx="12" cy="18" r="1" fill="currentColor" />
              </svg>
            </span>
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition shadow-lg active:scale-95 duration-200 disabled:bg-gray-400 flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              {/**le agregue animacion de procesando el pago*/}
              <div className="animate-spin roudend-full h-5 w-5 border-b-2 border-white"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <span>Pagar Ahora</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <title>Pagar (tarjeta)</title>{" "}
                {/**debería parecer esto al posar el mouse encima del icono */}
                <path
                  fill="currentColor"
                  d="M3 4h18a2 2 0 0 1 2 2v3H1V6a2 2 0 0 1 2-2zm-2 7h22v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-7zm5 4h4v2H6v-2z"
                />
              </svg>
            </>
          )}
        </button>
        <div className="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          {/**Svg de un candado*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M17 8h-1V6a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-3 0H10V6a2 2 0 0 1 4 0v2z"
            />
          </svg>
          <span> Pago procesados de forma segura por</span>
          <span className="font-bold text-blue-300">Stripe</span>
        </div>
      </div>
    </form>
  );
};

//El Modal
export const PasarelaStripe = ({
  isOpen,
  onClose,
  total,
  onPaymentSuccess,
}: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        {/**aca es donde Elements debe envolver el formulario que usa el CardElement*/}
        <Elements stripe={stripePromise}>
          <CheckoutForm
            onClose={onClose}
            total={total}
            onPaymentSuccess={onPaymentSuccess}
          />
        </Elements>
      </div>
    </div>
  );
};
