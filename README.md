# 📘 Shop Cart - React Interview Preparation Guide

## 1. Project Overview

**Shop Cart** is a modern e-commerce React application built with Vite, designed for frontend technical interviews and practical learning.

- **Type:** React + Vite e-commerce sample app with product catalog, authentication, and shopping cart
- **Purpose:** Demonstrate component architecture, state management, and routing patterns
- **Backend:** Uses Fake Store API + custom auth/cart endpoints via `VITE_FAKE_STORE_URL`
- **Key Libraries:**
  - React Router DOM (routing)
  - Axios (HTTP requests)
  - React Context API (state management)
  - React Cookie (token persistence)
  - Reactstrap + Bootstrap (UI components)
  - JWT Decode (token parsing)

---

## 2. Frontend Architecture (HLD)

### 2.1 Overall Data Flow

```
main.jsx
  └─ BrowserRouter + CookiesProvider
      └─ App.jsx
          ├─ UserContext (user, setUser)
          ├─ CartContext (cart, setCart)
          ├─ Header
          └─ MainRoutes
```

### 2.2 Application Lifecycle

1. **App Initialization:**
   - `main.jsx` wraps app with `BrowserRouter` and `CookiesProvider`
   - `App.jsx` initializes global contexts

2. **User Authentication Flow:**
   - On mount, `App` calls `/accesstoken` endpoint
   - Backend returns JWT token → stored in cookie
   - Token decoded using `jwtDecode` → extract `username` and `id`
   - User object set in `UserContext`

3. **Cart Loading:**
   - Once user is set, `fetchUserCart` is called
   - Fetches user's cart from `/carts/user/{userId}`
   - Cart data stored in `CartContext`

4. **Navigation & Rendering:**
   - `MainRoutes` renders appropriate page based on URL
   - Components access global state via `useContext`

### 2.3 Routing Structure (React Router)

| Route                    | Component        | Purpose                              |
| ------------------------ | ---------------- | ------------------------------------ |
| `/`                      | `Home`           | Category showcase & navigation       |
| `/products`              | `ProductList`    | All products with filters            |
| `/products?category=...` | `ProductList`    | Filtered products by category        |
| `/products/:id`          | `ProductDetails` | Single product details + add to cart |
| `/signup`                | `Signup`         | User registration                    |
| `/signin`                | `Login`          | User login                           |
| `/cart/:userId`          | `Cart`           | Shopping cart view & management      |
| `*`                      | `Error`          | 404 Not Found page                   |

### 2.4 State Management Strategy

**Global State (Context):**

- `UserContext`: Contains authenticated user info & setter
  ```jsx
  { user: { username, id }, setUser }
  ```
- `CartContext`: Contains user's shopping cart & setter
  ```jsx
  { cart: { products: [...] }, setCart }
  ```

**Component Local State:**

- Product lists, form inputs, loading states
- Fetched data before API integration

**Why Context instead of Redux?**

- Small app with only 2-3 global dependencies
- Avoids prop drilling across nested routes
- Built-in React solution, no boilerplate
- Sufficient for this scale

### 2.5 API Layer Architecture

**Endpoint Constants** (`src/apis/fakeStoreProdApi.js`):

- All API URLs centralized in single file
- Uses environment variable `VITE_FAKE_STORE_URL`
- Functions return complete URL strings

**HTTP Client:**

- Axios used for all API calls
- Supports `withCredentials: true` for cookie-based auth
- Error handling in try-catch blocks at call site

**Key Endpoints:**
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/accesstoken` | Get JWT token (called once on app load) |
| POST | `/auth/login` | User login with credentials |
| POST | `/users` | User registration |
| GET | `/products` | Fetch all products |
| GET | `/products/categories` | Fetch all categories |
| GET | `/products/category/{category}` | Fetch products by category |
| GET | `/products/{id}` | Fetch single product details |
| GET | `/carts/user/{userId}` | Fetch user's cart |
| PUT | `/carts` | Add product to cart |
| PUT | `/carts/updateProduct` | Update product quantity in cart |

---

## 3. Component Structure

### 3.1 Component Hierarchy Tree

```
App (Root - provides contexts)
│
├── Header (Global navigation)
│   ├── Navbar with Options dropdown
│   ├── User profile display
│   └── Cart link
│
└── MainRoutes (Page routing)
    ├── Home
    │   ├── useCategory hook
    │   ├── Category (mapped)
    │   └── Category (mapped)
    │
    ├── ProductList
    │   ├── FilterProduct
    │   │   └── useCategory hook (sidebar filters)
    │   └── ProductBox (grid - mapped)
    │
    ├── ProductDetails
    │   ├── Product image display
    │   ├── Product info (title, price, description)
    │   └── Add to Cart button
    │
    ├── Cart
    │   ├── OrderDetails (cart items - mapped)
    │   │   ├── Product image
    │   │   ├── Product details
    │   │   └── Quantity selector + Remove
    │   └── Price Details panel
    │
    ├── Signup
    │   └── Auth (form component)
    │
    ├── Login
    │   └── Auth (form component)
    │
    └── Error (404 page)
