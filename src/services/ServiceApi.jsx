import {services} from "../data/services";

const normalizeService = (s) => ({
   serviceId: s.serviceId,
  title: s.title,
  description: s.description,
  category: s.category,
  price: s.price,
  rating: s.rating,
  deliveryTime: s.deliveryTime,
  provider: s.provider,
  images: s.images,
  status: s.status,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});


// getAllServices
export function getAllServices(){ 
    return new Promise( (resolve) =>{
        setTimeout(() => {
      resolve(services.map(normalizeService));
    }, 500);
    })
}
////////////////////////////////////////////////////////////////////////////
// get service by id

export function getServiceById(id){
    return new Promise((resolve) => {
    const service = services.find((s) => s.serviceId === id);
    setTimeout(() => resolve(service ? normalizeService(service) : null), 300);
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

    setTimeout(() => {
      resolve(result.map(normalizeService));
    }, 300);
  });
}

///////////////////////////////////////////////////////
//search by title 
export function searchServices(query){
   return new Promise((resolve) => {
    const result = services.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );

    setTimeout(() => {
      resolve(result.map(normalizeService));
    }, 300);
  });
}
