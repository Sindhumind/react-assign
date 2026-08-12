import { type SubmitEvent, useState, type ChangeEvent } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: ''
  });

  const handleChange = (e:ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e:SubmitEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Here you would typically send data to a server
  };

  return (
    <div> 
        <h1>Contact Form</h1>
           <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

        <div>
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

    

      <button type="submit">Save</button>
    </form>
    </div> 
  );
}
export default ContactForm;