```

### 3.2 Component Props & Context Usage

**ProductBox:**

- Props: `id`, `title`, `price`, `image` (spread from product object)
- Output: Clickable card linking to `/products/{id}`

**Category:**

- Props: `itemName` (display text), `filter` (query param value)
- Output: Link to `/products?category={filter}`

**FilterProduct:**

- Hook: `useCategory()`
- Refs: `minRef`, `maxRef` (price filters)
- Functions: `handleCategoryNavigate()`, `filterByPrice()`
- Output: Sidebar with category list and price range

**Auth:**

- Props: `onSubmit` (callback), `resetForm` (trigger reset)
- Local State: `formDetails` (username, email, password, isLoading)
- Output: Form with spinner on submit

**OrderDetails:**

- Props: `title`, `price`, `image`, `quantity`, `onRemove` (callback)
- Output: Cart item card with quantity selector

**Header:**

- Context: `UserContext`, `CartContext`
- Cookies: `jwt-token`
- Functions: `logout()` (clears cookie, context, redirects)
- Output: Navbar with user info and dropdown menu

---

## 4. Folder Structure Explanation

### `src/components/`

Reusable UI components used across multiple pages:

- **Auth/Auth.jsx** - Shared login/signup form (username, email, password inputs + submit button)
- **Header/Header.jsx** - Navigation bar with user menu and logout
- **Category/Category.jsx** - Category filter pill button
- **FilterProduct/FilterProduct.jsx** - Sidebar with category and price filters
- **ProductBox/ProductBox.jsx** - Single product card in grid
- **OrderDetails/OrderDetails.jsx** - Cart item display with quantity and remove
- **Footer/Footer.jsx** - Footer component (if needed)

### `src/pages/`

Page-level components mapped to routes:

- **Home/Home.jsx** - Landing page showing categories
- **ProductList/ProductList.jsx** - Product grid with filtering
- **ProductDetails/ProductDetails.jsx** - Single product page with add-to-cart
- **Cart/Cart.jsx** - Shopping cart with order summary
- **Authentication/Login.jsx** - User login page
- **Authentication/Signup.jsx** - User registration page
- **Error/Error.jsx** - 404 error page

### `src/context/`

React Context for global state:

- **UserContext.js** - Manages logged-in user object
- **CartContext.js** - Manages shopping cart object

### `src/hooks/`

Custom React hooks for reusable logic:

- **useCategory.jsx** - Fetches and caches product categories
- **useCart.jsx** - Manages cart state with user ID

### `src/apis/`

API endpoint definitions and utilities:

- **fakeStoreProdApi.js** - Centralized API URL builder functions

### `src/helper/`

Utility functions:

- **fetchUserCart.jsx** - Fetches and sets user cart from API

### `src/routes/`

Routing configuration:

- **MainRoutes.jsx** - All route definitions using React Router

### `src/`

Root-level files:

- **main.jsx** - App entry point with providers wrapping
- **App.jsx** - Root component with context providers and initial auth logic
- **App.css** - Global styles
- **index.css** - Base CSS

---

## 5. Key Code Walkthrough

### 5.1 `App.jsx` - Core Application Logic

```jsx
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useCookies(["jwt-token"]);
  const [cart, setCart] = useState({});

  // Fetches JWT token from backend and sets user
  async function accesstoken() {
    const res = await axios.get(
      `${import.meta.env.VITE_FAKE_STORE_URL}/accesstoken`,
      { withCredentials: true },
    );
    setToken("jwt-token", res.data.token, { httpOnly: true });
    const tokenDetails = jwtDecode(res.data.token);
    setUser({ username: tokenDetails.user, id: tokenDetails.id });
  }

  // Loads token and cart on app initialization
  async function load() {
    if (!user) {
      accesstoken(); // Get token and user
    }
    if (user) {
      await fetchUserCart(user.id, setCart); // Load cart
    }
  }

  // Trigger load when user state changes
  useEffect(() => {
    load();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <CartContext.Provider value={{ cart, setCart }}>
        <div className="app-wrapper">
          <Header />
          <MainRoutes />
        </div>
      </CartContext.Provider>
    </UserContext.Provider>
  );
}
```

**Key Points:**

- Uses `axios` with `withCredentials: true` to send cookies
- JWT token decoded using `jwtDecode` library
- `useEffect` dependency on `user` triggers cart fetch after authentication
- Provides both user and cart contexts to entire app

### 5.2 `useCategory()` Hook - Custom Data Fetching

```jsx
function useCategory() {
  const [categories, setCategories] = useState([]);

  async function downloadCategories() {
    const response = await axios.get(getAllCategories());
    setCategories(response.data);
  }

  useEffect(() => {
    downloadCategories();
  }, []);

  return [categories];
}
```

**Usage Pattern:**

- Called in `Home` and `FilterProduct`
- Fetches once on first render (empty dependency array)
- Returns array with categories

### 5.3 `ProductList.jsx` - Dynamic Filtering with Query Params

```jsx
function ProductList() {
  const [productList, setProductList] = useState(null);
  const [query] = useSearchParams();

  async function downloadAllProduct(category) {
    const downloadUrl = category
      ? getProductByCategory(category)
      : getAllProduct();
    const response = await axios.get(downloadUrl);
    setProductList(response.data);
  }

  useEffect(() => {
    downloadAllProduct(query.get("category"));
  }, [query.get("category")]);

  return (
    <div className="product-list-wrapper d-flex flex-row">
      <FilterProduct />
      <div className="product-list-box">
        {productList &&
          productList.map((product) => (
            <ProductBox {...product} key={product.id} />
          ))}
      </div>
    </div>
  );
}
```

**Key Points:**

- `useSearchParams()` reads query string from URL
- `query.get("category")` extracts category filter value
- `useEffect` re-runs when category changes
- Products spread as props to `ProductBox`

### 5.4 `ProductDetails.jsx` - Single Product & Add to Cart

```jsx
function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { setCart } = useContext(CartContext);
  const [product, setProduct] = useState();

  async function downloadProductById(id) {
    const response = await axios.get(getProduct(id));
    setProduct(response.data);
  }

  async function addProductToCart() {
    if (!user) return; // Prevent adding if not logged in
    const response = await axios.put(addProductToUserCart(), {
      userId: user.id,
      productId: id,
    });
    setCart({ ...response.data }); // Update global cart
    navigate(`/cart/${user.id}`); // Navigate to cart
  }

  useEffect(() => {
    downloadProductById(id);
  }, []);

  return (
    product && (
      <div>
        <img src={product.image} />
        <h2>{product.title}</h2>
        <p>₹ {product.price}</p>
        <p>{product.description}</p>
        <button onClick={addProductToCart}>Add to Cart</button>
      </div>
    )
  );
}
```

**Flow:**

1. Extract product `id` from URL param
2. Fetch product details on mount
3. On "Add to Cart" click:
   - Call API to add product
   - Update cart context with response
   - Navigate to cart page

### 5.5 `Cart.jsx` - Cart Display & Item Management

```jsx
function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const [products, setProduct] = useState([]);
  const { user } = useContext(UserContext);

  async function downloadCart(cart) {
    if (!cart || !cart.products) return;

    // Map productId to quantity
    const productMapping = {};
    cart.products.forEach((product) => {
      productMapping[product.productId] = product.quantity;
    });

    // Fetch all product details in parallel
    const productPromise = cart.products.map((product) =>
      axios.get(getProduct(product.productId)),
    );
    const productPromiseResponse = await axios.all(productPromise);

    // Merge product details with quantities
    const downloadProduct = productPromiseResponse.map((product) => ({
      ...product.data,
      quantity: productMapping[product.data.id],
    }));
    setProduct(downloadProduct);
  }

  async function updateProduct(productId, quantity) {
    if (!user) return;
    const response = await axios.put(updateProuctInCart(), {
      userId: user.id,
      productId,
      quantity,
    });
    setCart({ ...response.data });
  }

  useEffect(() => {
    downloadCart(cart);
  }, [cart]);

  return (
    <div>
      <div className="orderDetails">
        {products.map((product) => (
          <OrderDetails
            key={product.id}
            title={product.title}
            image={product.image}
            price={product.price}
            quantity={product.quantity}
            onRemove={() => updateProduct(product.id, 0)}
          />
        ))}
      </div>
      <div className="priceDetails">
        <p>Price: ₹{/* calculate total */}</p>
        <p>Total: ₹{/* calculate final */}</p>
      </div>
    </div>
  );
}
```

**Key Pattern:**

- `axios.all()` for parallel requests
- Maps cart items to product details
- `updateProduct` with quantity 0 removes item

### 5.6 `Auth.jsx` - Reusable Form Component

```jsx
function Auth({ onSubmit, resetForm }) {
  const [formDetails, setFormDetails] = useState({
    username: "",
    email: "",
    password: "",
    isLoading: false,
  });

  function onFormSubmit() {
    setFormDetails({ ...formDetails, isLoading: true });
    onSubmit(formDetails); // Callback to parent
  }

  useEffect(() => {
    setFormDetails({ username: "", email: "", password: "", isLoading: false });
  }, [resetForm]); // Reset when parent prop changes

  return (
    <>
      <input
        onChange={(e) =>
          setFormDetails({ ...formDetails, username: e.target.value })
        }
        value={formDetails.username}
        placeholder="Username"
      />
      <input
        onChange={(e) =>
          setFormDetails({ ...formDetails, email: e.target.value })
        }
        value={formDetails.email}
        placeholder="Email"
      />
      <input
        onChange={(e) =>
          setFormDetails({ ...formDetails, password: e.target.value })
        }
        value={formDetails.password}
        type="password"
        placeholder="Password"
      />
      <button onClick={onFormSubmit} disabled={formDetails.isLoading}>
        {formDetails.isLoading ? "Loading..." : "Submit"}
      </button>
    </>
  );
}
```

**Pattern:**

- Component is controlled (all state in component)
- Parent provides `onSubmit` callback to handle form data
- `resetForm` prop triggers form reset

### 5.7 `Login.jsx` - Authentication Handling

```jsx
function Login() {
  const navigate = useNavigate();
  const [token, setToken] = useCookies(["jwt-token"]);
  const { setUser } = useContext(UserContext);

  async function onAuthformSubmit(authArguments) {
    try {
      const response = await axios.post(
        signin(),
        {
          username: authArguments.username,
          email: authArguments.email,
          password: authArguments.password,
        },
        { withCredentials: true },
      );

      // Store token in cookie
      setToken("jwt-token", response.data.token, { httpOnly: true });

      // Decode and store user
      const tokenDetails = jwtDecode(response.data.token);
      setUser({ username: tokenDetails.user, id: tokenDetails.id });

      // Navigate home
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h4>Login</h4>
      <Auth onSubmit={onAuthformSubmit} />
    </div>
  );
}
```

**Flow:**

1. Form submitted with credentials
2. POST to `/auth/login`
3. JWT stored in httpOnly cookie
4. User context updated from decoded JWT
5. Redirect to home

---

## 6. Important React Concepts Used

### 6.1 Hooks

| Hook              | Usage                       | Example                                         |
| ----------------- | --------------------------- | ----------------------------------------------- |
| `useState`        | Local component state       | `const [user, setUser] = useState(null)`        |
| `useEffect`       | Side effects, data fetching | `useEffect(() => { fetch() }, [dependency])`    |
| `useContext`      | Access context values       | `const {user} = useContext(UserContext)`        |
| `useRef`          | Persist mutable value       | `const minRef = useRef(null)`                   |
| `useNavigate`     | Programmatic navigation     | `const navigate = useNavigate(); navigate('/')` |
| `useParams`       | Extract URL parameters      | `const {id} = useParams()`                      |
| `useSearchParams` | Extract query parameters    | `const [query] = useSearchParams();`            |

### 6.2 Context API

**Pattern:**

```jsx
// Create context
const MyContext = createContext(null);

// Provide values
<MyContext.Provider value={{ state, setState }}>
  <Child />
</MyContext.Provider>;

// Consume values
const { state, setState } = useContext(MyContext);
```

**Benefits:**

- Avoid prop drilling
- Share state across deeply nested components
- Easy to set up for small apps

**Drawbacks:**

- All consumers re-render when context changes
- Limited for complex state logic (use Redux for large apps)

### 6.3 Routing with React Router v6

**Key Components:**

- `<BrowserRouter>` - Wraps app, enables routing
- `<Routes>` - Container for all routes
- `<Route>` - Maps path to component
- `<Link>` - Client-side navigation without page reload
- `useNavigate()` - Programmatic navigation
- `useParams()` - Access route parameters
- `useSearchParams()` - Access query string

**Example:**

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products/:id" element={<ProductDetails />} />
</Routes>
```

### 6.4 Controlled Components

**Pattern in Auth.jsx:**

```jsx
<input
  value={formDetails.username}
  onChange={(e) => setFormDetails({ ...formDetails, username: e.target.value })}
/>
```

- React state is single source of truth
- Every keystroke updates state
- Form data always in sync with UI

### 6.5 Props Spreading

```jsx
<ProductBox {...product} key={product.id} />
// Equivalent to:
<ProductBox id={product.id} title={product.title} price={product.price} ... />
```

### 6.6 Conditional Rendering

```jsx
{
  user && <Header />;
}
{
  products && products.map((p) => <ProductBox {...p} />);
}
{
  formDetails.isLoading && <Spinner />;
}
```

### 6.7 Async/Await with Promises

```jsx
// Sequential: wait for each
async function load() {
  await accesstoken();
  await fetchUserCart(user.id, setCart);
}

// Parallel: all at once
const results = await axios.all([axios.get(url1), axios.get(url2)]);
```

### 6.8 Dependency Arrays in useEffect

| Dependency Array | Runs               | Use Case                    |
| ---------------- | ------------------ | --------------------------- |
| `[]`             | Once on mount      | Initial data fetch          |
| `[var]`          | When `var` changes | Re-fetch when input changes |
| No array         | Every render       | Avoid! (performance issue)  |

---

## 7. Interview Questions & Answers

### Q1: Explain the data flow in this application.

**Answer:**
"The app initializes with `App.jsx` which calls `/accesstoken` to get a JWT. The token is decoded and stored in `UserContext`. Once user exists, `fetchUserCart` is called to populate `CartContext`. All pages access these contexts via `useContext`. When user adds product to cart, API updates backend cart, context updates, and page re-renders. Navigation uses React Router query parameters for filtering."

### Q2: Why use Context API here instead of Redux?

**Answer:**
"This app has:

- Only 2 global state objects (user, cart)
- Shallow component tree
- No complex state logic

Redux adds:

- Actions, reducers, dispatch
- Boilerplate code
- Learning curve

Context is simpler here. Redux makes sense for large apps with:

- 10+ global state pieces
- Complex state transitions
- Time-travel debugging needs
- Team already knows Redux"

### Q3: What's the issue with the `useCart` hook?

**Answer:**
"The `useCart` hook calls `fetchUserCart(userId)` without passing `setCart`, so the cart won't update:

```jsx
// Wrong - fetchUserCart can't update cart state
useEffect(() => {
  fetchUserCart(userId); // Missing setCart param
}, [userId]);

// Correct - would need:
useEffect(() => {
  fetchUserCart(userId, setCart);
}, [userId, setCart]);
```

This is why cart loading works in `App.jsx` but not in the custom hook."

### Q4: How would you handle API errors better?

**Answer:**
"Currently errors are console.logged. Better approach:

```jsx
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);

async function downloadProduct(id) {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(getProduct(id));
    setProduct(response.data);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to load");
  } finally {
    setLoading(false);
  }
}

// In UI:
{
  loading && <Spinner />;
}
{
  error && <Alert>{error}</Alert>;
}
{
  product && <ProductCard {...product} />;
}
```

Add retry logic, timeout handling, and user-friendly messages."

### Q5: What security issues exist?

**Answer:**
"Positive:

- JWT in httpOnly cookie (not accessible to JS)
- `withCredentials: true` for CORS

Issues:

- No password validation on frontend
- No HTTPS requirement mentioned
- No CSRF token in forms
- JWT expiry not handled
- Cart can be accessed by any userId in URL

Fixes:

- Add frontend validation
- Implement token refresh logic
- Validate userId matches current user
- Add HTTPS in production"

### Q6: How to optimize the ProductList re-renders?

**Answer:**
"Issues:

1. `ProductBox` re-renders even if props unchanged

Solution:

```jsx
export default React.memo(ProductBox);
// or with custom comparison
export default React.memo(ProductBox, (prev, next) =>
  prev.id === next.id && prev.price === next.price
);
```

2. `useCategory` called in multiple components, fetches multiple times

Solution:

```jsx
// Move to App or custom provider
// Cache categories at higher level
```

3. Query parameter identity changes on each render

Solution:

````jsx
const category = query.get('category');
useEffect(() => {
  downloadAllProduct(category);
}, [category]); // Use extracted value, not query.get()
```"

### Q7: Why does the component tree have nested `<Link>` elements?

**Answer:**
"In `ProductDetails.jsx`:
```jsx
<Link to=\"/cart/2\">
  <Link to={`/cart/${id}`}>Go to Cart</Link>
</Link>
````

Problem:

- Invalid HTML nesting
- Click handler confusion
- React Router only tracks outer link

Fix:

````jsx
<button onClick={() => navigate(`/cart/${user.id}`)}>
  Go to Cart
</button>
```"

### Q8: What happens if user refreshes the page? Will authentication persist?

**Answer:**
"Yes, because:
1. JWT stored in httpOnly cookie (survives refresh)
2. Browser sends cookie in next request
3. `App.jsx` calls `/accesstoken` with cookie
4. Backend returns token from cookie
5. JWT decoded → user context restored

However:
- No check for token validity/expiry
- No redirect if token expired
- `Cart` data lost (depends on context not persistence)"

### Q9: How does category filtering work?

**Answer:**
"Flow:
1. User clicks `Category` component
2. `Category` renders `<Link to='/products?category=electronics'>`
3. Browser navigates with query string
4. `ProductList` reads with `useSearchParams()`
5. `query.get('category')` extracts 'electronics'
6. `useEffect` triggers `downloadAllProduct('electronics')`
7. API called with category filter
8. Results mapped to `ProductBox` components

Query params persist in URL history, enabling back button and bookmarking."

### Q10: How to add unit tests?

**Answer:**
"Using React Testing Library + Vitest:

```jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from './ProductList';

describe('ProductList', () => {
  it('displays products after loading', async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByRole('heading', {name: /All Products/})).toBeInTheDocument();
    });
  });

  it('filters by category', async () => {
    render(<ProductList />);
    const filterBtn = screen.getByText('Electronics');

    await userEvent.click(filterBtn);

    await waitFor(() => {
      expect(screen.getByText('Mock Electronics Product')).toBeInTheDocument();
    });
  });
});
````

