import { useState } from 'react';
import ItemList from "./itemList";

const RestaurantCategory = ({ data, showItems, setShowIndex, dummy}) => {
    
    const handleClick = () => {
        // // console.log('handle Clicked');
        // setShowItems(!showItems);
        setShowIndex();
    }

    return <div>
        {/* Header */}
        <div className="w-6/12 mx-auto my-4 bg-gray-50 shadow-lg p-4">
            <div className="flex justify-between cursor-pointer" onClick={handleClick}>
                <span className="font-bold text-lg">{data.title} ({data.itemCards.length})</span>
                <span>⬇️</span>
            </div>   
        </div>
        {/* Accordian Body */}
        {showItems && <ItemList items={data.itemCards} dummy={dummy}/>}
    </div>
};


export default RestaurantCategory;