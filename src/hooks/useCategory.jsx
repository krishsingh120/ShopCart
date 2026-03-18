import { useEffect, useState } from "react";
import { getAllCategories } from "../apis/fakeStoreProdApi";
import axios from "axios";

function useCategory(){
    const [categories, setCategories] = useState([]);

    async function downloadCategories(){
        const response = await axios.get(getAllCategories());
        setCategories(response.data);
    }
    
    useEffect(() => {
        downloadCategories();
    }, []);
    return [categories];
}
export default useCategory;