Mock API responses with `vitest.mock()`."

---

## 8. Improvements & Future Scope

### 8.1 State Management Improvements

- [ ] **Add `useReducer`** for complex cart operations (add, remove, update quantity in one place)
- [ ] **Add loading & error states** to context (not just data)
- [ ] **Persist cart to localStorage** for offline access
- [ ] **Implement token refresh** logic for JWT expiry
- [ ] **Add user preferences** context (theme, language, etc.)

```jsx
// Better cart context with reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((p) => p.id !== action.payload),
      };
    default:
      return state;
  }
};

const [cart, dispatch] = useReducer(cartReducer, initialCart);
```

### 8.2 Performance Optimizations

- [ ] **Memoize components**: `React.memo(ProductBox)`, `useMemo`, `useCallback`
- [ ] **Code splitting**: Lazy load pages with `React.lazy()`
- [ ] **Image optimization**: Use WebP, lazy load images, placeholders
- [ ] **Pagination**: Avoid loading 1000s of products at once
- [ ] **Debounce search**: Debounce filter inputs to reduce API calls

```jsx
// Lazy route loading
const Home = React.lazy(() => import("./pages/Home/Home"));
const Cart = React.lazy(() => import("./pages/Cart/Cart"));

// In MainRoutes:
<Suspense fallback={<Spinner />}>
  <Route path="/" element={<Home />} />
</Suspense>;
```

