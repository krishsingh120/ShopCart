export function getAllCategories(){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/products/categories`;
}

export function getAllProduct(){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/products`;
}

export function getProductByCategory(category){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/products/category/${category}`;
}

export function getProduct(id){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/products/${id}`;
}

export function signup(){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/users`;
}

export function signin(){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/auth/login`;
}
export function getCartbyUser(id){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/carts/user/${id}`;
}

export function addProductToUserCart(){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/carts`;
}
export function updateProuctInCart(){
    return `${import.meta.env.VITE_FAKE_STORE_URL}/carts/updateProduct`;
}