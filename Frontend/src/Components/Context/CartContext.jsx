import { createContext, useEffect, useState } from "react";
import axios from 'axios'
const CartContext = createContext();
export default CartContext;

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);
  const [mydata, setData] = useState([]);
  const [catalogData, setCatalog] = useState([]);
  const [loginStatus, setLoginStatus] = useState(false);
  const [RegisterStatus, SetRegisterStatus] = useState(false);
  const [mycategory, setCategory] = useState();
  const [ImageVto, setImageVto] = useState([])
  const [items, setItems] = useState([])
  const [user, setUserInfo] = useState([])
  const [productData, setProductData] = useState([])

  const ToList = [
    { id: 13, image: "https://media.istockphoto.com/id/2189959028/photo/male-men-denim-jacket-isolated-on-white-nobody-jean-jacket-blue-outwear.jpg?s=612x612&w=0&k=20&c=Bd8b03cba82N9GreXx5w544fzlJI8MonXJ0AHUrRnNQ=", name: "Arctic Blue Classic Denim", title: "Slim Fit Blue Jeans", category: "men", price: 2999 },
    { id: 14, image: "https://media.istockphoto.com/id/475570206/photo/denim-jacket.jpg?s=612x612&w=0&k=20&c=-RlIxj6nOvJYyIMu_GS8MYUzRLw3IEVwDXen-x5JSKY=", title: "Midnight Rider Denim", category: "men", price: 2499 },
    { id: 15, image: "https://media.istockphoto.com/id/163208487/photo/male-coat-isolated-on-the-white.jpg?s=612x612&w=0&k=20&c=3Sdq5xnVS2jOYPNXI6JLwAumzyelcP_VgKVW0MVUhwo=", name: "Men Blazer", title: "Ember Core Puffer", category: "men", price: 4999 },
    { id: 16, image: "https://media.istockphoto.com/id/824872662/photo/black-t-shirt-on-brick-background.jpg?s=612x612&w=0&k=20&c=dt10eMrwBih4c3cFhvAstdlBo_ibefXDUeZGGurrlpQ=", name: "Noir Essential Tee", title: "Checked Cotton Shirt", category: "men", price: 1999 },
    { id: 17, image: "https://media.istockphoto.com/id/1285756408/photo/pink-yellow-blue-flying-womens-winter-hoodie.jpg?s=612x612&w=0&k=20&c=GoCd4au3Fof6NRrldzrMd1EW2KqhYeAHn04CY2TJsyU=", name: "Aurora Fade Sweatshirt", title: "Floral Casual Dress", category: "women", price: 3499 },
    { id: 18, image: "https://media.istockphoto.com/id/2220701778/photo/brown-cotton-t-shirt-neutral-background.jpg?s=612x612&w=0&k=20&c=Yo8FxDpb5bGwytw_xup1vSPV3DKKsE9aFY3A2qQgbQk=", name: "Cocoa Street Tee", title: "Soft Cotton Top", category: "women", price: 1799 },
    { id: 19, image: "https://media.istockphoto.com/id/1281304280/photo/folded-blue-jeans-on-a-white-background-modern-casual-clothing-flat-lay-copy-space.jpg?s=612x612&w=0&k=20&c=nSMI2abaVovzkH1n0eXeJYCkrtI-6QcD_V7OVUz4zS4=", name: "Atlas Classic Denim", title: "Blue Denim Jacket", category: "women", price: 3999 },
    { id: 20, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFh4azqNtN73tz5ZiXGb2BUbR3uqbb23icvg&s", name: "Women Kurti", title: "Printed Traditional Kurti", category: "women", price: 2299 },
    { id: 21, image: "https://media.istockphoto.com/id/639511940/photo/beautiful-denim-pants.jpg?s=612x612&w=0&k=20&c=aMeomXPDGFvk9sgbliTNamQhvrnEznVtjp4FfTgY_SY=", name: "Women Winter Coat", title: "Long Wool Coat", category: "kid", price: 5499 },
    { id: 22, image: "https://media.istockphoto.com/id/1132036871/photo/tough-guys-wear-pink.jpg?s=612x612&w=0&k=20&c=g5GvrlDNM13jtklsmhhCAJG25jGe_GcmksXVyq0L23E=", name: "Women Winter Coat", title: "Long Wool Coat", category: "women", price: 5499 },
    { id: 23, image: "https://media.istockphoto.com/id/522628236/photo/little-girl-sneakers-shoes.jpg?s=612x612&w=0&k=20&c=JT7FEcRZNzOaAwDoFldcp5iymPU8hJ8Yt-WFvKZpcvw=", name: "Women Winter Coat", title: "Long Wool Coat", category: "women", price: 5499 }
  ]

  const AllData = [
    { id: 2, image: "https://media.istockphoto.com/id/1210366042/photo/padded-jacket-isolated.jpg?s=612x612&w=0&k=20&c=KGb5pI_ySitGDoXKnShzb57SFjBWosOMRMsuzVIq2oA=", name: "Olive Green Puffer Jacket", title: "Olive Ridge Puffer", category: "women", price: 2999 },
    { id: 3, image: "https://media.istockphoto.com/id/1300962106/photo/young-handsome-guy-in-a-warm-knitted-clothes-against-a-background-of-black-wall.jpg?s=612x612&w=0&k=20&c=nsCc004L7-LivT8bWrp6PopTWNoBJGB-hpJMjn-F-S4=", name: "Mustard Puffer Jacket", title: "Golden Ember Jacket", category: "men", price: 2499 },
    { id: 4, image: "https://media.istockphoto.com/id/1329845318/photo/brown-winter-down-jacket-front-and-back-view.jpg?s=612x612&w=0&k=20&c=MBTHhNj2rDOtP5Fe79okbxNjdPhdtSU8thvwNV1PGkk=", name: "Beige Hooded Jacket", title: "Sandstorm Hooded Jacket", category: "men", price: 7999 },
    { id: 5, image: "https://media.istockphoto.com/id/1423390535/photo/happy-mixed-race-woman.jpg?s=612x612&w=0&k=20&c=zOs-zMi6U6DJ6XGt0lk3SGj9TlPAT3Wmf_Em_rwGxYU=", name: "Men Polo Shirt", title: "Casual Polo", category: "women", price: 2199 },
    { id: 6, image: "https://media.istockphoto.com/id/1289229397/photo/warm-jacket-with-fur-on-the-hood-of-a-blue-color-for-a-child-seasonal-warm-clothing.jpg?s=612x612&w=0&k=20&c=5-QEu2MReb2rtGq0_FzVEK-6CIH2UcwuLmYTwx4DtiM=", name: "Red Puffer Jacket", title: "Crimson Pulse Jacket", category: "kids", price: 1899 },
    { id: 7, image: "https://media.istockphoto.com/id/1066945152/photo/winter-blue-jacket-with-hood-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=DQIDA_CBHZUItV4Y1p0sX8H9MFiuZDcaTPPo2lbDwkE=", name: "Blue Fur Hood Jacket", title: "Frostbite Pro Jacket", category: "kids", price: 2699 },
    { id: 8, image: "https://media.istockphoto.com/id/1289229403/photo/childrens-warm-jacket-with-fur-in-bright-stripes-seasonal-warm-clothing.jpg?s=612x612&w=0&k=20&c=nDvPmtnYbD4n_PJ4kZfNfLYgJ7zYAQuhC3uiPjLK5Gs=", name: "Multicolor Kids Jacket", title: "Neon Explorer Jacket", category: "kids", price: 3499 },
    { id: 9, image: "https://media.istockphoto.com/id/1289229375/photo/autumn-insulated-jacket-for-a-child-orange-color-with-a-pattern-of-cars.jpg?s=612x612&w=0&k=20&c=_OQaS-MDHo1QUmJjzTTZXIgDXyvlNTFc4rXFLzaTfi8=", name: "Orange Kids Printed Jacket", title: "Firefly Winter Coat", category: "kids", price: 3999 },
    { id: 10, image: "https://images.pexels.com/photos/35185/hats-fedora-hat-manufacture-stack.jpg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop", name: "Men Cap", title: "CowBoy Cap", category: "men", price: 899 },
    { id: 11, image: "https://media.istockphoto.com/id/518348142/photo/blouse.jpg?s=612x612&w=0&k=20&c=npesnO4Y5iR0cpt0chCrSDlCOGtM4ZjkDBHf97nZSjw=", name: "Women Dress", title: "Summer Dress", category: "women", price: 3799 },
    ...ToList
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios("http://localhost:3000/trending");
        setItems(response.data);
      } catch (err) {
        console.error(err);
      };
    }
    fetchData();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get("http://localhost:3000/products")
      console.log(response.data)
      setProductData(response.data)
    }
    fetch();
  }, [])



  const addVtoImage = (product) => {
    setImageVto([product]);
  };


  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    const fetchProducts = () => {
      setData(ToList);
    };
    fetchProducts();
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:3000/products")
      console.log(response.data)
      setCatalog(response.data);
    };
    fetchProducts();
  }, [])

  useEffect(() => {
  }, [mycategory])

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, mycategory, setCategory, removeFromCart,
        clearCart, catalogData, mydata, loginStatus, setLoginStatus,
        RegisterStatus, SetRegisterStatus, ImageVto, addVtoImage, items, user, setUserInfo, productData, setProductData,

      }}>
      {children}
    </CartContext.Provider>
  );
};
