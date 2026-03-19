// src/user/pages/specialist-register/components/Stepper.tsx

interface Props {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center relative">
            
            {/* LINE */}
            {index !== 0 && (
              <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-300 -z-10"></div>
            )}

            {/* CIRCLE */}
            <div
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-semibold
              ${
                index < currentStep
                  ? "bg-green-500 text-white"
                  : index === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>

            {/* LABEL */}
            <p className="text-xs mt-2">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}