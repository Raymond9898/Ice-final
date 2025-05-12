

import axios from 'axios'
import { useState } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'

const AddProducts = () => {
const [product_name, setProductName] = useState("")
const [product_description, setProductDescription] = useState("")
const [product_cost, setProductCost] = useState("")
const [product_photo, setProductPhoto] = useState("")
const [loading, setLoading] = useState("")
const [success, setSuccess] = useState("")
const [error, setError] = useState("")
const [showAdminModal, setShowAdminModal] = useState(false)
const [adminPassword, setAdminPassword] = useState("")
const [adminError, setAdminError] = useState("")

const verifyAdmin = (e) => {
e.preventDefault()
setAdminError("")

 
if (adminPassword === "outlaw123") {
setShowAdminModal(false)
submitProduct()
} else {
setAdminError("Incorrect admin password")
}
}

const submitProduct = async () => {
setLoading("Please Wait as we add products")

try {
const data = new FormData()
data.append("product_name", product_name)
data.append("product_description", product_description)
data.append("product_cost", product_cost)
data.append("product_photo", product_photo)

const response = await axios.post("https://raymondotieno.pythonanywhere.com/api/add_product", data)
console.log(response);

setLoading("")
setSuccess(response.data.Meassage)

 
} catch (error) {
setLoading("")
setError(error.message)
}
}

const handleSubmit = (e) => {
e.preventDefault()
setShowAdminModal(true)
}

return (
<div className='row justify-content-center mt-4'>
<div className='col-md-6 p-4 card shadow'>
<nav className='m-4'>
<Link to='/' className="btn btn-dark">Back to Home</Link>
</nav>

 
<h2>Add Products</h2>
<p className='text-warning'>{loading}</p>
<p className='text-success'>{success}</p>
<p className='text-danger'>{error}</p>

<form onSubmit={handleSubmit}>
<input type="text" placeholder='Product Name' className='form-control' required onChange={(e)=>setProductName(e.target.value)}/>
<br />
<br />
<textarea type="text" placeholder='Product description' className='form-control' required onChange={(e)=>setProductDescription(e.target.value)}></textarea>
<br />
<br />
<input type="number" placeholder='Product cost' className='form-control' required onChange={(e)=>setProductCost(e.target.value)}/>
<br />
<br />
<input type="file" placeholder='product photo' className='form-control' required onChange={(e)=>setProductPhoto(e.target.files[0])} accept='image/*'/>
<br />
<button type="submit" className='btn btn-primary w-100'>Add Product</button>
</form>

{/* Admin Verification Modal */}
{showAdminModal && (
<div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
<div className="modal-dialog">
<div className="modal-content">
<div className="modal-header">
<h5 className="modal-title">Admin Verification</h5>
<button type="button" className="close" onClick={() => setShowAdminModal(false)}>
<span>&times;</span>
</button>
</div>
<div className="modal-body">
<p>Only admins can add products. Please enter the admin password:</p>
<input
type="password"
className="form-control"
placeholder="Enter admin password"
value={adminPassword}
onChange={(e) => setAdminPassword(e.target.value)}
/>
{adminError && <p className="text-danger mt-2">{adminError}</p>}
</div>
<div className="modal-footer">
<button
type="button"
className="btn btn-secondary"
onClick={() => setShowAdminModal(false)}
>
Cancel
</button>
<button
type="button"
className="btn btn-primary"
onClick={verifyAdmin}
>
Verify
</button>
</div>
</div>
</div>
</div>
)}
</div>
</div>
)
}

export default AddProducts