### 8.3 UX/UI Improvements

- [ ] **Form validation**: Username length, email format, password strength
- [ ] **Loading spinners**: Show during API calls
- [ ] **Error messages**: User-friendly notifications
- [ ] **Toast notifications**: Feedback on actions (added to cart, logged out)
- [ ] **Empty states**: Show message when no products found
- [ ] **Disabled buttons**: Disable add-to-cart when not logged in
- [ ] **Quantity selector**: Actual quantity change functionality in cart

```jsx
// Better OrderDetails with working quantity
const [qty, setQty] = useState(quantity);

const handleQtyChange = async (newQty) => {
  setQty(newQty);
  await updateProduct(product.id, newQty);
};

<select value={qty} onChange={(e) => handleQtyChange(Number(e.target.value))}>
  {[1, 2, 3, 4, 5].map((i) => (
    <option key={i}>{i}</option>
  ))}
</select>;
```

### 8.4 Security Enhancements

- [ ] **Environment variables**: Move all API URLs to .env
- [ ] **HTTPS enforcement**: Require secure connection in production
- [ ] **CSRF protection**: Add token validation on state-changing requests
- [ ] **Input sanitization**: Prevent XSS attacks
- [ ] **Rate limiting**: Prevent brute force on auth endpoints
- [ ] **Token rotation**: Handle JWT refresh tokens
- [ ] **Access control**: Verify userId matches authenticated user

