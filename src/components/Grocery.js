import Footer from "./Footer";
import { GROCERY_URL } from '../utils/constants';

const Grocery = () => {
    
    return(
        <>
        <div className="w-full h-[290px]">
            <img
             className="h-[1000px] w-full mt-[0px] relative"
             src={GROCERY_URL}
             alt='grocery-url'
            />
        </div>
        <div className='mt-[710px]'>
        <Footer/>
        </div>
        </>
    )
}


export default Grocery;