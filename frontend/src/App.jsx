import { useEffect, useState } from "react";

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
   
  const [sort, setSort] = useState("createdAt");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  useEffect(() => {

    let url = `http://localhost:3000/api/products?sort=${sort}`;

    if(submittedSearch){
      url += `&search=${submittedSearch}`
    }
    
    console.log("Fetching URL:", url)

    fetch(url) 
      .then((res) => res.json()) 
      .then((data) => {
        console.log("Data from backend:", data);
        setProducts(data.products || []);
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error Fetching", err)
        setLoading(false); 
      });

  }, [sort, submittedSearch]); 

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmittedSearch(search);
  }

  const handleSortChange = (e) => {
    setLoading(true);
    setSort(e.target.value)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      <h1>📦 Inventory Dashboard</h1>

      {/* --- CONTROL PANEL --- */}
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        marginBottom: "20px", 
        padding: "15px", 
        background: "#f4f4f4", 
        borderRadius: "8px" 
      }}>
        
        {/* SEARCH FORM */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '5px', flex: 1 }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={handleSearch}
            style={{ padding: "8px", flex: 1 }}
          />
          <button type="submit" style={{ padding: "8px 15px", background: "#333", color: "#fff", border: "none", cursor: "pointer" }}>
            Search
          </button>
        </form>

        {/* SORT DROPDOWN */}
        <select 
          value={sort} 
          onChange={handleSortChange}
          style={{ padding: "8px" }}
        >
          <option value="createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>

      </div>

      {/* --- PRODUCT GRID --- */}
      {loading ? (
        <p>Loading Products...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "8px",
                  background: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  color: "black"
                }}
              >
                <h3 style={{ margin: "0 0 10px 0" }}>{product.name}</h3>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
export default App;