function Input({ placeholder, type = "text", onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      style={{
        padding: "10px",
        margin: "10px",
        width: "250px",
        borderRadius: "5px",
        border: "1px solid gray",
      }}
    />
  );
}

export default Input;