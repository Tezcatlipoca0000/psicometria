import DepresionTest from "@/app/components/1_depresion_zung.js";

export default function TestsList() {
  const tests = [
    <DepresionTest />,
    "Other"
  ];

  const cardsList = tests.map((value, index) => {
    return (
        <div key={`test_${index}`} className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 mt-8 ml-8">
            {value}
        </div>
    );
  });

  return (
    
    <div className="w-full h-full flex ">
      {cardsList}
    </div>
        
  );
}