```jsx
// Verify user can only access their own cart
const Cart = () => {
  const { userId } = useParams();
  const { user } = useContext(UserContext);

  if (user?.id !== userId) {
    return <navigate to="/signin" />;
  }
  // ...
};
```

### 8.5 Code Quality

- [ ] **Fix typos**: `updateProuctInCart` → `updateProductInCart`
- [ ] **Fix className bugs**: `classNameName` → `className`
- [ ] **Remove console.logs**: Before production
- [ ] **Extract constants**: Magic strings into constants
- [ ] **Add JSDoc comments**: Document complex functions
- [ ] **Error boundary**: Catch component errors
- [ ] **Logging**: Structured logging for debugging

```jsx
// Error Boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error);
    // Could send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return <Error />;
    }
    return this.props.children;
  }
}

// Wrap routes
<ErrorBoundary>
  <MainRoutes />
</ErrorBoundary>;
```

### 8.6 Feature Additions

- [ ] **Search functionality**: Search products by name/description
- [ ] **Sorting**: Sort by price (low-high), rating, newest
- [ ] **Wishlist**: Save products for later
- [ ] **Reviews & ratings**: User reviews on products
- [ ] **Checkout flow**: Full order placement process
- [ ] **Payment integration**: Stripe, PayPal, etc.
- [ ] **Order history**: View past orders
- [ ] **User profile**: Edit profile, change password
- [ ] **Admin dashboard**: Manage products, inventory

