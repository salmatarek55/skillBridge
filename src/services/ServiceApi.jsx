import {services} from "../data/services";

// getAllServices
export function getAllServices(){
  
    return new Promise( (resolve) =>{
        setTimeout(() => {
      resolve(services);
    }, 500);
    })
}
////////////////////////////////////////////////////////////////////////////
// get service by id

export function getServiceById(id){
    return new Promise((resolve) => {
    const service = services.find((s) => s.serviceId === id);
    setTimeout(() => resolve(service), 300);
  });
}

///////////////////////////////////////////////////////

//filter services
export function filterServices({category , price, rating}){
    return new Promise((resolve) => {
    let result = [...services];

    if (category) {
      result = result.filter((s) => s.category === category);
    }

    if (price) {
      result = result.filter((s) => s.price <= price);
    }

    if (rating) {
      result = result.filter((s) => s.rating >= rating);
    }

    setTimeout(() => resolve(result), 300);
  });
}

///////////////////////////////////////////////////////
//search by title 
export function searchServices(query){
   return new Promise((resolve) => {
    const result = services.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );

    setTimeout(() => resolve(result), 300);
  });
}
