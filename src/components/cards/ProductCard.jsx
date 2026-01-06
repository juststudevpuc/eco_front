import React from 'react'

const ProductCard = () => {
  return (
    <div>
         <div className='flex justify-center'>
        <div className=" flex flex-wrap justify-center gap-6 w-full ">
          {products.map((item, index) => (
            <div key={index} className=" bg-blue-900 font-mono text-amber-400 border border-white hover:bg-blue-700 hover:scale-105 transition-all duration-300 rounded-xl w-64 mt-5">
              <div className='flex justify-center'>
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-50"
                />
              </div>
              <div className='m-3'>
                <h3 className='font-black text-xl'>{item.title}</h3>
                <p className='text-amber-200'>{item.description}</p>
                <p>{item.category}</p>
              </div>
              <div className="flex justify-center m-2">
                <div className="bg-amber-500 text-white font-mono border-white rounded-xl w-30 h-10 
                  hover:bg-amber-600 hover:scale-105 transition-all duration-300 
                  flex justify-center items-center">
                  <h3>${item.price}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  )
}

export default ProductCard
