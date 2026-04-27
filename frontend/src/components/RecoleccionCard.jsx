import React from 'react';

const RecoleccionCard = ({ barrio, horarios }) => {
    return (



        <div class="w-full max-w-md p-4 bg-[#66a939] border border-gray-200 rounded-lg shadow-sm sm:p-8 ">
            <div class="flex items-center justify-between mb-4">
                <h5 class="text-xl font-bold leading-none text-[#f5f8f5] ">{barrio}</h5>
                <a href="#" class="text-sm font-medium text-[#dee9e0] hover:underline ">
                    Ver Todo
                </a>
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 ">
                    {horarios.map((horario, index) => (
                        <li class="py-3 sm:py-4">
                            <div class="flex items-center">
                                <div class="flex-1 min-w-0 ms-4">
                                    <p class="text-sm font-medium text-white truncate ">
                                        {horario.dia}
                                    </p>
                                    <p class="text-sm text-gray-100 truncate ">
                                        {horario.materiales}
                                    </p>
                                </div>
                                <div class="inline-flex items-center text-base font-semibold text-white ">
                                    {horario.hora}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    
  );
};

export default RecoleccionCard;




