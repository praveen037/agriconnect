import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExpertService from "../services/ExpertService";

export default function SubmitQuery({ user }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagesFiles, setImagesFiles] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    setImagesFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      crops: [],
      interestedIn: [],
      surroundingsNotes: "",
      nearWaterSource: false,
      nearFactory: false,
      userId: user ? user.id : null,
    };

    try {
      await ExpertService.submitQuery(payload, imagesFiles);
      setMessage("Query submitted successfully!");
      setTimeout(() => navigate("/queries"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit query.");
    }
  };

  return (
    <div>
      <h2>Submit Query</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      {/* Optional Images */}
      <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

      <button onClick={handleSubmit}>Submit</button>
      {message && <p>{message}</p>}
    </div>
  );
}
