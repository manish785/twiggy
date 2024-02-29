import { CDN_URL } from '../utils/constants';

const RestaurantCard = ({
        cloudinaryImageId,
        name,
        cuisines,
        costForTwo,
        avgRating,
        sla,
        deliveryTime
    }) => {
   

    return(
        <div className="m-4 p-4 h-[500px] w-[250px] rounded-lg bg-gray-100 hover:bg-gray-200">  
            <img 
                className="rounded-lg h-[280px] w-[400px]"
                alt='res-logo' 
                src={
                    CDN_URL
                    + cloudinaryImageId
                }
            />
            <h3 className='font-bold py-4 text-lg'>{name}</h3>
            <h4>{cuisines ? cuisines.join(", ") : "Cuisine information not available"}</h4>
            <div className="flex justify-between items-center text-gray-600 mt-4 text-sm ">
            <h4 className=" px-2 p-1 bg-green-700 rounded-md text-white ">
                <p className="">★{avgRating}</p>{" "}
            </h4>
            <h4>{sla.deliveryTime} mins</h4>
            <h4>{costForTwo}</h4>
            </div>
        </div>
    )
}


// Higher Order Component

// input - RestaurantCard => RestaurantCardPromoted

// export const withPromotedLabel = ( RestaurantCard ) => {
//     return (props) => {
//         return (
//             <div>
//                 <label className='absolute bg-black text-white m-2 p-2 rounded-lg'>Promoted</label>
//                 <RestaurantCard {...props}/>
//             </div>
//         )
//     }
// }


export default RestaurantCard;