### 8.7 Testing (Not Implemented)

- [ ] **Unit tests**: Test individual components and functions
- [ ] **Integration tests**: Test feature flows
- [ ] **E2E tests**: Test complete user journeys with Cypress
- [ ] **Accessibility tests**: axe, WAVE for a11y
- [ ] **Performance tests**: Lighthouse, Web Vitals

```jsx
// Example test structure
describe("Cart Flow", () => {
  it("user can add product to cart and checkout", async () => {
    // 1. Login
    // 2. Navigate to products
    // 3. Click add to cart
    // 4. Verify cart updates
    // 5. Navigate to checkout
    // 6. Verify order placed
  });
});
```

### 8.8 DevOps & Deployment

- [ ] **Environment files**: `.env.local`, `.env.production`
- [ ] **Build optimization**: Minification, code splitting
- [ ] **CI/CD pipeline**: GitHub Actions, GitLab CI
- [ ] **Docker**: Containerize app
- [ ] **CDN**: Serve static assets from CDN
- [ ] **Monitoring**: Error tracking (Sentry), analytics

---

## 9. Component Architecture Diagram

```
Application Root
│
├─ BrowserRouter (React Router setup)
│
├─ CookiesProvider (Cookie management)
│
└─ App Component
   │
   ├─ UserContext.Provider (user, setUser)
   │  │
   │  └─ CartContext.Provider (cart, setCart)
   │     │
   │     ├─ Header
   │     │  ├─ Navbar (Reactstrap)
   │     │  ├─ User Info Display
   │     │  └─ Options Dropdown
   │     │     ├─ Cart Link
   │     │     ├─ Settings
   │     │     └─ Logout
   │     │
   │     └─ MainRoutes
   │        │
   │        ├─ Home Page
   │        │  ├─ useCategory Hook
   │        │  ├─ Welcome Title
   │        │  └─ Category List
   │        │     └─ Category Component (repeat)
   │        │
   │        ├─ ProductList Page
   │        │  ├─ FilterProduct Component
   │        │  │  ├─ useCategory Hook
   │        │  │  ├─ Search Bar
   │        │  │  ├─ Category Sidebar
   │        │  │  └─ Price Filter
   │        │  │
   │        │  └─ Product Grid
   │        │     └─ ProductBox Component (repeat)
   │        │
   │        ├─ ProductDetails Page
   │        │  ├─ Product Image
   │        │  ├─ Product Info
   │        │  ├─ Description
   │        │  ├─ Add to Cart Button
   │        │  └─ Go to Cart Link
   │        │
   │        ├─ Cart Page
   │        │  ├─ Order Items List
   │        │  │  └─ OrderDetails Component (repeat)
   │        │  │     ├─ Product Image
   │        │  │     ├─ Product Info
   │        │  │     ├─ Quantity Selector
   │        │  │     └─ Remove Button
   │        │  │
   │        │  └─ Price Summary
   │        │     ├─ Subtotal
   │        │     ├─ Discount
   │        │     ├─ Delivery
   │        │     └─ Total
   │        │
   │        ├─ Login Page
   │        │  └─ Auth Component
   │        │     ├─ Username Input
   │        │     ├─ Email Input
   │        │     ├─ Password Input
   │        │     └─ Submit Button
   │        │
   │        ├─ Signup Page
   │        │  └─ Auth Component
   │        │
   │        └─ Error Page (404)
```

---

## 10. Quick Interview Cheat Sheet

### Key Concepts to Mention

1. **State Management**: Context API for user & cart (avoid Redux overengineering)
2. **Routing**: React Router v6 with dynamic params and query strings
3. **Hooks**: `useState`, `useEffect`, `useContext` in different combinations
4. **API Integration**: Axios with async/await, token auth, error handling
5. **Component Patterns**: Reusable components (Auth, ProductBox), container + presentational
6. **Performance**: Memoization opportunities, dependency array optimization
7. **Security**: JWT in httpOnly cookies, CORS with credentials

### Code Patterns to Explain

**Controlled Component:**

```jsx
<input value={state} onChange={(e) => setState(e.target.value)} />
```

**Context Consumer:**

```jsx
const { data } = useContext(DataContext);
```

**Async Data Fetch:**

```jsx
useEffect(() => {
  async function fetchData() {
    const res = await axios.get(url);
    setState(res.data);
  }
  fetchData();
}, []);
```

**Conditional Render:**

```jsx
{
  loading && <Spinner />;
}
{
  error && <Error msg={error} />;
}
{
  data && <Content data={data} />;
}
```

**Navigation:**

```jsx
const navigate = useNavigate();
navigate("/", { replace: true });
```

### Red Flags in Code (Be Ready to Fix)

- ❌ `classNameName` typo in ProductDetails
- ❌ Nested `<Link>` in production link
- ❌ Static price totals in Cart (not calculated)
- ❌ `axios.all()` without error handling
- ❌ Missing dependency arrays in useEffect
- ❌ No loading/error states in UI
- ❌ Console.logs left in code
- ❌ useCart hook with incomplete implementation

### Interview-Ready Answers

**"Describe the authentication flow"**

> "User hits app → App calls /accesstoken → Backend returns JWT → Token stored in httpOnly cookie → JWT decoded with jwtDecode → User object set in UserContext → Header and other components read from context."

**"How do you handle adding product to cart?"**

> "User clicks Add to Cart → ProductDetails extracts product ID from URL param → Calls API with user ID and product ID → Backend adds to cart → Response updates CartContext → User navigated to /cart/{userId}."

**"What would you improve?"**

> "Add loading/error states, form validation, memoize ProductBox to prevent re-renders, handle token refresh, calculate price totals, add retry logic for failed API calls, implement proper access control for cart route."

---

## 11. Setup & Installation

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation Steps

```bash
# Clone repository
git clone <repo-url>
cd Shop_Cart

# Install dependencies
npm install

# Create .env file
echo "VITE_FAKE_STORE_URL=https://your-api-url" > .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create `.env.local` file:

```env
VITE_FAKE_STORE_URL=https://api.example.com
```

### Project Commands

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start Vite dev server (hot reload) |
| `npm run build`   | Production build                   |
| `npm run preview` | Preview production build           |
| `npm run lint`    | Run ESLint                         |

---

## 12. Common Issues & Solutions

### Issue: User not persisting after refresh

**Solution:** Ensure `/accesstoken` endpoint is called in App useEffect, and httpOnly cookies are sent with `withCredentials: true`

### Issue: Cart not updating after adding product

**Solution:** Check that API response updates CartContext, not just local state

### Issue: Products not loading in ProductList

**Solution:** Check query parameter parsing with `useSearchParams()`, verify API endpoint in fakeStoreProdApi.js

### Issue: Form not resetting after signup

**Solution:** Check `resetForm` prop is passed and dependencies are correct in Auth useEffect

---

**Last Updated:** March 19, 2026
**Version:** 1.0
**Status:** Ready for Interview Preparation ✅
